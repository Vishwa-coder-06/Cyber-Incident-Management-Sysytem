package com.secureops.notificationservice.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.secureops.notificationservice.dto.NotificationRequest;
import com.secureops.notificationservice.dto.NotificationResponse;
import com.secureops.notificationservice.entity.Notification;
import com.secureops.notificationservice.service.NotificationService;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("*")
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

}