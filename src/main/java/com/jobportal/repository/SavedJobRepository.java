package com.jobportal.repository;

import com.jobportal.model.SavedJob;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SavedJobRepository extends MongoRepository<SavedJob, String> {

    Page<SavedJob> findByUserId(String userId, Pageable pageable);

    List<SavedJob> findByUserId(String userId);

    Optional<SavedJob> findByUserIdAndJobId(String userId, String jobId);

    boolean existsByUserIdAndJobId(String userId, String jobId);

    void deleteByUserIdAndJobId(String userId, String jobId);

    long countByUserId(String userId);
}
