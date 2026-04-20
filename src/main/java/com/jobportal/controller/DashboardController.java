package com.jobportal.controller;

import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.DashboardStatsResponse;
import com.jobportal.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    /**
     * GET /api/dashboard/employer
     * Get employer dashboard stats
     */
    @GetMapping("/employer")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getEmployerDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardStatsResponse stats = dashboardService.getEmployerStats(
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }

    /**
     * GET /api/dashboard/student
     * Get student dashboard stats
     */
    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getStudentDashboard(
            @AuthenticationPrincipal UserDetails userDetails) {
        DashboardStatsResponse stats = dashboardService.getStudentStats(
                userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved", stats));
    }
}
