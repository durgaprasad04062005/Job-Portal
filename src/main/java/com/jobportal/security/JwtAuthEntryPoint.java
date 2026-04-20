package com.jobportal.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.dto.response.ApiResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthEntryPoint.class);
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void commence(HttpServletRequest request,
                         HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        // Log full path details to help diagnose security matcher issues
        log.error("=== UNAUTHORIZED ACCESS BLOCKED ===");
        log.error("  Request URI:     {}", request.getRequestURI());
        log.error("  Servlet Path:    {}", request.getServletPath());
        log.error("  Context Path:    {}", request.getContextPath());
        log.error("  Path Info:       {}", request.getPathInfo());
        log.error("  Method:          {}", request.getMethod());
        log.error("  Error:           {}", authException.getMessage());
        log.error("===================================");

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        ApiResponse<Void> apiResponse = ApiResponse.error(
                "Unauthorized: " + authException.getMessage());

        objectMapper.writeValue(response.getOutputStream(), apiResponse);
    }
}
