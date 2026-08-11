package com.secureops.userservice.controller;



import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.secureops.userservice.entity.SystemSetting;
import com.secureops.userservice.service.SystemSettingService;



@RestController
@RequestMapping("/api/settings")
@CrossOrigin("*")
public class SystemSettingController {

    private final SystemSettingService service;

    public SystemSettingController(
            SystemSettingService service) {

        this.service = service;
    }

    @GetMapping
    public SystemSetting getSettings() {

        return service.getSettings();
    }

    @PutMapping
    public SystemSetting updateSettings(
            @RequestBody SystemSetting settings) {

        return service.updateSettings(settings);
    }
}
