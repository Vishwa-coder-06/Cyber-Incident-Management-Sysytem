import { useState, useEffect, useRef } from "react";
import {
  Grid, Paper, Box, Typography, TextField, Button,
  CircularProgress, Snackbar, Alert, Chip, Dialog,
  DialogTitle, DialogContent, DialogActions, IconButton,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LockIcon from "@mui/icons-material/Lock";
import LogoutIcon from "@mui/icons-material/Logout";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DescriptionIcon from "@mui/icons-material/Description";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../contexts/AuthContext";
import { getMe, updateMe, changePassword, uploadMyPhoto, getProfileStats } from "../../services/userService";
import UserAvatar from "../common/UserAvatar";

const ROLE_COLORS = {
  ADMIN: "#C62828",
  MANAGER: "#6C3CE9",
  ANALYST: "#5B4CF5",
  REPORTER: "#166B37",
};

function ProfileContent({ accentColor }) {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);

  // Dialog States
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passDialogOpen, setPassDialogOpen] = useState(false);

  // Password Visibility States
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forms
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", department: "", phone: "" });
  const [passForm, setPassForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  // Status & Feedback
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const role = (profile?.role ?? user?.role ?? "REPORTER").toUpperCase();
  const themeColor = accentColor ?? ROLE_COLORS[role] ?? "#2563EB";

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const meData = await getMe();
      if (meData) {
        setProfile(meData);
        setForm({
          firstName: meData.firstName ?? "",
          lastName: meData.lastName ?? "",
          email: meData.email ?? "",
          department: meData.department ?? "",
          phone: meData.phone ?? "",
        });
      }
    } catch {
      /* silent */
    }

    try {
      const statsData = await getProfileStats();
      if (statsData) setStats(statsData);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setSnack({ open: true, message: "File size exceeds 5MB limit.", severity: "error" });
      return;
    }

    if (!file.type.startsWith("image/")) {
      setSnack({ open: true, message: "Only image files (JPEG, PNG, WEBP) are allowed.", severity: "error" });
      return;
    }

    setUploadingPhoto(true);
    try {
      await uploadMyPhoto(file);
      await refreshUser();
      const updatedMe = await getMe();
      if (updatedMe) setProfile(updatedMe);
      setSnack({ open: true, message: "Profile picture updated successfully!", severity: "success" });
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to upload photo.";
      setSnack({ open: true, message: msg, severity: "error" });
    } finally {
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSaveProfile = async () => {
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
      if (res) setProfile(res);
      await refreshUser();
      setEditDialogOpen(false);
      setSnack({ open: true, message: "Profile updated successfully!", severity: "success" });
    } catch {
      setSnack({ open: true, message: "Failed to save profile changes.", severity: "error" });
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
      setPassDialogOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Failed to update password.";
      setSnack({ open: true, message: msg, severity: "error" });
    } finally {
      setChangingPass(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fullName = profile
    ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() || profile.username || "—"
    : user?.username ?? "User";

  const hasPhoto = Boolean(profile?.profilePhoto || user?.profilePhoto);

 const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#1E1E1E",
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: themeColor },
    "&.Mui-focused fieldset": { borderColor: themeColor },
    
    // Fix text color for input container when disabled
    "&.Mui-disabled": {
      "& fieldset": { borderColor: "#444" }, // Keeps the dark border
    }
  },
  
  // Normal input style
  "& input": { color: "#FFFFFF" },
  
  // Fix text color for specific disabled text input tag
  "& .MuiInputBase-input.Mui-disabled": {
    color: "#FFFFFF", 
    WebkitTextFillColor: "#FFFFFF", // Overrides browser defaults
  },
  
  // Normal label style
  "& label": { color: "#9CA3AF" },
  
  // Fix text color for the label when disabled
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "#9CA3AF", 
  },
};

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  // Stat Icon Selection
  const getStatIcon = (label) => {
    const l = (label || "").toLowerCase();
    if (l.includes("playbook")) return <MenuBookIcon sx={{ color: themeColor }} />;
    if (l.includes("knowledge") || l.includes("article")) return <DescriptionIcon sx={{ color: "#4ADE80" }} />;
    if (l.includes("resolved")) return <CheckCircleIcon sx={{ color: "#22C55E" }} />;
    return <AssignmentIcon sx={{ color: "#3B82F6" }} />;
  };

  return (
    <>
      <Box sx={{ maxWidth: 840, mx: "auto", py: 2 }}>
        {/* ─── MAIN PROMINENT PROFILE CARD ─── */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            borderRadius: 3,
            p: { xs: 3, sm: 5 },
            textAlign: "center",
            position: "relative",
            border: "1px solid #3A3A3A",
          }}
        >
          {/* Avatar Section */}
          <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
            <UserAvatar
              user={profile ?? user}
              size={110}
              sx={{
                bgcolor: themeColor,
                fontSize: 48,
                border: `3px solid ${themeColor}`,
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}
            />
          </Box>

          {/* Add / Change Photo Button */}
          <Box mb={3}>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoSelect}
              accept="image/jpeg,image/png,image/webp,image/gif"
              style={{ display: "none" }}
            />
            <Button
              variant="outlined"
              size="small"
              disabled={uploadingPhoto}
              startIcon={uploadingPhoto ? <CircularProgress size={14} color="inherit" /> : <PhotoCameraIcon />}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                color: "#FFFFFF",
                borderColor: "#555555",
                textTransform: "none",
                fontSize: 13,
                px: 2, py: 0.6,
                "&:hover": { borderColor: themeColor, color: themeColor, bgcolor: "rgba(255,255,255,0.05)" },
              }}
            >
              {uploadingPhoto ? "Uploading..." : hasPhoto ? "Change Profile Picture" : "Add Profile Picture"}
            </Button>
          </Box>

          {/* Name & Role Badge */}
          <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1 }}>
            {fullName}
          </Typography>

          <Box display="flex" justifyContent="center" alignItems="center" gap={1.5} mb={1}>
            <Chip
              label={role}
              size="small"
              sx={{ bgcolor: themeColor, color: "#FFFFFF", fontWeight: 700, px: 1 }}
            />
            <Typography sx={{ color: "#9CA3AF", fontSize: 15 }}>
              {profile?.department ?? "Security Team"}
            </Typography>
          </Box>

          {profile?.email && (
            <Typography sx={{ color: "#9CA3AF", fontSize: 14, mb: 4 }}>
              {profile.email} {profile?.phone ? `· ${profile.phone}` : ""}
            </Typography>
          )}

          {/* ─── ROLE-SPECIFIC STATISTICS ─── */}
          {stats && (
            <Grid container spacing={2} sx={{ mb: 4, justifyContent: "center" }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: "#1E1E1E",
                    p: 2.5,
                    borderRadius: 2,
                    border: "1px solid #333333",
                    textAlign: "center",
                  }}
                >
                  <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={0.5}>
                    {getStatIcon(stats.primaryLabel)}
                    <Typography sx={{ color: "#9CA3AF", fontSize: 13, fontWeight: 600 }}>
                      {stats.primaryLabel}
                    </Typography>
                  </Box>
                  <Typography variant="h3" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                    {stats.primaryCount}
                  </Typography>
                </Paper>
              </Grid>

              {stats.secondaryLabel && (
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Paper
                    elevation={0}
                    sx={{
                      bgcolor: "#1E1E1E",
                      p: 2.5,
                      borderRadius: 2,
                      border: "1px solid #333333",
                      textAlign: "center",
                    }}
                  >
                    <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={0.5}>
                      {getStatIcon(stats.secondaryLabel)}
                      <Typography sx={{ color: "#9CA3AF", fontSize: 13, fontWeight: 600 }}>
                        {stats.secondaryLabel}
                      </Typography>
                    </Box>
                    <Typography variant="h3" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                      {stats.secondaryCount}
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          )}

          {/* ─── ACTION BUTTONS ─── */}
          <Box display="flex" flexDirection={{ xs: "column", sm: "row" }}  justifyContent="center" sx={{ mt: 5, pt: 3, borderTop: "1px solid #333333" }}>
            <Button
              variant="contained"
              startIcon={<EditIcon />}
              onClick={() => setEditDialogOpen(true)}
              sx={{
                bgcolor: themeColor,
                color: "#FFFFFF",
                textTransform: "none",
                fontWeight: 600,
                px: 3, py: 1,
                mx: 1,
                "&:hover": { filter: "brightness(1.1)" },
              }}
            >
              Edit Profile
            </Button>

            <Button
              variant="outlined"
              startIcon={<LockIcon />}
              onClick={() => setPassDialogOpen(true)}
              sx={{
                color: "#FFFFFF",
                borderColor: "#555555",
                textTransform: "none",
                fontWeight: 600,
                px: 3, py: 1,
                mx: 1,
                "&:hover": { borderColor: themeColor, color: themeColor },
              }}
            >
              Change Password
            </Button>

            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: "#EF4444",
                borderColor: "#DC2626",
                textTransform: "none",
                fontWeight: 600,
                px: 3, py: 1,
                mx: 1,
                "&:hover": { bgcolor: "rgba(220,38,38,0.15)", borderColor: "#EF4444" },
              }}
            >
              Logout
            </Button>
          </Box>
        </Paper>
      </Box>

      {/* ─── EDIT PROFILE DIALOG ─── */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#1F1F1F", color: "#FFFFFF", borderRadius: 2 } }}
      >
        <DialogTitle sx={{display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", py: 2 ,bgcolor : "#1E1E1E" }}>
          <Typography variant="h6" fontWeight={700} sx = {{color:"#9CA3AF"}}>
            Edit Personal Information
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ py: 1, display: "flex", flexDirection: "column", gap: 2 , bgcolor: "#1E1E1E" ,pt: '16px !important'  }}>
          <Grid container spacing={2} mt={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="First Name"
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                sx={fieldStyle}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Last Name"
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                sx={fieldStyle}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Email Address"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            sx={fieldStyle}
            InputLabelProps={{ shrink: true }}
          />

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Department"
                value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                sx={fieldStyle}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Phone Number"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                sx={fieldStyle}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
               fullWidth
               label="Role (Read-Only)"
               value={role}
               disabled
               sx={fieldStyle}
               InputLabelProps={{ shrink: true }}
              />
             </Grid>
          </Grid>

          
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2.5, borderTop: "1px solid #333", pt: 2 , bgcolor: "#1E1E1E" }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: "#9CA3AF", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={saving}
            onClick={handleSaveProfile}
            sx={{ bgcolor: themeColor, textTransform: "none", fontWeight: 600, "&:hover": { filter: "brightness(1.1)" } }}
            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── CHANGE PASSWORD DIALOG ─── */}
      <Dialog
        open={passDialogOpen}
        onClose={() => setPassDialogOpen(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#1E1E1E", color: "#FFFFFF", borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", py:2 , bgcolor:"#1E1E1E" }}>
          <Typography variant="h6" fontWeight={700} sx={{color:"#9CA3AF"}}>
            Change Password
          </Typography>
          <IconButton onClick={() => setPassDialogOpen(false)}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ py: 3, display: "flex", flexDirection: "column", gap: 2.5, bgcolor: "#1E1E1E", pt: '24px !important', pb: '28px !important' }}>
          <TextField
            fullWidth
            type={showCurrentPassword ? "text" : "password"}
            label="Current Password"
            value={passForm.currentPassword}
            onChange={(e) => setPassForm((p) => ({ ...p, currentPassword: e.target.value }))}
            sx={fieldStyle}
            InputLabelProps={{ shrink: true }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle current password visibility"
                      onClick={() => setShowCurrentPassword((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      tabIndex={-1}
                      sx={{ color: "#9CA3AF" }}
                    >
                      {showCurrentPassword ? (
                        <VisibilityOff sx={{ color: "#9CA3AF" }} />
                      ) : (
                        <Visibility sx={{ color: "#9CA3AF" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle current password visibility"
                    onClick={() => setShowCurrentPassword((v) => !v)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    tabIndex={-1}
                    sx={{ color: "#9CA3AF" }}
                  >
                    {showCurrentPassword ? (
                      <VisibilityOff sx={{ color: "#9CA3AF" }} />
                    ) : (
                      <Visibility sx={{ color: "#9CA3AF" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type={showNewPassword ? "text" : "password"}
            label="New Password"
            value={passForm.newPassword}
            onChange={(e) => setPassForm((p) => ({ ...p, newPassword: e.target.value }))}
            sx={fieldStyle}
            InputLabelProps={{ shrink: true }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle new password visibility"
                      onClick={() => setShowNewPassword((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      tabIndex={-1}
                      sx={{ color: "#9CA3AF" }}
                    >
                      {showNewPassword ? (
                        <VisibilityOff sx={{ color: "#9CA3AF" }} />
                      ) : (
                        <Visibility sx={{ color: "#9CA3AF" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle new password visibility"
                    onClick={() => setShowNewPassword((v) => !v)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    tabIndex={-1}
                    sx={{ color: "#9CA3AF" }}
                  >
                    {showNewPassword ? (
                      <VisibilityOff sx={{ color: "#9CA3AF" }} />
                    ) : (
                      <Visibility sx={{ color: "#9CA3AF" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm New Password"
            value={passForm.confirmPassword}
            onChange={(e) => setPassForm((p) => ({ ...p, confirmPassword: e.target.value }))}
            sx={fieldStyle}
            InputLabelProps={{ shrink: true }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={() => setShowConfirmPassword((v) => !v)}
                      onMouseDown={(e) => e.preventDefault()}
                      edge="end"
                      tabIndex={-1}
                      sx={{ color: "#9CA3AF" }}
                    >
                      {showConfirmPassword ? (
                        <VisibilityOff sx={{ color: "#9CA3AF" }} />
                      ) : (
                        <Visibility sx={{ color: "#9CA3AF" }} />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    onMouseDown={(e) => e.preventDefault()}
                    edge="end"
                    tabIndex={-1}
                    sx={{ color: "#9CA3AF" }}
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff sx={{ color: "#9CA3AF" }} />
                    ) : (
                      <Visibility sx={{ color: "#9CA3AF" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, pt: 3, borderTop: "1px solid #333", bgcolor: "#1E1E1E", display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={() => setPassDialogOpen(false)} sx={{ color: "#9CA3AF", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={changingPass}
            onClick={handleChangePassword}
            sx={{ bgcolor: themeColor, textTransform: "none", fontWeight: 600, "&:hover": { filter: "brightness(1.1)" } }}
            startIcon={changingPass ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {changingPass ? "Updating..." : "Update Password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Notifications */}
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