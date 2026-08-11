package com.secureops.notificationservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.secureops.notificationservice.entity.Notification;
import com.secureops.notificationservice.entity.NotificationPreference;

public interface NotificationRepository
        extends JpaRepository<Notification, Long> {

    List<Notification>
    findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndStatus(
            Long userId,
            String status);

    @Modifying
    @Query("""
        UPDATE Notification n
        SET n.status = 'READ'
        WHERE n.userId = :userId
        AND n.status = 'UNREAD'
    """)
    void markAllAsRead(
            @Param("userId") Long userId);
    
    Optional<NotificationPreference>
    findByUserId(Long userId);
}