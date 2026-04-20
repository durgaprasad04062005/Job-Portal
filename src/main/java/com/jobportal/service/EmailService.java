package com.jobportal.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@jobportal.com}")
    private String fromEmail;

    // ─────────────────────────────────────────────────────────────
    // SHORTLISTED
    // ─────────────────────────────────────────────────────────────
    @Async
    public void sendShortlistedEmail(String to, String candidateName, String jobTitle) {
        String subject = "Congratulations! Your Application Has Been Shortlisted - " + jobTitle;
        String body =
            "Dear " + candidateName + ",\n\n"
            + "We are pleased to inform you that your application for the "
            + jobTitle + " position has been successfully shortlisted.\n\n"
            + "After reviewing your profile, we found your skills and experience to be a strong "
            + "match for our requirements. We would like to move forward with the next stage "
            + "of the selection process.\n\n"
            + "You will receive further details regarding the upcoming assessment/interview shortly. "
            + "In the meantime, please confirm your continued interest in this opportunity by "
            + "replying to this email.\n\n"
            + "We look forward to your participation.\n\n"
            + "Best regards,\n"
            + "Job Portal\n"
            + "Talent Acquisition";
        sendEmail(to, subject, body);
    }

    // ─────────────────────────────────────────────────────────────
    // REJECTED
    // ─────────────────────────────────────────────────────────────
    @Async
    public void sendRejectedEmail(String to, String candidateName, String jobTitle) {
        String subject = "Application Update for " + jobTitle + " - Job Portal";
        String body =
            "Dear " + candidateName + ",\n\n"
            + "Thank you for applying for the position of " + jobTitle + ".\n\n"
            + "After reviewing your application, we regret to inform you that we will not be "
            + "moving forward at this time. However, we were impressed with your profile and "
            + "encourage you to apply again for future roles that match your skills.\n\n"
            + "We appreciate your time and effort throughout the process.\n\n"
            + "Wishing you success in your career.\n\n"
            + "Best regards,\n"
            + "Job Portal\n"
            + "Talent Acquisition";
        sendEmail(to, subject, body);
    }

    // ─────────────────────────────────────────────────────────────
    // HIRED
    // ─────────────────────────────────────────────────────────────
    @Async
    public void sendHiredEmail(String to, String candidateName, String jobTitle) {
        String subject = "Congratulations! You've Been Selected for " + jobTitle + " - Job Portal";
        String body =
            "Dear " + candidateName + ",\n\n"
            + "We are pleased to inform you that you have been selected for the position of "
            + jobTitle + ". Congratulations!\n\n"
            + "Based on your performance throughout the selection process, we believe your skills "
            + "and experience will be a valuable addition to our team.\n\n"
            + "A detailed offer letter with complete terms and conditions will be shared with you shortly.\n\n"
            + "Kindly confirm your acceptance of this offer by replying to this email.\n\n"
            + "Best regards,\n"
            + "Job Portal\n"
            + "Talent Acquisition";
        sendEmail(to, subject, body);
    }

    // ─────────────────────────────────────────────────────────────
    // UNDER REVIEW
    // ─────────────────────────────────────────────────────────────
    @Async
    public void sendUnderReviewEmail(String to, String candidateName, String jobTitle) {
        String subject = "Application Under Review - " + jobTitle + " - Job Portal";
        String body =
            "Dear " + candidateName + ",\n\n"
            + "Thank you for applying for the position of " + jobTitle + ".\n\n"
            + "We wanted to let you know that your application is currently under review by our team. "
            + "We will get back to you with an update as soon as possible.\n\n"
            + "Thank you for your patience.\n\n"
            + "Best regards,\n"
            + "Job Portal\n"
            + "Talent Acquisition";
        sendEmail(to, subject, body);
    }

    // ─────────────────────────────────────────────────────────────
    // NEW APPLICATION NOTIFICATION → Employer
    // ─────────────────────────────────────────────────────────────
    @Async
    public void sendNewApplicationNotification(String to, String employerName,
                                                String applicantName, String jobTitle) {
        String subject = "New Application Received - " + jobTitle;
        String body =
            "Dear " + employerName + ",\n\n"
            + "You have received a new application for the position of \"" + jobTitle + "\".\n\n"
            + "Applicant: " + applicantName + "\n\n"
            + "Please log in to your employer dashboard to review the application.\n\n"
            + "Best regards,\n"
            + "Job Portal\n"
            + "Talent Acquisition";
        sendEmail(to, subject, body);
    }

    // ─────────────────────────────────────────────────────────────
    // AUTH EMAILS
    // ─────────────────────────────────────────────────────────────
    @Async
    public void sendPasswordResetEmail(String to, String resetToken) {
        String url = "http://localhost:3000/reset-password?token=" + resetToken;
        sendEmail(to, "Password Reset Request - Job Portal",
            "Dear User,\n\n"
            + "You requested a password reset for your Job Portal account.\n\n"
            + "Click the link below to reset your password (valid for 1 hour):\n"
            + url + "\n\n"
            + "If you did not request this, please ignore this email.\n\n"
            + "Best regards,\nJob Portal\nTalent Acquisition");
    }

    @Async
    public void sendEmailVerification(String to, String token) {
        String url = "http://localhost:3000/verify-email?token=" + token;
        sendEmail(to, "Verify Your Email - Job Portal",
            "Dear User,\n\n"
            + "Welcome to Job Portal! Please verify your email address:\n"
            + url + "\n\n"
            + "This link expires in 24 hours.\n\n"
            + "Best regards,\nJob Portal\nTalent Acquisition");
    }

    // ─────────────────────────────────────────────────────────────
    // GENERIC STATUS DISPATCHER
    // ─────────────────────────────────────────────────────────────
    @Async
    public void sendApplicationStatusUpdate(String to, String applicantName,
                                             String jobTitle, String status) {
        switch (status) {
            case "SHORTLISTED"  -> sendShortlistedEmail(to, applicantName, jobTitle);
            case "REJECTED"     -> sendRejectedEmail(to, applicantName, jobTitle);
            case "HIRED"        -> sendHiredEmail(to, applicantName, jobTitle);
            case "UNDER_REVIEW" -> sendUnderReviewEmail(to, applicantName, jobTitle);
            default             -> sendEmail(to,
                "Application Update - " + jobTitle,
                "Dear " + applicantName + ",\n\nYour application for \""
                + jobTitle + "\" has been updated to: " + status + ".\n\n"
                + "Best regards,\nJob Portal\nTalent Acquisition");
        }
    }

    // ─────────────────────────────────────────────────────────────
    // CORE SEND
    // ─────────────────────────────────────────────────────────────
    private void sendEmail(String to, String subject, String body) {
        if (mailSender == null) {
            log.warn("Mail sender not configured. Email NOT sent to: {}", to);
            log.info("Subject: {}\nBody:\n{}", subject, body);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromEmail);
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("✅ Email sent → To: {} | Subject: {}", to, subject);
        } catch (Exception e) {
            log.error("❌ Failed to send email to {}: {}", to, e.getMessage());
        }
    }
}
