package com.jobportal.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String fullName;

    @Indexed(unique = true)
    private String email;

    private String password;

    private String role; // STUDENT, EMPLOYER, ADMIN

    private String phone;

    private String location;

    private String profileSummary;

    private String profilePicture;

    // Student-specific fields
    private List<String> skills = new ArrayList<>();
    private List<Education> education = new ArrayList<>();
    private List<Experience> experience = new ArrayList<>();
    private String resumeUrl;
    private String resumeFileName;
    private String resumeOriginalName;
    private int profileCompleteness;

    // Employer-specific fields
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String companySize;
    private String industry;
    private String companyLogoUrl;

    // Account status
    private boolean active = true;
    private boolean emailVerified = false;
    private String emailVerificationToken;
    private String passwordResetToken;
    private LocalDateTime passwordResetExpiry;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Education {
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private String startYear;
        private String endYear;
        private String grade;
        private boolean current;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Experience {
        private String company;
        private String position;
        private String description;
        private String startDate;
        private String endDate;
        private boolean current;
        private String location;
    }
}
