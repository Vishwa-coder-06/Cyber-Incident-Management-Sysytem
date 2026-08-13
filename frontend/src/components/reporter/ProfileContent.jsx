import { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  Switch,
  CircularProgress,
  Snackbar,
  Alert,
  Collapse,
  Divider,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import { getMe, updateMe, changePassword } from "../../services/userService";
import {
  getPreferences,
  updatePreferences,
} from "../../services/notificationService";

function ProfileContent({ accentColor = "#1565C0" }) {
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", department: "", phone: "" });
  const [originalForm, setOriginalForm] = useState({ firstName: "", lastName: "", email: "", department: "", phone: "" });

  const [showPassSection, setShowPassSection] = useState(false);
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const [prefs, setPrefs] = useState({ incidentStatusUpdates: true, aiAnalysisComplete: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const fetchProfileData = () => {
    setLoading(true);
    Promise.all([
      getMe().catch(() => null),
      getPreferences().catch(() => null),
    ]).then(([meData, prefData]) => {
      if (meData) {
        setProfile(meData);
        const f = {
          firstName: meData.firstName ?? "",
          lastName: meData.lastName ?? "",
          email: meData.email ?? "",
          department: meData.department ?? "",
          phone: meData.phone ?? "",
        };
        setForm(f);
        setOriginalForm(f);
      }
      if (prefData) setPrefs(prefData);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchProfileData(); }, []);

  const handleEditClick = () => setEditMode(true);

  const handleCancel = () => {
    setForm({ ...originalForm });
    setEditMode(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        ...profile,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        department: form.department,
        phone: form.phone,
      };
      const res = await updateMe(payload);
      if (res) {
        setProfile(res);
        const updated = {
          firstName: res.firstName ?? form.firstName,
          lastName: res.lastName ?? form.lastName,
          email: res.email ?? form.email,
          department: res.department ?? form.department,
          phone: res.phone ?? form.phone,
        };
        setForm(updated);
        setOriginalForm(updated);
      } else {
        setOriginalForm({ ...form });
      }
      setEditMode(false);
      setSnack({ open: true, message: "Profile updated successfully!", severity: "success" });
    } catch {
      setSnack({ open: true, message: "Failed to save profile.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passForm.currentPassword) {
      setSnack({ open: true, message: "Please enter your current password.", severity: "error" });
      return;
    }
    if (!passForm.newPassword || passForm.newPassword.length < 4) {
      setSnack({ open: true, message: "New password must be at least 4 characters.", severity: "error" });
      return;
    }
    if (passForm.newPassword !== passForm.confirmPassword) {
      setSnack({ open: true, message: "New passwords do not match.", severity: "error" });
      return;
    }
    setChangingPass(true);
    try {
      await changePassword({ currentPassword: passForm.currentPassword, newPassword: passForm.newPassword });
      setSnack({ open: true, message: "Password updated successfully!", severity: "success" });
      setPassForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setShowPassSection(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update password.";
      setSnack({ open: true, message: msg, severity: "error" });
    } finally {
      setChangingPass(false);
    }
  };

  const handlePrefChange = async (field, value) => {
    const updated = { ...prefs, [field]: value };
    setPrefs(updated);
    try { await updatePreferences(updated); } catch { /* silent */ }
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#1E1E1E",
      "& fieldset": { borderColor: editMode ? "#444" : "#333" },
      "&:hover fieldset": { borderColor: editMode ? accentColor : "#333" },
      "&.Mui-focused fieldset": { borderColor: accentColor },
    },
    "& input": { color: "#FFFFFF" },
    "& .Mui-disabled": { "& input": { WebkitTextFillColor: "#AAAAAA" } },
  };

  const passInputStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#1E1E1E",
      "& fieldset": { borderColor: "#444" },
      "&:hover fieldset": { borderColor: accentColor },
      "&.Mui-focused fieldset": { borderColor: accentColor },
    },
    "& input": { color: "#FFFFFF" },
  };

  const fullName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || profile.username || "—"
    : "—";

  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {/* LEFT — Avatar card */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 4, textAlign: "center" }}>
            <Avatar sx={{ width: 96, height: 96, bgcolor: accentColor, fontSize: 42, mx: "auto", mb: 3 }}>
              {initials}
            </Avatar>

            <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
              {fullName}
            </Typography>

            <Typography sx={{ color: "#9CA3AF", mt: 1 }}>
              {profile?.role ?? "User"} · {profile?.department ?? "Security Team"}
            </Typography>

            {profile?.email && (
              <Typography sx={{ color: "#6B7280", fontSize: 13, mt: 0.5 }}>
                {profile.email}
              </Typography>
            )}

            <Box sx={{ display: "flex", justifyContent: "center", gap: 6, mt: 4, mb: 2 }}>
              <Box sx={{ textAlign: "center" }}>
                <AssignmentIcon sx={{ color: "#9CA3AF" }} />
                <Typography sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                  {profile?.totalIncidents ?? 0} incidents
                </Typography>
              </Box>
              <Box sx={{ textAlign: "center" }}>
                <CheckIcon sx={{ color: "#9CA3AF" }} />
                <Typography sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                  {profile?.resolvedIncidents ?? 0} resolved
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 8 }}>

          {/* Personal Information */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                Personal Information
              </Typography>
              {!editMode && (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={handleEditClick}
                  size="small"
                  sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none",
                    "&:hover": { borderColor: accentColor, color: accentColor } }}
                >
                  Edit Profile
                </Button>
              )}
            </Box>

            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5 }}>FIRST NAME</Typography>
                <TextField
                  fullWidth
                  value={form.firstName}
                  disabled={!editMode}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5 }}>LAST NAME</Typography>
                <TextField
                  fullWidth
                  value={form.lastName}
                  disabled={!editMode}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  sx={inputStyle}
                />
              </Grid>
            </Grid>

            <Box mb={2}>
              <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5 }}>EMAIL ADDRESS</Typography>
              <TextField
                fullWidth
                value={form.email}
                disabled={!editMode}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                sx={inputStyle}
              />
            </Box>

            <Grid container spacing={2} mb={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5 }}>DEPARTMENT</Typography>
                <TextField
                  fullWidth
                  value={form.department}
                  disabled={!editMode}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  sx={inputStyle}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5 }}>PHONE</Typography>
                <TextField
                  fullWidth
                  value={form.phone}
                  disabled={!editMode}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  sx={inputStyle}
                />
              </Grid>
            </Grid>

            <Box mb={3}>
              <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5 }}>ROLE</Typography>
              <TextField
                fullWidth
                value={profile?.role ?? "—"}
                disabled
                sx={inputStyle}
              />
            </Box>

            {editMode && (
              <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  disabled={saving}
                  onClick={handleSave}
                  sx={{ bgcolor: accentColor, textTransform: "none", "&:hover": { filter: "brightness(1.1)" } }}
                  startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </Box>
            )}
          </Paper>

          {/* Change Password */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                Change Password
              </Typography>
              <Button
                variant="outlined"
                startIcon={<LockIcon />}
                onClick={() => setShowPassSection((v) => !v)}
                size="small"
                sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none",
                  "&:hover": { borderColor: accentColor, color: accentColor } }}
              >
                {showPassSection ? "Hide" : "Change Password"}
              </Button>
            </Box>

            <Collapse in={showPassSection}>
              <Divider sx={{ my: 2, bgcolor: "#444" }} />

              <Box mb={2}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5 }}>CURRENT PASSWORD</Typography>
                <TextField
                  fullWidth type="password"
                  value={passForm.currentPassword}
                  onChange={(e) => setPassForm((p) => ({ ...p, currentPassword: e.target.value }))}
                  sx={passInputStyle}
                />
              </Box>

              <Grid container spacing={2} mb={3}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5 }}>NEW PASSWORD</Typography>
                  <TextField
                    fullWidth type="password"
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))}
                    sx={passInputStyle}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5 }}>CONFIRM PASSWORD</Typography>
                  <TextField
                    fullWidth type="password"
                    value={passForm.confirmPassword}
                    onChange={(e) => setPassForm((p) => ({ ...p, confirmPassword: e.target.value }))}
                    sx={passInputStyle}
                  />
                </Grid>
              </Grid>

              <Button
                variant="contained"
                disabled={changingPass}
                onClick={handleChangePassword}
                sx={{ bgcolor: accentColor, textTransform: "none", "&:hover": { filter: "brightness(1.1)" } }}
                startIcon={changingPass ? <CircularProgress size={16} color="inherit" /> : null}
              >
                {changingPass ? "Updating..." : "Update Password"}
              </Button>
            </Collapse>
          </Paper>

          {/* Notification Preferences */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              Notification Preferences
            </Typography>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography sx={{ color: "#FFFFFF" }} fontWeight={600}>Incident status updates</Typography>
                <Typography sx={{ color: "#9CA3AF" }} fontSize={14}>Email when your incident status changes</Typography>
              </Box>
              <Switch
                checked={!!prefs.incidentStatusUpdates}
                onChange={(e) => handlePrefChange("incidentStatusUpdates", e.target.checked)}
              />
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography sx={{ color: "#FFFFFF" }} fontWeight={600}>AI analysis complete</Typography>
                <Typography sx={{ color: "#9CA3AF" }} fontSize={14}>Notify when AI finishes analyzing</Typography>
              </Box>
              <Switch
                checked={!!prefs.aiAnalysisComplete}
                onChange={(e) => handlePrefChange("aiAnalysisComplete", e.target.checked)}
              />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ProfileContent;