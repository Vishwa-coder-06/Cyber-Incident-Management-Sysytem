package com.secureops.userservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "SYSTEM_SETTINGS")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SystemSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private boolean enforceMfa;

    private Integer sessionTimeout;

    private boolean ipAllowlistEnabled;

    private boolean emailNotifications;

    private boolean criticalIncidentAlerts;

    private boolean dailyDigestEmail;

    private boolean autoAnalyzeOnSubmission;

    private boolean autoGenerateKbArticles;

    private boolean aiSeverityOverrideAllowed;
}