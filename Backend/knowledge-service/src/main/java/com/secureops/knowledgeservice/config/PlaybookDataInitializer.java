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
        seedPlaybookIfMissing(
            "Phishing Response Playbook",
            "Phishing",
            "ACTIVE",
            "Comprehensive incident response procedure for analyzing, containing, and mitigating phishing attacks, credential harvesting, and email spoofing.",
            List.of(
                "Inspect email headers, origin IP addresses, and authentication records (SPF/DKIM/DMARC).",
                "Block malicious sender domains and URLs at the Secure Email Gateway and DNS firewall level.",
                "Purge malicious email messages from all user inboxes across the organization.",
                "Force credential reset for any user who interacted with the phishing link or submitted credentials.",
                "Enable mandatory Multi-Factor Authentication (MFA) and notify affected personnel."
            )
        );

        seedPlaybookIfMissing(
            "Phishing Email Triage SOP",
            "Phishing",
            "ACTIVE",
            "Step-by-step containment procedure for handling credential harvesting emails, malicious email attachments, and domain spoofing.",
            List.of(
                "Identify and extract malicious email headers, sender domains, and embedded URLs.",
                "Block malicious sender domains and URLs at the Secure Email Gateway and DNS firewall level.",
                "Purge malicious email messages from all user inboxes across the organization.",
                "Force credential reset for any user who interacted with the phishing link or submitted credentials.",
                "Enable mandatory Multi-Factor Authentication (MFA) and notify affected personnel."
            )
        );

        seedPlaybookIfMissing(
            "Ransomware Incident Response Playbook",
            "Ransomware",
            "ACTIVE",
            "Emergency containment and remediation protocol for detecting ransomware execution, stopping unauthorized volume encryption, and executing clean system recovery.",
            List.of(
                "Immediately disconnect infected endpoints and servers from local subnets, Wi-Fi, and VPN.",
                "Identify the ransomware variant using file extension signatures, ransom notes, and hash indicators.",
                "Block command-and-control (C2) IP addresses and domains across all firewalls.",
                "Verify integrity of offline and immutable backups prior to initiating restoration.",
                "Perform full system remediation, re-image compromised machines, and restore data from validated clean backups."
            )
        );

        seedPlaybookIfMissing(
            "Ransomware Containment & Recovery SOP",
            "Ransomware",
            "ACTIVE",
            "Critical incident playbook for detecting, isolating, and recovering from ransomware infection and unauthorized encryption attempts.",
            List.of(
                "Immediately disconnect infected endpoints and servers from local network, Wi-Fi, and VPN.",
                "Identify the ransomware variant using file extension signatures, ransom notes, and hash indicators.",
                "Block command-and-control (C2) IP addresses and domains across all firewalls.",
                "Verify integrity of offline and immutable backups prior to initiating restoration.",
                "Perform full system remediation, re-image compromised machines, and restore data from validated clean backups."
            )
        );

        seedPlaybookIfMissing(
            "Insider Threat Response Playbook",
            "Insider Threat",
            "ACTIVE",
            "Comprehensive procedure for containing and mitigating unauthorized insider actions, removable media policy violations, and internal data leakage.",
            List.of(
                "Revoke or restrict affected employee credentials and session tokens immediately.",
                "Isolate the affected workstation from internal networks and prevent unauthorized USB/removable media usage.",
                "Preserve forensic evidence including system logs, file access logs, and active process memory dumps.",
                "Conduct a preliminary investigation with HR and legal teams to assess data exfiltration scope.",
                "Implement elevated monitoring and apply updated Security Group Policy objects."
            )
        );

        seedPlaybookIfMissing(
            "Lateral Movement Response Playbook",
            "Lateral Movement",
            "ACTIVE",
            "Containment and eradication protocol for detecting internal network propagation, privilege escalation, pass-the-hash attacks, and unauthorized remote execution.",
            List.of(
                "Isolate suspected endpoints and domain controllers involved in internal propagation.",
                "Revoke compromised domain credentials, Kerberos TGT tickets, and privileged service accounts.",
                "Analyze process execution trees, WMI activity, and remote PowerShell / PsExec commands.",
                "Deploy host firewall restrictions and enforce network segmentation between subnet zones.",
                "Enforce AppLocker script block policies and reset local administrator password solution (LAPS)."
            )
        );

        seedPlaybookIfMissing(
            "DDoS Mitigation Playbook",
            "DDoS",
            "ACTIVE",
            "Emergency mitigation protocol for defending infrastructure against distributed denial-of-service volumetric, protocol, and application-layer attacks.",
            List.of(
                "Analyze incoming traffic vectors, payload signatures, and target IP addresses.",
                "Activate upstream Cloud/ISP DDoS protection and web application firewall (WAF) rate limiting.",
                "Implement geo-blocking and IP blacklisting for confirmed attack botnet ranges.",
                "Scale load balancing pools and divert non-essential traffic to scrubbing centers.",
                "Monitor service availability metrics, log traffic telemetry, and issue post-incident report."
            )
        );

        seedPlaybookIfMissing(
            "General Incident Response Playbook",
            "General",
            "ACTIVE",
            "Standard operating playbook for initial cyber incident triage, severity escalation, and cross-functional response.",
            List.of(
                "Verify incident details, affected assets, and potential business impact.",
                "Assign severity level and notify on-duty Security Operations Center (SOC) analysts.",
                "Contain affected systems to minimize blast radius.",
                "Perform root cause analysis and apply mitigation controls.",
                "Document timeline, lessons learned, and file final incident report."
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
