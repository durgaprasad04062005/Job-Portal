package com.jobportal.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "jobs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Job {

    @Id
    private String id;

    private String employerId;
    private String companyName;
    private String companyLogoUrl;

    private String title;
    private String description;
    private String requirements;
    private String responsibilities;

    private List<String> skillsRequired = new ArrayList<>();
    private String category;
    private String location;
    private String jobType;         // FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, REMOTE
    private String experienceLevel; // ENTRY, MID, SENIOR, LEAD

    private int experienceMinYears;
    private int experienceMaxYears;

    private double salaryMin;
    private double salaryMax;
    private String salaryCurrency;
    private boolean salaryNegotiable;

    private String status;          // ACTIVE, CLOSED, DRAFT, EXPIRED
    private LocalDateTime deadline;

    private int applicationCount;
    private int viewCount;

    private List<String> benefits = new ArrayList<>();
    private String workMode;        // ONSITE, REMOTE, HYBRID

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
