package com.jobportal.service;

import com.jobportal.exception.FileStorageException;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private static final Logger log = LoggerFactory.getLogger(FileStorageService.class);

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.resume-dir}")
    private String resumeDir;

    @Value("${file.logo-dir}")
    private String logoDir;

    private static final List<String> ALLOWED_RESUME_TYPES = Arrays.asList(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024;

    public String storeResume(MultipartFile file, String userId) {
        validateFile(file, ALLOWED_RESUME_TYPES, "Resume must be PDF, DOC, or DOCX format");
        return storeFile(file, resumeDir, "resume_" + userId);
    }

    public String storeLogo(MultipartFile file, String employerId) {
        validateFile(file, ALLOWED_IMAGE_TYPES, "Logo must be an image file");
        return storeFile(file, logoDir, "logo_" + employerId);
    }

    private void validateFile(MultipartFile file, List<String> allowedTypes, String errorMessage) {
        if (file == null || file.isEmpty()) throw new FileStorageException("File cannot be empty");
        if (file.getSize() > MAX_FILE_SIZE) throw new FileStorageException("File exceeds 5MB limit");
        String contentType = file.getContentType();
        if (contentType == null || !allowedTypes.contains(contentType))
            throw new FileStorageException(errorMessage);
        String name = file.getOriginalFilename();
        if (name != null && name.contains("..")) throw new FileStorageException("Invalid file name");
    }

    private String storeFile(MultipartFile file, String directory, String prefix) {
        try {
            Path dirPath = Paths.get(directory).toAbsolutePath().normalize();
            Files.createDirectories(dirPath);
            String original = StringUtils.cleanPath(
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
            String ext = FilenameUtils.getExtension(original);
            String fileName = prefix + "_" + UUID.randomUUID() + "." + ext;
            Files.copy(file.getInputStream(), dirPath.resolve(fileName),
                    StandardCopyOption.REPLACE_EXISTING);
            log.info("File stored: {}", fileName);
            return fileName;
        } catch (IOException ex) {
            throw new FileStorageException("Could not store file", ex);
        }
    }

    public Path loadFile(String fileName, String directory) {
        return Paths.get(directory).toAbsolutePath().normalize().resolve(fileName).normalize();
    }

    public void deleteFile(String fileName, String directory) {
        try {
            Files.deleteIfExists(loadFile(fileName, directory));
        } catch (IOException ex) {
            log.error("Could not delete file: {}", fileName, ex);
        }
    }

    public String getResumeDir() { return resumeDir; }
    public String getLogoDir()   { return logoDir; }
}
