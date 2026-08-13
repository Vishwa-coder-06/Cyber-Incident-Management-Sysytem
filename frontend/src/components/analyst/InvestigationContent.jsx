import { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InvestigationEvidenceUpload from "./InvestigationEvidenceUpload";
import { useLocation } from "react-router-dom";
import {
  getInvestigation,
  addInvestigationNote,
  doInvestigationAction,
} from "../../services/incidentService";

function InvestigationContent() {
  const location = useLocation();
  const incidentId = location.state?.incidentId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!incidentId) { setLoading(false); return; }
    getInvestigation(incidentId)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [incidentId]);

  const handleSaveNote = async () => {
    if (!note.trim() || !incidentId) return;
    setSaving(true);
    try {
      await addInvestigationNote(incidentId, note);
      setNote("");
      setSnack({ open: true, message: "Note saved!", severity: "success" });
      // Refresh timeline
      const updated = await getInvestigation(incidentId);
      setData(updated);
    } catch {
      setSnack({ open: true, message: "Failed to save note.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleAction = async (action) => {
    if (!incidentId) return;
    setActionLoading(action);
    try {
      await doInvestigationAction(incidentId, action);
      setSnack({ open: true, message: `Action "${action}" completed.`, severity: "success" });
      const updated = await getInvestigation(incidentId);
      setData(updated);
    } catch {
      setSnack({ open: true, message: `Failed to execute: ${action}`, severity: "error" });
    } finally {
      setActionLoading("");
    }
  };

  const timeline = data?.timeline ?? [];
  const analysis = data?.analysis ?? {};
  const incident = data?.incident ?? {};

  const dotColor = (idx) => (idx < 2 ? "#4CAF50" : idx === 2 ? "#2196F3" : "#757575");

  if (loading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  }

  return (
    <>
      <Grid container spacing={3}>
        {/* LEFT */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* Notes */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 3, fontWeight: 700 }}>
              Investigation notes
            </Typography>

            <TextField
              fullWidth multiline rows={6}
              placeholder="Add your findings, observations, and evidence here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1E1E1E",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#6750F5" },
                  "&.Mui-focused fieldset": { borderColor: "#6750F5" },
                },
                "& textarea": { color: "#FFFFFF" },
                "& textarea::placeholder": { color: "#9CA3AF", opacity: 1 },
              }}
            />

            <Box display="flex" gap={2}>
              <InvestigationEvidenceUpload />
              <Button
                variant="outlined"
                disabled={saving}
                onClick={handleSaveNote}
                sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none", my: 1 }}
                startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
              >
                Save note
              </Button>
            </Box>
          </Paper>

          {/* Timeline */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              Activity timeline
            </Typography>

            {timeline.length === 0 ? (
              <Typography sx={{ color: "#9CA3AF" }}>No timeline events yet.</Typography>
            ) : (
              timeline.map((item, idx) => (
                <Box key={item.id ?? idx} sx={{ display: "flex", color: "#ffffff", mb: 4 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 2 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: dotColor(idx) }} />
                    <Box sx={{ width: 2, flex: 1, bgcolor: "#444", mt: 1 }} />
                  </Box>
                  <Box>
                    <Typography color="#FFFFFF" fontWeight={600}>
                      {item.description ?? item.event ?? item.action}
                    </Typography>
                    <Typography color="#9CA3AF">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Quick Actions */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 3, fontWeight: 700 }}>
              Quick actions
            </Typography>

            {["MARK_RESOLVED", "ESCALATE", "REQUEST_INFO"].map((action) => (
              <Button
                key={action}
                fullWidth variant="outlined"
                disabled={!!actionLoading}
                onClick={() => handleAction(action)}
                sx={{ mb: 2, color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
                startIcon={actionLoading === action ? <CircularProgress size={14} color="inherit" /> : null}
              >
                {action === "MARK_RESOLVED" ? "Mark resolved"
                  : action === "ESCALATE" ? "Escalate"
                  : "Request info"}
              </Button>
            ))}
          </Paper>

          {/* AI Playbook */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 2, fontWeight: 700 }}>
              AI playbook
            </Typography>

            <Typography sx={{ color: "#dedede", mb: 2 }}>
              {analysis.recommendedPlaybookTitle ?? incident.playbookTitle ?? "No playbook assigned"}
            </Typography>

            {(analysis.immediateAdvice ?? "").split(". ").filter(Boolean).map((step, i) => (
              <Typography key={i} sx={{ color: "#9CA3AF", mb: 1.5 }}>
                {i + 1}. {step}
              </Typography>
            ))}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snack.open} autoHideDuration={4000}
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

export default InvestigationContent;