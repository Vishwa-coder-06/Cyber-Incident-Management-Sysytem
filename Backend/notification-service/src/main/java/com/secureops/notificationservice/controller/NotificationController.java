package com.secureops.notificationservice.controller;

import java.util.List;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.secureops.notificationservice.dto.NotificationRequest;
import com.secureops.notificationservice.dto.NotificationResponse;
import com.secureops.notificationservice.entity.Notification;
import com.secureops.notificationservice.entity.NotificationPreference;
import com.secureops.notificationservice.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")

public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @PostMapping
    public NotificationResponse create(
            @RequestBody NotificationRequest request){

        return service.create(request);

    }

    @GetMapping
    public List<Notification> getAll(){

        return service.getAll();

    }

    @GetMapping("/{id}")
    public Notification getById(
            @PathVariable Long id){

        return service.getById(id);

    }

    @PutMapping("/{id}")
    public Notification update(
            @PathVariable Long id,
            @RequestBody Notification notification){

        return service.update(id,notification);

    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id){

        service.delete(id);

    }
    
    @GetMapping("/me")
    public List<Notification> getMyNotifications(
            Authentication authentication) {

        return service
                .getMyNotifications(
                        authentication.getName());
    }
    
    @GetMapping("/me/unread-count")
    public long getUnreadCount(
            Authentication authentication) {

        return service
                .getUnreadCount(
                        authentication.getName());
    }
    
    @PutMapping("/{id}/read")
    public Notification markAsRead(
            @PathVariable Long id) {

        return service.markAsRead(id);
    }
    
    @PutMapping("/me/read-all")
    public void markAllAsRead(
            Authentication authentication) {

    	service.markAllAsRead(
                authentication.getName());
    }
    
    @GetMapping("/preferences/me")
    public NotificationPreference getPreferences(
            Authentication authentication) {

        return service.getPreferences(
                authentication.getName());
    }
    
    @PutMapping("/preferences/me")
    public NotificationPreference updatePreferences(
            Authentication authentication,
            @RequestBody NotificationPreference preference) {

        return service
                .updatePreferences(
                        authentication.getName(),
                        preference);
    }

}