package com.jobportal.repository;

import com.jobportal.model.Application;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {

    Page<Application> findByApplicantId(String applicantId, Pageable pageable);

    List<Application> findByApplicantId(String applicantId);

    Page<Application> findByJobId(String jobId, Pageable pageable);

    List<Application> findByJobId(String jobId);

    Page<Application> findByEmployerId(String employerId, Pageable pageable);

    Optional<Application> findByJobIdAndApplicantId(String jobId, String applicantId);

    boolean existsByJobIdAndApplicantId(String jobId, String applicantId);

    long countByApplicantId(String applicantId);

    long countByEmployerId(String employerId);

    long countByEmployerIdAndStatus(String employerId, String status);

    long countByJobId(String jobId);

    long countByStatus(String status);

    Page<Application> findByJobIdAndStatus(String jobId, String status, Pageable pageable);
}
