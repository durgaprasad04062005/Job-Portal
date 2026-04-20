package com.jobportal.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationResponse {

    private String id;
    private String jobId;
    private String applicantId;
    private String employerId;

    // Enriched job info
    private String jobTitle;
    private String companyName;
    private String jobLocation;
    private String jobType;

    // Enriched applicant info
    private String applicantName;
    private String applicantEmail;
    private String applicantPhone;
    private String applicantLocation;
    private String resumeUrl;
    private String resumeFileName;

    private String coverLetter;
    private String status;
    private String employerNote;
    private String interviewDate;
    private String interviewLocation;
    private String interviewType;

    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}
