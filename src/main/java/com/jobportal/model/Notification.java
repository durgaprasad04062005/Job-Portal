package com.jobportal.model;

import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    private String id;

    private String userId;
    private String title;
    private String message;
    private String type;    // APPLICATION_UPDATE, JOB_ALERT, SYSTEM, INTERVIEW
    private String link;    // optional deep link
    private boolean read;

    @CreatedDate
    private LocalDateTime createdAt;
}
