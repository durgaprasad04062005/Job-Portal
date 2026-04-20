package com.jobportal.dto.request;

import com.jobportal.model.User;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, max = 100, message = "Full name must be between 2 and 100 characters")
    private String fullName;

    private String phone;
    private String location;

    @Size(max = 1000, message = "Profile summary cannot exceed 1000 characters")
    private String profileSummary;

    // Student fields
    private List<String> skills;
    private List<User.Education> education;
    private List<User.Experience> experience;

    // Employer fields
    private String companyName;
    private String companyDescription;
    private String companyWebsite;
    private String companySize;
    private String industry;
}
