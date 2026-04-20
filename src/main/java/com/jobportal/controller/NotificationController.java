package com.jobportal.controller;

import com.jobportal.dto.response.ApiResponse;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Notification;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import com.jobportal.service.NotificationService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepository;

    public NotificationController(NotificationService notificationService,
                                   UserRepository userRepository) {
        this.notificationService = notificationService;
        this.userRepository = userRepository;
    }

    private User getUser(UserDetails ud) {
        return userRepository.findByEmail(ud.getUsername())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Notification>>> getNotifications(
            @AuthenticationPrincipal UserDetails ud,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved",
                notificationService.getUserNotifications(getUser(ud).getId(), PageRequest.of(page, size))));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Long>> getUnreadCount(@AuthenticationPrincipal UserDetails ud) {
        return ResponseEntity.ok(ApiResponse.success("Unread count",
                notificationService.getUnreadCount(getUser(ud).getId())));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable String id,
                                                       @AuthenticationPrincipal UserDetails ud) {
        notificationService.markAsRead(id, getUser(ud).getId());
        return ResponseEntity.ok(ApiResponse.success("Marked as read"));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllRead(@AuthenticationPrincipal UserDetails ud) {
        notificationService.markAllAsRead(getUser(ud).getId());
        return ResponseEntity.ok(ApiResponse.success("All marked as read"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable String id,
                                                     @AuthenticationPrincipal UserDetails ud) {
        notificationService.deleteNotification(id, getUser(ud).getId());
        return ResponseEntity.ok(ApiResponse.success("Notification deleted"));
    }
}
