package com.jobportal.controller;

import com.jobportal.dto.request.ApplicationRequest;
import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.ApplicationResponse;
import com.jobportal.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    /**
     * POST /api/applications/apply
     * Apply for a job (STUDENT only)
     */
    @PostMapping("/apply")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> applyForJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestPart("application") ApplicationRequest request,
            @RequestPart(value = "resume", required = false) MultipartFile resumeFile) {
        ApplicationResponse application = applicationService.applyForJob(
                userDetails.getUsername(), request, resumeFile);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Application submitted successfully", application));
    }

    /**
     * GET /api/applications/my-applications
     * Get student's own applications
     */
    @GetMapping("/my-applications")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("appliedAt").descending());
        Page<ApplicationResponse> applications = applicationService.getMyApplications(
                userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    /**
     * GET /api/applications/job/{jobId}
     * Get applications for a specific job (EMPLOYER only)
     */
    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getJobApplications(
            @PathVariable String jobId,
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("appliedAt").descending());
        Page<ApplicationResponse> applications = applicationService.getJobApplications(
                jobId, userDetails.getUsername(), status, pageable);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    /**
     * GET /api/applications/employer/all
     * Get all applications for employer
     */
    @GetMapping("/employer/all")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<Page<ApplicationResponse>>> getEmployerApplications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size,
                Sort.by("appliedAt").descending());
        Page<ApplicationResponse> applications = applicationService.getEmployerApplications(
                userDetails.getUsername(), pageable);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    /**
     * PATCH /api/applications/{id}/status
     * Update application status (EMPLOYER only)
     */
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<ApplicationResponse>> updateStatus(
            @PathVariable String id,
            @RequestParam String status,
            @RequestParam(required = false) String note,
            @AuthenticationPrincipal UserDetails userDetails) {
        ApplicationResponse application = applicationService.updateApplicationStatus(
                id, status, note, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Application status updated", application));
    }

    /**
     * DELETE /api/applications/{id}/withdraw
     * Withdraw application (STUDENT only)
     */
    @DeleteMapping("/{id}/withdraw")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Void>> withdrawApplication(
            @PathVariable String id,
            @AuthenticationPrincipal UserDetails userDetails) {
        applicationService.withdrawApplication(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Application withdrawn successfully"));
    }
}
