import { useState } from "react";
import {
  Paper,
  TextField,
  Grid,
  Typography,
  Box,
  Alert,
  Snackbar,
} from "@mui/material";
import EvidenceUpload from "./EvidenceUpload";
import ReportIncidentActions from "./ReportIncidentActions";
import { submitIncident, saveDraftIncident } from "../../../services/incidentService";

function ReportIncidentForm() {
  const [form, setForm] = useState({
    title: "",
    affectedSystem: "",
    incidentDateTime: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#2D2D2D",
      borderRadius: 2,
      "& fieldset": { borderColor: "#555555" },
      "&:hover fieldset": { borderColor: "#1565C0" },
      "&.Mui-focused fieldset": { borderColor: "#1565C0", borderWidth: 2 },
    },
    "& input": { color: "#FFFFFF" },
    "& textarea": { color: "#FFFFFF" },
    "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
    "& textarea::placeholder": { color: "#9CA3AF", opacity: 1 },
  };

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.title.trim()) {
      setSnack({ open: true, message: "Please enter an incident title.", severity: "warning" });
      return;
    }
    setLoading(true);
    try {
      await submitIncident(form);
      setSnack({ open: true, message: "Incident submitted successfully!", severity: "success" });
      setForm({ title: "", affectedSystem: "", incidentDateTime: "", description: "" });
    } catch (err) {
      setSnack({
        open: true,
        message: err?.response?.data?.message ?? "Failed to submit incident.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDraft = async () => {
    if (!form.title.trim()) {
      setSnack({ open: true, message: "Please enter an incident title.", severity: "warning" });
      return;
    }
    setLoading(true);
    try {
      await saveDraftIncident(form);
      setSnack({ open: true, message: "Draft saved!", severity: "info" });
    } catch (err) {
      setSnack({
        open: true,
        message: err?.response?.data?.message ?? "Failed to save draft.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Paper elevation={0} sx={{ bgcolor: "#1E1E1E", p: 4, borderRadius: 2 }}>
        <Grid container spacing={3}>

          {/* Incident Title */}
          <Grid size={12}>
            <Typography sx={{ color: "#FFFFFF", fontSize: 15, fontWeight: 600, mb: 1 }}>
              Incident title
            </Typography>
            <TextField
              fullWidth
              placeholder="Brief description of what happened"
              sx={inputStyle}
              value={form.title}
              onChange={handleChange("title")}
            />
          </Grid>

          {/* Affected System */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: 15, fontWeight: 600, mb: 1 }}>
              Affected system
            </Typography>
            <TextField
              fullWidth
              placeholder="e.g. CRM Server"
              sx={inputStyle}
              value={form.affectedSystem}
              onChange={handleChange("affectedSystem")}
            />
          </Grid>

          {/* Date & Time */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Typography sx={{ color: "#FFFFFF", fontSize: 15, fontWeight: 600, mb: 1 }}>
              Date & time of incident
            </Typography>
            <TextField
              fullWidth
              type="datetime-local"
              sx={inputStyle}
              value={form.incidentDateTime}
              onChange={handleChange("incidentDateTime")}
            />
          </Grid>

          {/* Description */}
          <Grid size={12}>
            <Typography sx={{ color: "#FFFFFF", fontSize: 15, fontWeight: 600, mb: 1 }}>
              Description
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={6}
              placeholder="Describe what you observed and any steps already taken..."
              sx={inputStyle}
              value={form.description}
              onChange={handleChange("description")}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3 }}>
          <EvidenceUpload />
        </Box>

        <Box sx={{ mt: 2 }}>
          <ReportIncidentActions
            loading={loading}
            onSubmit={handleSubmit}
            onDraft={handleDraft}
          />
        </Box>
      </Paper>

      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={snack.severity}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default ReportIncidentForm;