package com.jobportal.service;

import com.jobportal.dto.response.JobResponse;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.SavedJob;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SavedJobService {

    private static final Logger log = LoggerFactory.getLogger(SavedJobService.class);

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final ModelMapper modelMapper;

    public SavedJobService(SavedJobRepository savedJobRepository,
                           JobRepository jobRepository,
                           UserRepository userRepository,
                           ApplicationRepository applicationRepository,
                           ModelMapper modelMapper) {
        this.savedJobRepository = savedJobRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.modelMapper = modelMapper;
    }

    public void saveJob(String userEmail, String jobId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        if (!jobRepository.existsById(jobId))
            throw new ResourceNotFoundException("Job", "id", jobId);
        if (savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId))
            throw new BadRequestException("Job is already saved");

        savedJobRepository.save(SavedJob.builder().userId(user.getId()).jobId(jobId).build());
        log.info("Job {} saved by user {}", jobId, userEmail);
    }

    public void unsaveJob(String userEmail, String jobId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        if (!savedJobRepository.existsByUserIdAndJobId(user.getId(), jobId))
            throw new BadRequestException("Job is not saved");
        savedJobRepository.deleteByUserIdAndJobId(user.getId(), jobId);
        log.info("Job {} unsaved by user {}", jobId, userEmail);
    }

    public Page<JobResponse> getSavedJobs(String userEmail, Pageable pageable) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", userEmail));
        Page<SavedJob> savedJobs = savedJobRepository.findByUserId(user.getId(), pageable);

        List<JobResponse> responses = savedJobs.getContent().stream()
                .map(sj -> jobRepository.findById(sj.getJobId()).map(job -> {
                    JobResponse r = modelMapper.map(job, JobResponse.class);
                    r.setSaved(true);
                    r.setApplied(applicationRepository.existsByJobIdAndApplicantId(job.getId(), user.getId()));
                    return r;
                }).orElse(null))
                .filter(j -> j != null)
                .collect(Collectors.toList());

        return new PageImpl<>(responses, pageable, savedJobs.getTotalElements());
    }
}
