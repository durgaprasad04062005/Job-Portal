package com.jobportal.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "applications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    private String id;

    private String jobId;
    private String applicantId;
    private String employerId;

    private String resumeUrl;
    private String resumeFileName;
    private String coverLetter;

    private String status; // APPLIED, UNDER_REVIEW, SHORTLISTED, REJECTED, HIRED, WITHDRAWN

    private String employerNote;
    private String interviewDate;
    private String interviewLocation;
    private String interviewType; // ONLINE, ONSITE, PHONE

    @CreatedDate
    private LocalDateTime appliedAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
