package com.jobportal.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class JobRequest {

    @NotBlank(message = "Job title is required")
    @Size(min = 3, max = 150, message = "Title must be between 3 and 150 characters")
    private String title;

    @NotBlank(message = "Job description is required")
    @Size(min = 50, message = "Description must be at least 50 characters")
    private String description;

    private String requirements;
    private String responsibilities;

    private List<String> skillsRequired;

    @NotBlank(message = "Category is required")
    private String category;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Job type is required")
    @Pattern(regexp = "FULL_TIME|PART_TIME|CONTRACT|INTERNSHIP|REMOTE",
             message = "Invalid job type")
    private String jobType;

    @Pattern(regexp = "ENTRY|MID|SENIOR|LEAD|",
             message = "Invalid experience level")
    private String experienceLevel;

    @Min(value = 0, message = "Minimum experience cannot be negative")
    private int experienceMinYears;

    @Min(value = 0, message = "Maximum experience cannot be negative")
    private int experienceMaxYears;

    @Min(value = 0, message = "Minimum salary cannot be negative")
    private double salaryMin;

    @Min(value = 0, message = "Maximum salary cannot be negative")
    private double salaryMax;

    private String salaryCurrency = "USD";
    private boolean salaryNegotiable;

    private String status = "ACTIVE";
    private LocalDateTime deadline;

    private List<String> benefits;

    @Pattern(regexp = "ONSITE|REMOTE|HYBRID|",
             message = "Invalid work mode")
    private String workMode;
}
