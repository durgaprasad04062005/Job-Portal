package com.jobportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableMongoAuditing
@EnableAsync
public class JobPortalApplication extends SpringBootServletInitializer {

    /**
     * Entry point when running as a standalone JAR (mvn spring-boot:run).
     */
    public static void main(String[] args) {
        SpringApplication.run(JobPortalApplication.class, args);
    }

    /**
     * Entry point when deployed as a WAR to an external Tomcat server.
     * Tomcat calls configure() instead of main().
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(JobPortalApplication.class);
    }
}
