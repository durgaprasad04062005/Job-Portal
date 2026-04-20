package com.jobportal.service;

import com.jobportal.dto.request.UpdateProfileRequest;
import com.jobportal.dto.response.UserResponse;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class UserService {

    private static final Logger log = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public UserService(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        return AuthService.toUserResponse(user);
    }

    public UserResponse getUserById(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
        return AuthService.toUserResponse(user);
    }

    public UserResponse updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (request.getFullName() != null) user.setFullName(request.getFullName());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getProfileSummary() != null) user.setProfileSummary(request.getProfileSummary());

        if ("STUDENT".equals(user.getRole())) {
            if (request.getSkills() != null) user.setSkills(request.getSkills());
            if (request.getEducation() != null) user.setEducation(request.getEducation());
            if (request.getExperience() != null) user.setExperience(request.getExperience());
        }
        if ("EMPLOYER".equals(user.getRole())) {
            if (request.getCompanyName() != null) user.setCompanyName(request.getCompanyName());
            if (request.getCompanyDescription() != null) user.setCompanyDescription(request.getCompanyDescription());
            if (request.getCompanyWebsite() != null) user.setCompanyWebsite(request.getCompanyWebsite());
            if (request.getCompanySize() != null) user.setCompanySize(request.getCompanySize());
            if (request.getIndustry() != null) user.setIndustry(request.getIndustry());
        }

        user.setProfileCompleteness(calculateProfileCompleteness(user));
        User saved = userRepository.save(user);
        log.info("Profile updated for user: {}", email);
        return AuthService.toUserResponse(saved);
    }

    public UserResponse uploadResume(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));

        if (user.getResumeFileName() != null) {
            fileStorageService.deleteFile(user.getResumeFileName(), fileStorageService.getResumeDir());
        }

        String fileName = fileStorageService.storeResume(file, user.getId());
        user.setResumeFileName(fileName);
        user.setResumeOriginalName(file.getOriginalFilename());
        user.setResumeUrl("/files/resumes/" + fileName);
        user.setProfileCompleteness(calculateProfileCompleteness(user));

        User saved = userRepository.save(user);
        log.info("Resume uploaded for user: {}", email);
        return AuthService.toUserResponse(saved);
    }

    public UserResponse uploadProfilePicture(String email, MultipartFile file) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
        String fileName = fileStorageService.storeLogo(file, user.getId());
        user.setProfilePicture("/files/logos/" + fileName);
        return AuthService.toUserResponse(userRepository.save(user));
    }

    public Page<UserResponse> getAllUsers(String role, String keyword, Pageable pageable) {
        Page<User> users;
        if (keyword != null && !keyword.isEmpty()) {
            users = userRepository.searchByRoleAndKeyword(role, keyword, pageable);
        } else if (role != null && !role.isEmpty()) {
            users = userRepository.findByRole(role, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        return users.map(AuthService::toUserResponse);
    }

    public void toggleUserStatus(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        user.setActive(!user.isActive());
        userRepository.save(user);
        log.info("User {} status toggled to: {}", userId, user.isActive());
    }

    private int calculateProfileCompleteness(User user) {
        int score = 0;
        if (user.getFullName() != null && !user.getFullName().isEmpty()) score += 20;
        if (user.getEmail() != null && !user.getEmail().isEmpty()) score += 10;
        if (user.getPhone() != null && !user.getPhone().isEmpty()) score += 10;
        if (user.getLocation() != null && !user.getLocation().isEmpty()) score += 10;
        if (user.getProfileSummary() != null && !user.getProfileSummary().isEmpty()) score += 15;
        if (user.getResumeUrl() != null && !user.getResumeUrl().isEmpty()) score += 20;
        if (user.getSkills() != null && !user.getSkills().isEmpty()) score += 15;
        return score;
    }
}
