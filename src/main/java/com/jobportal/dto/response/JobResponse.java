package com.jobportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobResponse {

    private String id;
    private String employerId;
    private String companyName;
    private String companyLogoUrl;
    private String title;
    private String description;
    private String requirements;
    private String responsibilities;
    private List<String> skillsRequired;
    private String category;
    private String location;
    private String jobType;
    private String experienceLevel;
    private int experienceMinYears;
    private int experienceMaxYears;
    private double salaryMin;
    private double salaryMax;
    private String salaryCurrency;
    private boolean salaryNegotiable;
    private String status;
    private LocalDateTime deadline;
    private int applicationCount;
    private int viewCount;
    private List<String> benefits;
    private String workMode;
    private boolean saved;          // whether current user saved this job
    private boolean applied;        // whether current user applied
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
