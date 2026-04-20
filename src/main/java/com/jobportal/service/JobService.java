package com.jobportal.service;

import com.jobportal.dto.request.JobRequest;
import com.jobportal.dto.response.JobResponse;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.exception.UnauthorizedException;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import com.jobportal.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.support.PageableExecutionUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private static final Logger log = LoggerFactory.getLogger(JobService.class);

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final MongoTemplate mongoTemplate;
    private final ModelMapper modelMapper;

    public JobService(JobRepository jobRepository,
                      UserRepository userRepository,
                      ApplicationRepository applicationRepository,
                      SavedJobRepository savedJobRepository,
                      MongoTemplate mongoTemplate,
                      ModelMapper modelMapper) {
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
        this.mongoTemplate = mongoTemplate;
        this.modelMapper = modelMapper;
    }

    public JobResponse createJob(String employerEmail, JobRequest request) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));

        Job job = modelMapper.map(request, Job.class);
        job.setEmployerId(employer.getId());
        job.setCompanyName(employer.getCompanyName() != null ? employer.getCompanyName() : employer.getFullName());
        job.setCompanyLogoUrl(employer.getCompanyLogoUrl());
        job.setApplicationCount(0);
        job.setViewCount(0);

        Job saved = jobRepository.save(job);
        log.info("Job created: {} by employer: {}", saved.getId(), employerEmail);
        return toJobResponse(saved, null);
    }

    public JobResponse updateJob(String jobId, String employerEmail, JobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));

        if (!job.getEmployerId().equals(employer.getId()))
            throw new UnauthorizedException("You are not authorized to update this job");

        modelMapper.map(request, job);
        job.setId(jobId);
        job.setEmployerId(employer.getId());
        Job saved = jobRepository.save(job);
        log.info("Job updated: {}", jobId);
        return toJobResponse(saved, null);
    }

    public void deleteJob(String jobId, String employerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));

        if (!job.getEmployerId().equals(employer.getId()))
            throw new UnauthorizedException("You are not authorized to delete this job");

        jobRepository.delete(job);
        log.info("Job deleted: {}", jobId);
    }

    public JobResponse getJobById(String jobId, String currentUserEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        job.setViewCount(job.getViewCount() + 1);
        jobRepository.save(job);

        String userId = null;
        if (currentUserEmail != null) {
            userId = userRepository.findByEmail(currentUserEmail).map(User::getId).orElse(null);
        }
        return toJobResponse(job, userId);
    }

    public Page<JobResponse> searchJobs(String keyword, String category, String location,
                                         String jobType, String experienceLevel,
                                         Double salaryMin, Double salaryMax,
                                         String workMode, String currentUserEmail,
                                         Pageable pageable) {
        Query query = new Query();
        Criteria criteria = Criteria.where("status").is("ACTIVE");

        if (keyword != null && !keyword.isEmpty()) {
            criteria = criteria.andOperator(new Criteria().orOperator(
                    Criteria.where("title").regex(keyword, "i"),
                    Criteria.where("description").regex(keyword, "i"),
                    Criteria.where("companyName").regex(keyword, "i"),
                    Criteria.where("skillsRequired").regex(keyword, "i")
            ));
        }
        if (category != null && !category.isEmpty()) criteria = criteria.and("category").regex(category, "i");
        if (location != null && !location.isEmpty()) criteria = criteria.and("location").regex(location, "i");
        if (jobType != null && !jobType.isEmpty()) criteria = criteria.and("jobType").is(jobType);
        if (experienceLevel != null && !experienceLevel.isEmpty()) criteria = criteria.and("experienceLevel").is(experienceLevel);
        if (workMode != null && !workMode.isEmpty()) criteria = criteria.and("workMode").is(workMode);
        if (salaryMin != null) criteria = criteria.and("salaryMax").gte(salaryMin);
        if (salaryMax != null) criteria = criteria.and("salaryMin").lte(salaryMax);

        query.addCriteria(criteria);

        String userId = null;
        if (currentUserEmail != null) {
            userId = userRepository.findByEmail(currentUserEmail).map(User::getId).orElse(null);
        }
        final String finalUserId = userId;
        long count = mongoTemplate.count(query, Job.class);
        query.with(pageable);
        List<Job> jobs = mongoTemplate.find(query, Job.class);
        List<JobResponse> responses = jobs.stream()
                .map(j -> toJobResponse(j, finalUserId))
                .collect(Collectors.toList());
        return PageableExecutionUtils.getPage(responses, pageable, () -> count);
    }

    public Page<JobResponse> getEmployerJobs(String employerEmail, Pageable pageable) {
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));
        return jobRepository.findByEmployerId(employer.getId(), pageable)
                .map(j -> toJobResponse(j, null));
    }

    public Page<JobResponse> getAllJobs(String status, Pageable pageable) {
        if (status != null && !status.isEmpty())
            return jobRepository.findByStatus(status, pageable).map(j -> toJobResponse(j, null));
        return jobRepository.findAll(pageable).map(j -> toJobResponse(j, null));
    }

    public void adminDeleteJob(String jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        jobRepository.delete(job);
        log.info("Admin deleted job: {}", jobId);
    }

    public JobResponse updateJobStatus(String jobId, String status, String employerEmail) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "id", jobId));
        User employer = userRepository.findByEmail(employerEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", employerEmail));

        if (!job.getEmployerId().equals(employer.getId()))
            throw new UnauthorizedException("You are not authorized to update this job");

        job.setStatus(status);
        return toJobResponse(jobRepository.save(job), null);
    }

    private JobResponse toJobResponse(Job job, String userId) {
        JobResponse response = modelMapper.map(job, JobResponse.class);
        if (userId != null) {
            response.setSaved(savedJobRepository.existsByUserIdAndJobId(userId, job.getId()));
            response.setApplied(applicationRepository.existsByJobIdAndApplicantId(job.getId(), userId));
        }
        return response;
    }
}
