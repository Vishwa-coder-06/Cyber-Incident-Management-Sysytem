package com.secureops.notificationservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.secureops.common.dto.UserResponse;
import com.secureops.notificationservice.client.UserClient;
import com.secureops.notificationservice.dto.NotificationRequest;
import com.secureops.notificationservice.dto.NotificationResponse;
import com.secureops.notificationservice.entity.Notification;
import com.secureops.notificationservice.entity.NotificationPreference;
import com.secureops.notificationservice.repository.NotificationPreferenceRepository;
import com.secureops.notificationservice.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository repository;
    private final UserClient userClient;
    private final NotificationPreferenceRepository  preferenceRepository;

    public NotificationService(
            NotificationRepository repository,
            UserClient userClient,NotificationPreferenceRepository preferenceRepository) {

        this.repository = repository;
        this.userClient = userClient;
        this.preferenceRepository = preferenceRepository;
    }

    // CREATE
    public NotificationResponse create(
            NotificationRequest request) {

        Notification notification =
                new Notification();

        notification.setUserId(
                request.getUserId());

        notification.setTitle(
                request.getTitle());

        notification.setMessage(
                request.getMessage());

        notification.setType(
                request.getType());

        notification.setStatus(
                request.getStatus());

        notification.setCreatedAt(
                LocalDateTime.now());

        Notification saved =
                repository.save(notification);

        return new NotificationResponse(
                saved.getNotificationId(),
                saved.getTitle(),
                "Notification Created Successfully"
        );
    }

    // GET ALL
    public List<Notification> getAll() {
        return repository.findAll();
    }

    // GET BY ID
    public Notification getById(Long id) {

        return repository.findById(id)
                .orElse(null);
    }

    // UPDATE
    public Notification update(
            Long id,
            Notification updated) {

        Notification notification =
                repository.findById(id)
                        .orElse(null);

        if (notification == null) {
            return null;
        }

        notification.setTitle(
                updated.getTitle());

        notification.setMessage(
                updated.getMessage());

        notification.setType(
                updated.getType());

        notification.setStatus(
                updated.getStatus());

        return repository.save(notification);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // MY NOTIFICATIONS
    public List<Notification> getMyNotifications(
            String email) {

        UserResponse user =
                userClient.getUserByEmail(email);

        return repository
                .findByUserIdOrderByCreatedAtDesc(
                        user.getUserId());
    }

    // UNREAD COUNT
    public long getUnreadCount(
            String email) {

        UserResponse user =
                userClient.getUserByEmail(email);

        return repository
                .countByUserIdAndStatus(
                        user.getUserId(),
                        "UNREAD");
    }

    // MARK ONE READ
    public Notification markAsRead(Long id) {

        Notification notification =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                    "Notification Not Found"));

        notification.setStatus("READ");

        return repository.save(notification);
    }

    // MARK ALL READ
    @Transactional
    public void markAllAsRead(
            String email) {

        UserResponse user =
                userClient.getUserByEmail(email);

        repository.markAllAsRead(
                user.getUserId());
    }
    
    public NotificationPreference getPreferences(
            String email) {

        UserResponse user =
                userClient.getUserByEmail(email);

        return preferenceRepository
                .findByUserId(user.getUserId())
                .orElseGet(() -> {

                    NotificationPreference preference =
                            new NotificationPreference();

                    preference.setUserId(
                            user.getUserId());

                    preference.setIncidentStatusUpdates(true);
                    preference.setAiAnalysisComplete(true);
                    preference.setAssignmentUpdates(true);
                    preference.setSystemNotifications(true);

                    return preferenceRepository.save(
                            preference);
                });
    }
    
    public NotificationPreference updatePreferences(
            String email,
            NotificationPreference updated) {

        UserResponse user =
                userClient.getUserByEmail(email);

        NotificationPreference preference =
                preferenceRepository
                        .findByUserId(user.getUserId())
                        .orElseGet(() -> {

                            NotificationPreference p =
                                    new NotificationPreference();

                            p.setUserId(
                                    user.getUserId());

                            return p;
                        });

        preference.setIncidentStatusUpdates(
                updated.isIncidentStatusUpdates());

        preference.setAiAnalysisComplete(
                updated.isAiAnalysisComplete());

        preference.setAssignmentUpdates(
                updated.isAssignmentUpdates());

        preference.setSystemNotifications(
                updated.isSystemNotifications());

        return preferenceRepository.save(
                preference);
    }
}