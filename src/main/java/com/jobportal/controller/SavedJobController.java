package com.jobportal.controller;

import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.JobResponse;
import com.jobportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student/saved-jobs")
@RequiredArgsConstructor
@PreAuthorize("hasRole('STUDENT')")
public class SavedJobController {

    private final SavedJobService savedJobService;

    /**
     * POST /api/student/saved-jobs/{jobId}
     * Save a job
     */
    @PostMapping("/{jobId}")
    public ResponseEntity<ApiResponse<Void>> saveJob(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserDetails userDetails) {
        savedJobService.saveJob(userDetails.getUsername(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job saved successfully"));
    }

    /**
     * DELETE /api/student/saved-jobs/{jobId}
     * Unsave a job
     */
    @DeleteMapping("/{jobId}")
    public ResponseEntity<ApiResponse<Void>> unsaveJob(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserDetails userDetails) {
        savedJobService.unsaveJob(userDetails.getUsername(), jobId);
        return ResponseEntity.ok(ApiResponse.success("Job removed from saved list"));
    }

    /**
     * GET /api/student/saved-jobs
     * Get all saved jobs
     */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<JobResponse>>> getSavedJobs(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<JobResponse> jobs = savedJobService.getSavedJobs(
                userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Saved jobs retrieved", jobs));
    }
}
