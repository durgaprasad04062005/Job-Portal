package com.jobportal.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Temporary debug filter — logs every request's path details.
 * Remove this class once the security issue is resolved.
 */
@Component
@Order(Integer.MIN_VALUE)   // runs before everything else
public class DebugPathFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(DebugPathFilter.class);

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        log.warn(">>> PATH DEBUG <<<");
        log.warn("  Method       : {}", request.getMethod());
        log.warn("  RequestURI   : {}", request.getRequestURI());
        log.warn("  ContextPath  : {}", request.getContextPath());
        log.warn("  ServletPath  : {}", request.getServletPath());
        log.warn("  PathInfo     : {}", request.getPathInfo());
        log.warn("  QueryString  : {}", request.getQueryString());
        log.warn(">>> END DEBUG <<<");

        chain.doFilter(request, response);
    }
}
