package com.jobportal.dto.response;

import com.jobportal.model.User;
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
public class UserResponse {

    private String id;
    private String fullName;
    private String email;
    private String role;
    private String phone;
    private String location;
    private String profileSummary;
    private String profilePicture;
    private boolean active;
    private boolean emailVerified;
    private int profileCompleteness;

    // Student fields
    private List<String> skills;
    private List<User.Education> education;
    private List<User.Experience> experience;
    private String resumeUrl;
    private String resumeFileName;
    private String resumeOriginalName;

    // Employer fields
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String companySize;
    private String industry;
    private String companyLogoUrl;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
