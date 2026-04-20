package com.jobportal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ApplicationRequest {

    @NotBlank(message = "Job ID is required")
    private String jobId;

    private String coverLetter;

    // Resume will be uploaded separately or use profile resume
    private boolean useProfileResume = true;
}
