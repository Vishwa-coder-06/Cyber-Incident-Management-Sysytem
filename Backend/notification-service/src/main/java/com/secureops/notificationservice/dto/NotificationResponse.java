package com.secureops.notificationservice.dto;

import lombok.*;

@Data
@AllArgsConstructor
public class NotificationResponse {

    private Long notificationId;

    private String title;

    private String message;

}