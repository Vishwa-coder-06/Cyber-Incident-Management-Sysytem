package com.secureops.notificationservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.secureops.notificationservice.entity.NotificationPreference;

public interface NotificationPreferenceRepository
        extends JpaRepository<NotificationPreference, Long> {

    Optional<NotificationPreference>
    findByUserId(Long userId);
}