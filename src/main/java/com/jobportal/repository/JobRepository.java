package com.jobportal.repository;

import com.jobportal.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {

    Page<Job> findByEmployerId(String employerId, Pageable pageable);

    List<Job> findByEmployerId(String employerId);

    Page<Job> findByStatus(String status, Pageable pageable);

    @Query("{ 'status': 'ACTIVE', $or: [ " +
           "{ 'title': { $regex: ?0, $options: 'i' } }, " +
           "{ 'description': { $regex: ?0, $options: 'i' } }, " +
           "{ 'companyName': { $regex: ?0, $options: 'i' } } ] }")
    Page<Job> searchByKeyword(String keyword, Pageable pageable);

    @Query("{ 'status': 'ACTIVE', " +
           "'category': { $regex: ?0, $options: 'i' }, " +
           "'location': { $regex: ?1, $options: 'i' }, " +
           "'jobType': { $regex: ?2, $options: 'i' } }")
    Page<Job> filterJobs(String category, String location, String jobType, Pageable pageable);

    long countByEmployerId(String employerId);

    long countByStatus(String status);

    long countByEmployerIdAndStatus(String employerId, String status);
}
