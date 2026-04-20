package com.jobportal.service;

import com.jobportal.dto.request.ApplicationRequest;
import com.jobportal.dto.response.ApplicationResponse;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class ApplicationService {

    private static final Logger log = LoggerFactory.getLogger(ApplicationService.class);

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final NotificationService notificationService;
    private final EmailService emailService;
    private final ModelMapper modelMapper;

    public ApplicationService(ApplicationRepository applicationRepository,
                               JobRepository jobRepository,
                               UserRepository userRepository,
                               FileStorageService fileStorageService,
                               NotificationService notificationService,
                               EmailService emailService,
                               ModelMapper modelMapper) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.notificationService = notificationService;
        this.emailService = emailService;
        this.modelMapper = modelMapper;
    }

    public ApplicationResponse applyForJob(String applicantEmail,
                                            ApplicationRequest request,
                                            MultipartFile resumeFile) {
        User applicant = userRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", applicantEmail));
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", request.getJobId()));

        if (!"ACTIVE".equals(job.getStatus()))
            throw new BadRequestException("This job is no longer accepting applications");
        if (applicationRepository.existsByJobIdAndApplicantId(job.getId(), applicant.getId()))
            throw new BadRequestException("You have already applied for this job");

        String resumeUrl = applicant.getResumeUrl();
        String resumeFileName = applicant.getResumeFileName();

        if (resumeFile != null && !resumeFile.isEmpty()) {
            resumeFileName = fileStorageService.storeResume(resumeFile, applicant.getId());
            resumeUrl = "/files/resumes/" + resumeFileName;
        }
        if (resumeUrl == null)
            throw new BadRequestException("Please upload a resume before applying");

        Application application = Application.builder()
                .jobId(job.getId())
                .applicantId(applicant.getId())
                .employerId(job.getEmployerId())
                .resumeUrl(resumeUrl)
                .resumeFileName(resumeFileName)
                .coverLetter(request.getCoverLetter())
                .status("APPLIED")
                .build();

        Application saved = applicationRepository.save(application);
        job.setApplicationCount(job.getApplicationCount() + 1);
        jobRepository.save(job);

        userRepository.findById(job.getEmployerId()).ifPresent(employer -> {
            notificationService.sendNotification(employer.getId(),
                    "New Application Received",
                    applicant.getFullName() + " applied for " + job.getTitle(),
                    "APPLICATION_UPDATE", "/employer/applications/" + saved.getId());
            emailService.sendNewApplicationNotification(employer.getEmail(),
                    employer.getFullName(), applicant.getFullName(), job.getTitle());
        });

        log.info("Application submitted: {} by {}", saved.getId(), applicantEmail);
        return enrichApplication(saved);
    }

    public Page<ApplicationResponse> getMyApplications(String applicantEmail, Pageable pageable) {
        User applicant = userRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", applicantEmail));
        return applicationRepository.findByApplicantId(applicant.getId(), pageable)
                .map(this::enrichApplication);
    }

    public Page<ApplicationResponse> getJobApplications(String jobId, String employerEmail,
                                                          String status, Pageable pageable) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));

        if (!job.getEmployerId().equals(employer.getId()))
            throw new UnauthorizedException("You are not authorized to view these applications");

        if (status != null && !status.isEmpty())
            return applicationRepository.findByJobIdAndStatus(jobId, status, pageable).map(this::enrichApplication);
        return applicationRepository.findByJobId(jobId, pageable).map(this::enrichApplication);
    }

    public Page<ApplicationResponse> getEmployerApplications(String employerEmail, Pageable pageable) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));
        return applicationRepository.findByEmployerId(employer.getId(), pageable).map(this::enrichApplication);
    }

    public ApplicationResponse updateApplicationStatus(String applicationId, String status,
                                                        String employerNote, String employerEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));

        if (!application.getEmployerId().equals(employer.getId()))
            throw new UnauthorizedException("You are not authorized to update this application");

        application.setStatus(status);
        if (employerNote != null) application.setEmployerNote(employerNote);
        Application saved = applicationRepository.save(application);

        userRepository.findById(application.getApplicantId()).ifPresent(applicant ->
            jobRepository.findById(application.getJobId()).ifPresent(job -> {
                notificationService.sendNotification(applicant.getId(),
                        "Application Status Updated",
                        getStatusMessage(status, job.getTitle()),
                        "APPLICATION_UPDATE", "/student/applications/" + applicationId);

                // Send the appropriate email based on the new status
                switch (status) {
                    case "SHORTLISTED"  -> emailService.sendShortlistedEmail(
                            applicant.getEmail(), applicant.getFullName(), job.getTitle());
                    case "REJECTED"     -> emailService.sendRejectedEmail(
                            applicant.getEmail(), applicant.getFullName(), job.getTitle());
                    case "HIRED"        -> emailService.sendHiredEmail(
                            applicant.getEmail(), applicant.getFullName(), job.getTitle());
                    case "UNDER_REVIEW" -> emailService.sendUnderReviewEmail(
                            applicant.getEmail(), applicant.getFullName(), job.getTitle());
                    default             -> emailService.sendApplicationStatusUpdate(
                            applicant.getEmail(), applicant.getFullName(), job.getTitle(), status);
                }
            })
        );

        log.info("Application {} status updated to {}", applicationId, status);
        return enrichApplication(saved);
    }

    public void withdrawApplication(String applicationId, String applicantEmail) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "id", applicationId));
        User applicant = userRepository.findByEmail(applicantEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", applicantEmail));

        if (!application.getApplicantId().equals(applicant.getId()))
            throw new UnauthorizedException("You are not authorized to withdraw this application");
        if ("HIRED".equals(application.getStatus()))
            throw new BadRequestException("Cannot withdraw an accepted application");

        application.setStatus("WITHDRAWN");
        applicationRepository.save(application);

        jobRepository.findById(application.getJobId()).ifPresent(job -> {
            job.setApplicationCount(Math.max(0, job.getApplicationCount() - 1));
            jobRepository.save(job);
        });
        log.info("Application {} withdrawn by {}", applicationId, applicantEmail);
    }

    private ApplicationResponse enrichApplication(Application application) {
        ApplicationResponse response = modelMapper.map(application, ApplicationResponse.class);
        jobRepository.findById(application.getJobId()).ifPresent(job -> {
            response.setJobTitle(job.getTitle());
            response.setCompanyName(job.getCompanyName());
            response.setJobLocation(job.getLocation());
            response.setJobType(job.getJobType());
        });
        userRepository.findById(application.getApplicantId()).ifPresent(applicant -> {
            response.setApplicantName(applicant.getFullName());
            response.setApplicantEmail(applicant.getEmail());
            response.setApplicantPhone(applicant.getPhone());
            response.setApplicantLocation(applicant.getLocation());
        });
        return response;
    }

    private String getStatusMessage(String status, String jobTitle) {
        return switch (status) {
            case "UNDER_REVIEW" -> "Your application for " + jobTitle + " is under review";
            case "SHORTLISTED"  -> "Congratulations! You've been shortlisted for " + jobTitle;
            case "REJECTED"     -> "Your application for " + jobTitle + " was not selected";
            case "HIRED"        -> "Congratulations! You've been hired for " + jobTitle;
            default -> "Your application for " + jobTitle + " status updated to " + status;
        };
    }
}
