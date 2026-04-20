package com.jobportal.config;

import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

/**
 * Seeds the database with sample data on first run.
 * Remove or disable this in production.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Re-seed if admin doesn't exist, or if the stored hash is invalid
        // (e.g. from a previous broken run with a bad JWT/password config).
        boolean needsReseed = false;
        var existingAdmin = userRepository.findByEmail("admin@jobportal.com");
        if (existingAdmin.isEmpty()) {
            needsReseed = true;
        } else {
            String storedHash = existingAdmin.get().getPassword();
            // Valid BCrypt hashes always start with $2a$, $2b$, or $2y$
            if (storedHash == null || !storedHash.startsWith("$2")) {
                log.warn("Stored password hash looks invalid — clearing and re-seeding sample data");
                userRepository.deleteAll();
                jobRepository.deleteAll();
                needsReseed = true;
            }
        }

        if (needsReseed) {
            seedUsers();
            seedJobs();
            log.info("Sample data initialized successfully");
        } else {
            log.info("Sample data already present, skipping initialization");
        }
    }

    private void seedUsers() {
        // Admin
        User admin = User.builder()
                .fullName("Admin User")
                .email("admin@jobportal.com")
                .password(passwordEncoder.encode("Admin@123"))
                .role("ADMIN")
                .active(true)
                .emailVerified(true)
                .profileCompleteness(100)
                .skills(new java.util.ArrayList<>())
                .education(new java.util.ArrayList<>())
                .experience(new java.util.ArrayList<>())
                .build();

        // Employer
        User employer = User.builder()
                .fullName("Tech Corp HR")
                .email("employer@techcorp.com")
                .password(passwordEncoder.encode("Employer@123"))
                .role("EMPLOYER")
                .companyName("TechCorp Solutions")
                .companyDescription("Leading software development company")
                .companyWebsite("https://techcorp.com")
                .companySize("500-1000")
                .industry("Information Technology")
                .location("San Francisco, CA")
                .active(true)
                .emailVerified(true)
                .profileCompleteness(90)
                .skills(new java.util.ArrayList<>())
                .education(new java.util.ArrayList<>())
                .experience(new java.util.ArrayList<>())
                .build();

        // Student
        User student = User.builder()
                .fullName("John Doe")
                .email("student@example.com")
                .password(passwordEncoder.encode("Student@123"))
                .role("STUDENT")
                .phone("+1-555-0100")
                .location("New York, NY")
                .profileSummary("Passionate software developer with 2 years of experience")
                .skills(Arrays.asList("Java", "Spring Boot", "React", "MongoDB", "Docker"))
                .education(new java.util.ArrayList<>())
                .experience(new java.util.ArrayList<>())
                .active(true)
                .emailVerified(true)
                .profileCompleteness(75)
                .build();

        userRepository.saveAll(Arrays.asList(admin, employer, student));
        log.info("Sample users created: admin@jobportal.com / Admin@123, employer@techcorp.com / Employer@123, student@example.com / Student@123");
    }

    private void seedJobs() {
        userRepository.findByEmail("employer@techcorp.com").ifPresent(employer -> {
            List<Job> jobs = Arrays.asList(
                Job.builder()
                    .employerId(employer.getId())
                    .companyName("TechCorp Solutions")
                    .title("Senior Java Developer")
                    .description("We are looking for an experienced Java developer to join our team. " +
                            "You will be responsible for designing and implementing high-performance " +
                            "applications using Java and Spring Boot.")
                    .requirements("5+ years of Java experience, Spring Boot, Microservices")
                    .responsibilities("Design and develop RESTful APIs, Code reviews, Mentoring juniors")
                    .skillsRequired(Arrays.asList("Java", "Spring Boot", "Microservices", "Docker", "AWS"))
                    .category("Software Development")
                    .location("San Francisco, CA")
                    .jobType("FULL_TIME")
                    .experienceLevel("SENIOR")
                    .experienceMinYears(5)
                    .experienceMaxYears(10)
                    .salaryMin(120000)
                    .salaryMax(160000)
                    .salaryCurrency("USD")
                    .status("ACTIVE")
                    .workMode("HYBRID")
                    .benefits(Arrays.asList("Health Insurance", "401k", "Remote Work", "Stock Options"))
                    .deadline(LocalDateTime.now().plusMonths(2))
                    .applicationCount(0)
                    .viewCount(0)
                    .build(),

                Job.builder()
                    .employerId(employer.getId())
                    .companyName("TechCorp Solutions")
                    .title("React Frontend Developer")
                    .description("Join our frontend team to build amazing user experiences. " +
                            "You will work closely with designers and backend developers.")
                    .requirements("3+ years React experience, TypeScript, CSS")
                    .responsibilities("Build responsive UIs, Optimize performance, Write tests")
                    .skillsRequired(Arrays.asList("React", "TypeScript", "CSS", "Redux", "Jest"))
                    .category("Frontend Development")
                    .location("Remote")
                    .jobType("FULL_TIME")
                    .experienceLevel("MID")
                    .experienceMinYears(3)
                    .experienceMaxYears(6)
                    .salaryMin(90000)
                    .salaryMax(120000)
                    .salaryCurrency("USD")
                    .status("ACTIVE")
                    .workMode("REMOTE")
                    .benefits(Arrays.asList("Health Insurance", "Flexible Hours", "Learning Budget"))
                    .deadline(LocalDateTime.now().plusMonths(1))
                    .applicationCount(0)
                    .viewCount(0)
                    .build(),

                Job.builder()
                    .employerId(employer.getId())
                    .companyName("TechCorp Solutions")
                    .title("DevOps Engineer")
                    .description("We need a skilled DevOps engineer to manage our cloud infrastructure " +
                            "and CI/CD pipelines.")
                    .requirements("AWS/GCP experience, Kubernetes, Terraform")
                    .responsibilities("Manage cloud infrastructure, Automate deployments, Monitor systems")
                    .skillsRequired(Arrays.asList("AWS", "Kubernetes", "Docker", "Terraform", "Jenkins"))
                    .category("DevOps & Cloud")
                    .location("Austin, TX")
                    .jobType("FULL_TIME")
                    .experienceLevel("MID")
                    .experienceMinYears(3)
                    .experienceMaxYears(7)
                    .salaryMin(100000)
                    .salaryMax(140000)
                    .salaryCurrency("USD")
                    .status("ACTIVE")
                    .workMode("ONSITE")
                    .benefits(Arrays.asList("Health Insurance", "401k", "Gym Membership"))
                    .deadline(LocalDateTime.now().plusMonths(3))
                    .applicationCount(0)
                    .viewCount(0)
                    .build(),

                Job.builder()
                    .employerId(employer.getId())
                    .companyName("TechCorp Solutions")
                    .title("Software Engineering Intern")
                    .description("Great opportunity for students to gain real-world experience " +
                            "in a fast-paced tech environment.")
                    .requirements("Currently pursuing CS degree, Basic Java or Python knowledge")
                    .responsibilities("Assist in development, Write unit tests, Participate in code reviews")
                    .skillsRequired(Arrays.asList("Java", "Python", "Git", "SQL"))
                    .category("Internship")
                    .location("New York, NY")
                    .jobType("INTERNSHIP")
                    .experienceLevel("ENTRY")
                    .experienceMinYears(0)
                    .experienceMaxYears(1)
                    .salaryMin(25)
                    .salaryMax(35)
                    .salaryCurrency("USD")
                    .salaryNegotiable(true)
                    .status("ACTIVE")
                    .workMode("HYBRID")
                    .benefits(Arrays.asList("Mentorship", "Learning Opportunities", "Full-time offer potential"))
                    .deadline(LocalDateTime.now().plusMonths(1))
                    .applicationCount(0)
                    .viewCount(0)
                    .build()
            );

            jobRepository.saveAll(jobs);
            log.info("Sample jobs created");
        });
    }
}
