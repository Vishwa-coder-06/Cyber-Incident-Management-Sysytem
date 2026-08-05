package com.secureops.notificationservice.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "NOTIFICATIONS")

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="NOTIFICATION_ID")
    private Long notificationId;

    @Column(name="USER_ID")
    private Long userId;

    @Column(name="TITLE")
    private String title;

    @Column(name="MESSAGE")
    private String message;

    @Column(name="TYPE")
    private String type;

    @Column(name="STATUS")
    private String status;

    @Column(name="CREATED_AT")
    private LocalDateTime createdAt;

}