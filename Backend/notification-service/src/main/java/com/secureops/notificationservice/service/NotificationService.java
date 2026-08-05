package com.secureops.notificationservice.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.secureops.notificationservice.dto.NotificationRequest;
import com.secureops.notificationservice.dto.NotificationResponse;
import com.secureops.notificationservice.entity.Notification;
import com.secureops.notificationservice.repository.NotificationRepository;

@Service
public class NotificationService {

    private final NotificationRepository repository;

    public NotificationService(NotificationRepository repository) {
        this.repository = repository;
    }

    public NotificationResponse create(NotificationRequest request){

        Notification notification = new Notification();

        notification.setUserId(request.getUserId());
        notification.setTitle(request.getTitle());
        notification.setMessage(request.getMessage());
        notification.setType(request.getType());
        notification.setStatus(request.getStatus());
        notification.setCreatedAt(LocalDateTime.now());

        Notification saved = repository.save(notification);

        return new NotificationResponse(
                saved.getNotificationId(),
                saved.getTitle(),
                "Notification Created Successfully"
        );
    }

    public List<Notification> getAll(){

        return repository.findAll();

    }

    public Notification getById(Long id){

        return repository.findById(id).orElse(null);

    }

    public Notification update(Long id, Notification updated){

        Notification notification = repository.findById(id).orElse(null);

        if(notification==null){

            return null;

        }

        notification.setTitle(updated.getTitle());
        notification.setMessage(updated.getMessage());
        notification.setType(updated.getType());
        notification.setStatus(updated.getStatus());

        return repository.save(notification);

    }

    public void delete(Long id){

        repository.deleteById(id);

    }

}