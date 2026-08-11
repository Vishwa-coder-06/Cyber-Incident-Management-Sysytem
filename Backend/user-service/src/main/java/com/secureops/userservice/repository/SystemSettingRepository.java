package com.secureops.userservice.repository;


import org.springframework.data.jpa.repository.JpaRepository;
import com.secureops.userservice.entity.SystemSetting;


public interface SystemSettingRepository
        extends JpaRepository<SystemSetting, Long> {
}
