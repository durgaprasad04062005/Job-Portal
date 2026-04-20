package com.jobportal.service;

import com.jobportal.dto.response.DashboardStatsResponse;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;

    public DashboardService(UserRepository userRepository,
                            JobRepository jobRepository,
                            ApplicationRepository applicationRepository,
                            SavedJobRepository savedJobRepository) {
        this.userRepository = userRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
    }

    public DashboardStatsResponse getAdminStats() {
        long totalStudents  = userRepository.countByRole("STUDENT");
        long totalEmployers = userRepository.countByRole("EMPLOYER");
        long totalJobs      = jobRepository.count();
        long activeJobs     = jobRepository.countByStatus("ACTIVE");
        long totalApps      = applicationRepository.count();
        long activeUsers    = userRepository.countByActive(true);

        Map<String, Long> appsByStatus = new HashMap<>();
        for (String s : new String[]{"APPLIED","UNDER_REVIEW","SHORTLISTED","REJECTED","HIRED"}) {
            appsByStatus.put(s, applicationRepository.countByStatus(s));
        }

        return DashboardStatsResponse.builder()
                .totalUsers(totalStudents + totalEmployers)
                .totalStudents(totalStudents)
                .totalEmployers(totalEmployers)
                .totalJobs(totalJobs)
                .activeJobs(activeJobs)
                .totalApplications(totalApps)
                .activeUsers(activeUsers)
                .applicationsByStatus(appsByStatus)
                .build();
    }

    public DashboardStatsResponse getEmployerStats(String employerEmail) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));

        return DashboardStatsResponse.builder()
                .jobsPosted(jobRepository.countByEmployerId(employer.getId()))
                .activeOpenings(jobRepository.countByEmployerIdAndStatus(employer.getId(), "ACTIVE"))
                .totalApplicants(applicationRepository.countByEmployerId(employer.getId()))
                .shortlistedCount(applicationRepository.countByEmployerIdAndStatus(employer.getId(), "SHORTLISTED"))
                .rejectedCount(applicationRepository.countByEmployerIdAndStatus(employer.getId(), "REJECTED"))
                .hiredCount(applicationRepository.countByEmployerIdAndStatus(employer.getId(), "HIRED"))
                .build();
    }

    public DashboardStatsResponse getStudentStats(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", studentEmail));

        return DashboardStatsResponse.builder()
                .appliedJobs(applicationRepository.countByApplicantId(student.getId()))
                .savedJobs(savedJobRepository.countByUserId(student.getId()))
                .underReviewCount(applicationRepository.countByEmployerIdAndStatus(student.getId(), "UNDER_REVIEW"))
                .shortlistedCount(applicationRepository.countByEmployerIdAndStatus(student.getId(), "SHORTLISTED"))
                .build();
    }
}
