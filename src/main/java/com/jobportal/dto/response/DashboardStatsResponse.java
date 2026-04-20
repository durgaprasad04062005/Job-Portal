package com.jobportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {

    // Admin stats
    private long totalUsers;
    private long totalStudents;
    private long totalEmployers;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private long activeUsers;

    // Employer stats
    private long jobsPosted;
    private long totalApplicants;
    private long shortlistedCount;
    private long rejectedCount;
    private long activeOpenings;
    private long hiredCount;

    // Student stats
    private long appliedJobs;
    private long savedJobs;
    private long underReviewCount;
    private long interviewCount;

    // Charts data
    private Map<String, Long> applicationsByStatus;
    private Map<String, Long> jobsByCategory;
    private Map<String, Long> applicationsByMonth;
}
