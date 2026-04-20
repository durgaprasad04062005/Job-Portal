package com.jobportal.config;

import org.springframework.context.annotation.Configuration;

/**
 * MongoDB configuration.
 *
 * NOTE: @EnableMongoAuditing is declared on JobPortalApplication — do NOT
 * add it here again or Spring will fail with a duplicate bean error.
 *
 * @EnableMongoRepositories is also not needed here because @SpringBootApplication
 * already scans the entire com.jobportal package tree.
 */
@Configuration
public class MongoConfig {
    // Connection is auto-configured from application.yml:
    //   spring.data.mongodb.host / port / database
}
