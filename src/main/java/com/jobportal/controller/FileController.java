package com.jobportal.controller;

import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.service.FileStorageService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;

@RestController
@RequestMapping("/files")
public class FileController {

    private static final Logger log = LoggerFactory.getLogger(FileController.class);

    private final FileStorageService fileStorageService;

    public FileController(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    /**
     * GET /files/resumes/{fileName}
     * Downloads a resume file — publicly accessible (no JWT required)
     */
    @GetMapping("/resumes/{fileName:.+}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String fileName) {
        log.info("Resume download requested: {}", fileName);
        return serveFile(fileName, fileStorageService.getResumeDir(), true);
    }

    /**
     * GET /files/logos/{fileName}
     * Serves a company logo or profile picture
     */
    @GetMapping("/logos/{fileName:.+}")
    public ResponseEntity<Resource> viewLogo(@PathVariable String fileName) {
        return serveFile(fileName, fileStorageService.getLogoDir(), false);
    }

    private ResponseEntity<Resource> serveFile(String fileName, String directory,
                                                boolean forceDownload) {
        try {
            Path filePath = fileStorageService.loadFile(fileName, directory);
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                log.error("File not found or not readable: {}", filePath);
                throw new ResourceNotFoundException("File not found: " + fileName);
            }

            String contentType = determineContentType(fileName);

            HttpHeaders headers = new HttpHeaders();
            if (forceDownload) {
                headers.add(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + resource.getFilename() + "\"");
            } else {
                headers.add(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + resource.getFilename() + "\"");
            }

            log.info("Serving file: {} ({})", fileName, contentType);

            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);

        } catch (MalformedURLException ex) {
            log.error("Malformed URL for file: {}", fileName, ex);
            throw new ResourceNotFoundException("File not found: " + fileName);
        }
    }

    private String determineContentType(String fileName) {
        String lower = fileName.toLowerCase();
        if (lower.endsWith(".pdf"))  return "application/pdf";
        if (lower.endsWith(".doc"))  return "application/msword";
        if (lower.endsWith(".docx")) return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return "image/jpeg";
        if (lower.endsWith(".png"))  return "image/png";
        if (lower.endsWith(".gif"))  return "image/gif";
        if (lower.endsWith(".webp")) return "image/webp";
        return "application/octet-stream";
    }
}
