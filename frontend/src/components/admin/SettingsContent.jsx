import { useState, useEffect } from "react";
import {
  Grid, Paper, Typography, Box, Switch, TextField, Divider,
  Button, CircularProgress, Snackbar, Alert,
} from "@mui/material";
import { getSettings, updateSettings } from "../../services/reportService";

function SettingsContent() {
  const [settings, setSettings] = useState({
    enforceMfa: true,
    sessionTimeout: 30,
    ipAllowlistEnabled: false,
    emailNotifications: true,
    criticalIncidentAlerts: true,
    dailyDigestEmail: false,
    autoAnalyzeOnSubmission: true,
    autoGenerateKbArticles: true,
    aiSeverityOverrideAllowed: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const fetchSettings = () => {
    setLoading(true);
    getSettings()
      .then((data) => {
        if (data) {
          setSettings({
            enforceMfa: !!data.enforceMfa,
            sessionTimeout: data.sessionTimeout ?? 30,
            ipAllowlistEnabled: !!(data.ipAllowlistEnabled ?? data.ipAllowlist),
            emailNotifications: !!data.emailNotifications,
            criticalIncidentAlerts: !!(data.criticalIncidentAlerts ?? data.criticalAlerts),
            dailyDigestEmail: !!(data.dailyDigestEmail ?? data.dailyDigest),
            autoAnalyzeOnSubmission: !!(data.autoAnalyzeOnSubmission ?? data.autoAnalyze),
            autoGenerateKbArticles: !!(data.autoGenerateKbArticles ?? data.autoKbArticles),
            aiSeverityOverrideAllowed: !!(data.aiSeverityOverrideAllowed ?? data.aiSeverityOverride),
          });
        }
      })
      .catch(() => { /* Use defaults silently */ })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const set = (field) => (e) =>
    setSettings((prev) => ({ ...prev, [field]: e.target.checked ?? e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        enforceMfa: settings.enforceMfa,
        sessionTimeout: Number(settings.sessionTimeout),
        ipAllowlistEnabled: settings.ipAllowlistEnabled,
        emailNotifications: settings.emailNotifications,
        criticalIncidentAlerts: settings.criticalIncidentAlerts,
        dailyDigestEmail: settings.dailyDigestEmail,
        autoAnalyzeOnSubmission: settings.autoAnalyzeOnSubmission,
        autoGenerateKbArticles: settings.autoGenerateKbArticles,
        aiSeverityOverrideAllowed: settings.aiSeverityOverrideAllowed,
      };

      const updated = await updateSettings(payload);
      if (updated) {
        setSettings({
          enforceMfa: !!updated.enforceMfa,
          sessionTimeout: updated.sessionTimeout ?? 30,
          ipAllowlistEnabled: !!(updated.ipAllowlistEnabled ?? updated.ipAllowlist),
          emailNotifications: !!updated.emailNotifications,
          criticalIncidentAlerts: !!(updated.criticalIncidentAlerts ?? updated.criticalAlerts),
          dailyDigestEmail: !!(updated.dailyDigestEmail ?? updated.dailyDigest),
          autoAnalyzeOnSubmission: !!(updated.autoAnalyzeOnSubmission ?? updated.autoAnalyze),
          autoGenerateKbArticles: !!(updated.autoGenerateKbArticles ?? updated.autoKbArticles),
          aiSeverityOverrideAllowed: !!(updated.aiSeverityOverrideAllowed ?? updated.aiSeverityOverride),
        });
      }
      setSnack({ open: true, message: "Settings saved successfully!", severity: "success" });
    } catch {
      setSnack({ open: true, message: "Failed to save settings to backend.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const ToggleRow = ({ title, desc, field, divider = true }) => (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
        <Box>
          <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>{title}</Typography>
          <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>{desc}</Typography>
        </Box>
        <Switch checked={!!settings[field]} onChange={set(field)} />
      </Box>
      {divider && <Divider />}
    </Box>
  );

  if (loading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  }

  return (
    <>
      <Grid container spacing={3}>
        {/* Security */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              Security Settings
            </Typography>

            <ToggleRow title="Enforce MFA for all users" desc="Require multi-factor authentication" field="enforceMfa" />

            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2 }}>
                <Box>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>Session timeout (minutes)</Typography>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>Auto logout after inactivity</Typography>
                </Box>
                <TextField
                  size="small"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings((p) => ({ ...p, sessionTimeout: Number(e.target.value) }))}
                  sx={{
                    width: 70,
                    "& .MuiOutlinedInput-root": { bgcolor: "#374151", "& fieldset": { borderColor: "#444" } },
                    "& input": { color: "#FFFFFF", textAlign: "center" },
                  }}
                />
              </Box>
              <Divider />
            </Box>

            <ToggleRow title="IP allowlist enabled" desc="Restrict access to approved IPs" field="ipAllowlistEnabled" divider={false} />
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              Notification Settings
            </Typography>
            <ToggleRow title="Email notifications" desc="Send email on assignment and resolution" field="emailNotifications" />
            <ToggleRow title="Critical incident alerts" desc="Immediately notify managers" field="criticalIncidentAlerts" />
            <ToggleRow title="Daily digest email" desc="Send daily summary" field="dailyDigestEmail" divider={false} />
          </Paper>
        </Grid>

        {/* AI */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              AI Analysis Settings
            </Typography>
            <ToggleRow title="Auto analyze on submission" desc="Run AI automatically" field="autoAnalyzeOnSubmission" />
            <ToggleRow title="Auto generate KB articles" desc="Generate KB after resolution" field="autoGenerateKbArticles" />
            <ToggleRow title="AI severity override" desc="Allow analysts to override severity" field="aiSeverityOverrideAllowed" divider={false} />
          </Paper>
        </Grid>

        {/* System Info */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              System Information
            </Typography>
            {[
              ["Version", "SecureOps v1.4.2"],
              ["Status", "Healthy"],
              ["Database", "Connected"],
              ["AI Service", "Online"],
            ].map(([label, value], index, arr) => (
              <Box key={label}>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 2 }}>
                  <Typography sx={{ color: "#9CA3AF" }}>{label}</Typography>
                  <Typography sx={{ color: (value === "Healthy" || value === "Connected" || value === "Online") ? "#22C55E" : "#FFFFFF", fontWeight: 600 }}>
                    {value}
                  </Typography>
                </Box>
                {index !== arr.length - 1 && <Divider />}
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>

      {/* Save */}
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
        <Button
          variant="contained"
          disabled={saving}
          onClick={handleSave}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{ bgcolor: "#C62828", textTransform: "none", px: 4, py: 1.2, "&:hover": { bgcolor: "#B71C1C" } }}
        >
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </Box>

      <Snackbar open={snack.open} autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default SettingsContent;