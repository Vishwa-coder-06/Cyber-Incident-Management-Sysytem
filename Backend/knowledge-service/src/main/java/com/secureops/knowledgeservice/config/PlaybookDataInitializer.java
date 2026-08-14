package com.secureops.knowledgeservice.config;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.secureops.knowledgeservice.entity.Playbook;
import com.secureops.knowledgeservice.repository.PlaybookRepository;

@Component
public class PlaybookDataInitializer implements CommandLineRunner {

    private final PlaybookRepository repository;

    public PlaybookDataInitializer(PlaybookRepository repository) {
        this.repository = repository;
    }

    @Override
    public void run(String... args) {
        seedPlaybookIfMissing("Insider Threat Response Playbook", "Insider Threat", "ACTIVE",
            "Comprehensive procedure for containing and mitigating unauthorized insider actions, removable media policy violations, and internal data leakage.",
            List.of(
                "Revoke or restrict affected employee credentials and session tokens immediately.",
                "Isolate the affected workstation from internal networks and prevent unauthorized USB/removable media usage.",
                "Preserve forensic evidence including system logs, file access logs, and active process memory dumps.",
                "Conduct a preliminary investigation with HR and legal teams to assess data exfiltration scope.",
                "Implement elevated monitoring and apply updated Security Group Policy objects."
            )
        );

        seedPlaybookIfMissing("Phishing Email Triage SOP", "Phishing", "ACTIVE",
            "Step-by-step containment procedure for handling credential harvesting emails, malicious email attachments, and domain spoofing.",
            List.of(
                "Identify and extract malicious email headers, sender domains, and embedded URLs.",
                "Block malicious sender domains and URLs at the Secure Email Gateway and DNS firewall level.",
                "Purge malicious email messages from all user inboxes across the organization.",
                "Force credential reset for any user who interacted with the phishing link or submitted credentials.",
                "Enable mandatory Multi-Factor Authentication (MFA) and notify affected personnel."
            )
        );

        seedPlaybookIfMissing("General Incident Response Playbook", "General", "ACTIVE",
            "Standard operating playbook for initial cyber incident triage, severity escalation, and cross-functional response.",
            List.of(
                "Verify incident details, affected assets, and potential business impact.",
                "Assign severity level and notify on-duty Security Operations Center (SOC) analysts.",
                "Contain affected systems to minimize blast radius.",
                "Perform root cause analysis and apply mitigation controls.",
                "Document timeline, lessons learned, and file final incident report."
            )
        );

        seedPlaybookIfMissing("Ransomware Containment & Recovery SOP", "Ransomware", "ACTIVE",
            "Critical incident playbook for detecting, isolating, and recovering from ransomware infection and unauthorized encryption attempts.",
            List.of(
                "Immediately disconnect infected endpoints and servers from local network, Wi-Fi, and VPN.",
                "Identify the ransomware variant using file extension signatures, ransom notes, and hash indicators.",
                "Block command-and-control (C2) IP addresses and domains across all firewalls.",
                "Verify integrity of offline and immutable backups prior to initiating restoration.",
                "Perform full system remediation, re-image compromised machines, and restore data from validated clean backups."
            )
        );
    }

    private void seedPlaybookIfMissing(String name, String category, String status, String description, List<String> steps) {
        if (repository.findByNameContainingIgnoreCase(name).isEmpty()) {
            Playbook pb = new Playbook();
            pb.setName(name);
            pb.setCategory(category);
            pb.setStatus(status);
            pb.setDescription(description);
            pb.setSteps(steps);
            pb.setCreatedBy("System");
            pb.setCreatedAt(LocalDateTime.now());
            pb.setUpdatedAt(LocalDateTime.now());
            repository.save(pb);
            System.out.println("[PLAYBOOK SEED] Created playbook: " + name);
        }
    }
}
