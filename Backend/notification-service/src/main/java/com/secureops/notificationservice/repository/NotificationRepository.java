package com.secureops.notificationservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.secureops.notificationservice.entity.Notification;

public interface NotificationRepository
        extends JpaRepository<Notification,Long>{

}