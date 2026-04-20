package com.jobportal.controller;

import com.jobportal.dto.request.UpdateProfileRequest;
import com.jobportal.dto.response.ApiResponse;
import com.jobportal.dto.response.UserResponse;
import com.jobportal.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserResponse>> getMyProfile(@AuthenticationPrincipal UserDetails u) {
        return ResponseEntity.ok(ApiResponse.success("Profile retrieved", userService.getCurrentUser(u.getUsername())));
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails u,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Profile updated", userService.updateProfile(u.getUsername(), request)));
    }

    @PostMapping("/upload-resume")
    public ResponseEntity<ApiResponse<UserResponse>> uploadResume(
            @AuthenticationPrincipal UserDetails u,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded", userService.uploadResume(u.getUsername(), file)));
    }

    @PostMapping("/upload-picture")
    public ResponseEntity<ApiResponse<UserResponse>> uploadPicture(
            @AuthenticationPrincipal UserDetails u,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(ApiResponse.success("Picture updated", userService.uploadProfilePicture(u.getUsername(), file)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(@PathVariable String id) {
        return ResponseEntity.ok(ApiResponse.success("User retrieved", userService.getUserById(id)));
    }
}
