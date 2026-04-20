package com.jobportal.controller;

import com.jobportal.dto.request.JobRequest;
import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.JobResponse;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService jobService;

    /**
     * GET /api/jobs
     * Search and filter jobs (public)
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobResponse>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobType,
            @RequestParam(required = false) String experienceLevel,
            @RequestParam(required = false) Double salaryMin,
            @RequestParam(required = false) Double salaryMax,
            @RequestParam(required = false) String workMode,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @AuthenticationPrincipal UserDetails userDetails) {

        Sort sort = sortDir.equalsIgnoreCase("asc") ?
                Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        String email = userDetails != null ? userDetails.getUsername() : null;

        Page<JobResponse> jobs = jobService.searchJobs(
                keyword, category, location, jobType, experienceLevel,
                salaryMin, salaryMax, workMode, email, pageable);

        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved", jobs));
    }

    /**
     * GET /api/jobs/{id}
     * Get job details by ID (public)
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> getJobById(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails != null ? userDetails.getUsername() : null;
        JobResponse job = jobService.getJobById(id, email);
        return ResponseEntity.ok(ApiResponse.success("Job retrieved", job));
    }

    /**
     * POST /api/jobs
     * Create a new job (EMPLOYER only)
     */
    @PostMapping
    public ResponseEntity<ApiResponse<JobResponse>> createJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JobRequest request) {
        JobResponse job = jobService.createJob(userDetails.getUsername(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Job created successfully", job));
    }

    /**
     * PUT /api/jobs/{id}
     * Update a job (EMPLOYER only)
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<JobResponse>> updateJob(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody JobRequest request) {
        JobResponse job = jobService.updateJob(id, userDetails.getUsername(), request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", job));
    }

    /**
     * DELETE /api/jobs/{id}
     * Delete a job (EMPLOYER only)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteJob(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        jobService.deleteJob(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job deleted successfully"));
    }

    /**
     * PATCH /api/jobs/{id}/status
     * Update job status (EMPLOYER only)
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<JobResponse>> updateJobStatus(
            @PathVariable String id,
            @RequestParam String status,
            @AuthenticationPrincipal UserDetails userDetails) {
        JobResponse job = jobService.updateJobStatus(id, status, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Job status updated", job));
    }

    /**
     * GET /api/jobs/employer/my-jobs
     * Get employer's own jobs
     */
    @GetMapping("/employer/my-jobs")
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getMyJobs(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("createdAt").descending());
        Page<JobResponse> jobs = jobService.getEmployerJobs(
                userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved", jobs));
    }
}
