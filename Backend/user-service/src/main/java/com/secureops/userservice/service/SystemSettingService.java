package com.secureops.userservice.service;


import org.springframework.stereotype.Service;

import com.secureops.userservice.entity.SystemSetting;
import com.secureops.userservice.repository.SystemSettingRepository;


@Service
public class SystemSettingService {

    private final SystemSettingRepository repository;

    public SystemSettingService(
            SystemSettingRepository repository) {

        this.repository = repository;
    }

    public SystemSetting getSettings() {

        return repository.findById(1L)
                .orElseGet(() -> {

                    SystemSetting settings =
                            new SystemSetting();

                    settings.setId(1L);

                    settings.setEnforceMfa(true);
                    settings.setSessionTimeout(30);
                    settings.setIpAllowlistEnabled(false);

                    settings.setEmailNotifications(true);
                    settings.setCriticalIncidentAlerts(true);
                    settings.setDailyDigestEmail(false);

                    settings.setAutoAnalyzeOnSubmission(true);
                    settings.setAutoGenerateKbArticles(true);
                    settings.setAiSeverityOverrideAllowed(false);

                    return repository.save(settings);
                });
    }

    public SystemSetting updateSettings(
            SystemSetting updated) {

        SystemSetting settings = getSettings();

        settings.setEnforceMfa(
                updated.isEnforceMfa());

        settings.setSessionTimeout(
                updated.getSessionTimeout());

        settings.setIpAllowlistEnabled(
                updated.isIpAllowlistEnabled());

        settings.setEmailNotifications(
                updated.isEmailNotifications());

        settings.setCriticalIncidentAlerts(
                updated.isCriticalIncidentAlerts());

        settings.setDailyDigestEmail(
                updated.isDailyDigestEmail());

        settings.setAutoAnalyzeOnSubmission(
                updated.isAutoAnalyzeOnSubmission());

        settings.setAutoGenerateKbArticles(
                updated.isAutoGenerateKbArticles());

        settings.setAiSeverityOverrideAllowed(
                updated.isAiSeverityOverrideAllowed());

        return repository.save(settings);
    }
}