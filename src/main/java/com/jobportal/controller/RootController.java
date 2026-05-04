package com.jobportal.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Root endpoint — publicly accessible.
 * Visiting http://localhost:8080 shows API info instead of Unauthorized.
 */
@RestController
@RequestMapping("/")
public class RootController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> root() {
        return ResponseEntity.ok(Map.of(
            "app", "Job Portal Management System",
            "status", "running",
            "version", "1.0.0",
            "frontend", "http://localhost:3000",
            "api", Map.of(
                "login",    "POST http://localhost:8080/auth/login",
                "register", "POST http://localhost:8080/auth/register",
                "jobs",     "GET  http://localhost:8080/jobs"
            ),
            "message", "Backend is running. Open http://localhost:3000 for the frontend."
        ));
    }
}
