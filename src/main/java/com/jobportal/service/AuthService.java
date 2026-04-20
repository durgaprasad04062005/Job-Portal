package com.jobportal.service;

import com.jobportal.dto.request.*;
import com.jobportal.dto.response.AuthResponse;
import com.jobportal.dto.response.UserResponse;
import com.jobportal.exception.BadRequestException;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtTokenProvider;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.UUID;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.emailService = emailService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered");
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .phone(request.getPhone())
                .active(true)
                .emailVerified(false)
                .emailVerificationToken(UUID.randomUUID().toString())
                .skills(new ArrayList<>())
                .education(new ArrayList<>())
                .experience(new ArrayList<>())
                .build();

        if ("EMPLOYER".equals(request.getRole())) {
            user.setCompanyName(request.getCompanyName());
        }

        user.setProfileCompleteness(calculateProfileCompleteness(user));
        User savedUser = userRepository.save(user);

        try {
            emailService.sendEmailVerification(savedUser.getEmail(),
                    savedUser.getEmailVerificationToken());
        } catch (Exception e) {
            log.warn("Could not send verification email to {}: {}", savedUser.getEmail(), e.getMessage());
        }

        log.info("New user registered: {} with role: {}", savedUser.getEmail(), savedUser.getRole());

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .user(toUserResponse(savedUser))
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String token = tokenProvider.generateToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(user.getEmail());

        log.info("User logged in: {} (role: {})", user.getEmail(), user.getRole());

        return AuthResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .user(toUserResponse(user))
                .build();
    }

    public void forgotPassword(PasswordResetRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No account found with email: " + request.getEmail()));

        String resetToken = UUID.randomUUID().toString();
        user.setPasswordResetToken(resetToken);
        user.setPasswordResetExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        try {
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        } catch (Exception e) {
            log.warn("Could not send password reset email: {}", e.getMessage());
        }
        log.info("Password reset email sent to: {}", user.getEmail());
    }

    public void resetPassword(NewPasswordRequest request) {
        User user = userRepository.findByPasswordResetToken(request.getToken())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        if (user.getPasswordResetExpiry() == null ||
                user.getPasswordResetExpiry().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Password reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setPasswordResetToken(null);
        user.setPasswordResetExpiry(null);
        userRepository.save(user);
        log.info("Password reset successfully for: {}", user.getEmail());
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByEmailVerificationToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));
        user.setEmailVerified(true);
        user.setEmailVerificationToken(null);
        userRepository.save(user);
        log.info("Email verified for: {}", user.getEmail());
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!tokenProvider.validateToken(refreshToken)) {
            throw new BadRequestException("Invalid refresh token");
        }
        String email = tokenProvider.getUsernameFromToken(refreshToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newToken = tokenProvider.generateTokenFromUsername(email);
        String newRefreshToken = tokenProvider.generateRefreshToken(email);

        return AuthResponse.builder()
                .token(newToken)
                .refreshToken(newRefreshToken)
                .tokenType("Bearer")
                .expiresIn(tokenProvider.getExpirationMs())
                .user(toUserResponse(user))
                .build();
    }

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .phone(user.getPhone())
                .location(user.getLocation())
                .profileSummary(user.getProfileSummary())
                .profilePicture(user.getProfilePicture())
                .active(user.isActive())
                .emailVerified(user.isEmailVerified())
                .profileCompleteness(user.getProfileCompleteness())
                .skills(user.getSkills())
                .education(user.getEducation())
                .experience(user.getExperience())
                .resumeUrl(user.getResumeUrl())
                .resumeFileName(user.getResumeFileName())
                .resumeOriginalName(user.getResumeOriginalName())
                .companyName(user.getCompanyName())
                .companyDescription(user.getCompanyDescription())
                .companyWebsite(user.getCompanyWebsite())
                .companySize(user.getCompanySize())
                .industry(user.getIndustry())
                .companyLogoUrl(user.getCompanyLogoUrl())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
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
