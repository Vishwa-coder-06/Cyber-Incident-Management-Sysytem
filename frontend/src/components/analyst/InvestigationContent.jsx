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
  Chip,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import InvestigationEvidenceUpload from "./InvestigationEvidenceUpload";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  getInvestigation,
  addInvestigationNote,
  doInvestigationAction,
} from "../../services/incidentService";

function severityColor(sev) {
  const s = (sev || "").toUpperCase();
  if (s === "CRITICAL") return "#EF4444";
  if (s === "HIGH") return "#F97316";
  if (s === "MEDIUM") return "#F59E0B";
  return "#22C55E";
}

function statusColor(status) {
  const s = (status || "ASSIGNED").toUpperCase();
  if (s === "RESOLVED" || s === "CLOSED") return "#16A34A";
  if (s === "IN_PROGRESS" || s === "INVESTIGATING" || s === "ASSIGNED") return "#2563EB";
  return "#D97706";
}

function InvestigationContent() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const incidentId = params.incidentId || location.state?.incidentId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionLoading, setActionLoading] = useState("");
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!incidentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
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
      setSnack({ open: true, message: "Investigation note recorded successfully!", severity: "success" });
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
      setSnack({ open: true, message: `Action "${action}" executed.`, severity: "success" });
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

  const dotColor = (idx) => (idx < 2 ? "#16A34A" : idx === 2 ? "#2563EB" : "#757575");

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10} gap={2}>
        <CircularProgress size={32} sx={{ color: "#2563EB" }} />
        <Typography sx={{ color: "#9CA3AF" }}>Loading investigation workspace...</Typography>
      </Box>
    );
  }

  if (!incidentId || !data) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", py: 6, textAlign: "center" }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 2 }}>
            No Incident Selected
          </Typography>
          <Typography sx={{ color: "#9CA3AF", mb: 3 }}>
            Please select an incident from Assigned Incidents.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate("/analyst/incidents")}
            sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
          >
            ← View Assigned Incidents
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <>
      {/* Navigation Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/analyst/incident-details/${incidentId}`, { state: { incidentId } })}
          sx={{ color: "#9CA3AF", textTransform: "none", "&:hover": { color: "#FFFFFF" } }}
        >
          Back to Incident Details
        </Button>

        <Button
          variant="contained"
          onClick={() => navigate(`/analyst/resolution/${incidentId}`, {
            state: { incidentId, incidentTitle: incident.title }
          })}
          sx={{
            bgcolor: incident.status === "RESOLVED" ? "#2B4D36" : "#16A34A",
            color: "#FFFFFF",
            fontWeight: 700,
            px: 3,
            py: 1,
            borderRadius: 1.5,
            textTransform: "none",
            fontSize: 14,
            "&:hover": { bgcolor: "#15803D" },
          }}
        >
          {incident.status === "RESOLVED" ? "View Final Resolution →" : "Proceed to Resolution →"}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT COLUMN: Section A (Original Incident Info) + Section B (Notes & Evidence) */}
        <Grid size={{ xs: 12, md: 8 }}>
          {/* SECTION A: Original Incident Information */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600 }}>
                  SECTION A — ORIGINAL INCIDENT INFORMATION
                </Typography>
                <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: 700, mt: 0.5 }}>
                  #INC-{incident.incidentId ?? incidentId}: {incident.title}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Chip
                  label={incident.severity || "HIGH"}
                  size="small"
                  sx={{ bgcolor: severityColor(incident.severity), color: "#FFFFFF", fontWeight: 700 }}
                />
                <Chip
                  label={incident.status || "INVESTIGATING"}
                  size="small"
                  sx={{ bgcolor: statusColor(incident.status), color: "#FFFFFF", fontWeight: 600 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 1.5, bgcolor: "#444" }} />

            <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 0.5, fontWeight: 600 }}>
              REPORTER DESCRIPTION
            </Typography>
            <Typography sx={{ color: "#E5E7EB", fontSize: 14, lineHeight: 1.6, mb: 2, whiteSpace: "pre-wrap" }}>
              {incident.description || "No description provided."}
            </Typography>

            <Grid container spacing={2} sx={{ bgcolor: "#1E1E1E", p: 1.5, borderRadius: 1.5 }}>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 11 }}>AFFECTED SYSTEM</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 13, mt: 0.2 }}>
                  {incident.affectedSystem || "—"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 11 }}>AI ATTACK TYPE</Typography>
                <Typography sx={{ color: "#60A5FA", fontWeight: 700, fontSize: 13, mt: 0.2 }}>
                  {analysis.attackType || "Analyzing..."}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 11 }}>AI CONFIDENCE</Typography>
                <Typography sx={{ color: "#4ADE80", fontWeight: 700, fontSize: 13, mt: 0.2 }}>
                  {analysis.confidence != null ? `${(analysis.confidence * 100).toFixed(1)}%` : "—"}
                </Typography>
              </Grid>
              <Grid size={{ xs: 6, sm: 3 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 11 }}>AI SEVERITY</Typography>
                <Typography sx={{ color: severityColor(analysis.aiSeverity || analysis.severity), fontWeight: 700, fontSize: 13, mt: 0.2 }}>
                  {analysis.aiSeverity || analysis.severity || "MEDIUM"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* SECTION B: Investigation Workspace — Notes & Evidence */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 0.5, fontWeight: 700 }}>
              SECTION B — INVESTIGATION NOTES & EVIDENCE
            </Typography>
            <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 2 }}>
              Record analysis findings, technical indicators, and attach forensic evidence.
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={5}
              placeholder="Add your findings, observations, IOCs, and evidence here..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#1E1E1E",
                  "& fieldset": { borderColor: "#444" },
                  "&:hover fieldset": { borderColor: "#2563EB" },
                  "&.Mui-focused fieldset": { borderColor: "#2563EB" },
                },
                "& textarea": { color: "#FFFFFF" },
                "& textarea::placeholder": { color: "#9CA3AF", opacity: 1 },
              }}
            />

            <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
              <InvestigationEvidenceUpload />
              <Button
                variant="contained"
                disabled={saving || !note.trim()}
                onClick={handleSaveNote}
                sx={{
                  bgcolor: "#2563EB",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  textTransform: "none",
                  "&:hover": { bgcolor: "#1D4ED8" },
                }}
                startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
              >
                Save Investigation Note
              </Button>
            </Box>
          </Paper>

          {/* Activity Timeline */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 2 }}>
              Investigation Activity Timeline
            </Typography>

            {timeline.length === 0 ? (
              <Typography sx={{ color: "#9CA3AF" }}>No timeline events recorded yet.</Typography>
            ) : (
              timeline.map((item, idx) => (
                <Box key={item.id ?? item.timelineId ?? idx} sx={{ display: "flex", color: "#ffffff", mb: 3 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mr: 2 }}>
                    <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: dotColor(idx) }} />
                    {idx < timeline.length - 1 && <Box sx={{ width: 2, flex: 1, bgcolor: "#444", mt: 1 }} />}
                  </Box>
                  <Box>
                    <Typography color="#FFFFFF" fontWeight={600} fontSize={14}>
                      {item.description ?? item.event ?? item.action}
                    </Typography>
                    <Typography color="#9CA3AF" fontSize={12} mt={0.3}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: Quick Actions & AI Playbook */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Quick Actions */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 2, fontWeight: 700 }}>
              Quick Actions
            </Typography>

            {["ESCALATE", "REQUEST_INFO"].map((action) => (
              <Button
                key={action}
                fullWidth
                variant="outlined"
                disabled={!!actionLoading || incident.status === "RESOLVED"}
                onClick={() => handleAction(action)}
                sx={{ mb: 1.5, color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
                startIcon={actionLoading === action ? <CircularProgress size={14} color="inherit" /> : null}
              >
                {action === "ESCALATE" ? "Escalate Incident" : "Request More Information"}
              </Button>
            ))}
          </Paper>

          {/* AI Recommended Playbook */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SmartToyIcon sx={{ color: "#60A5FA" }} />
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                AI Recommended Playbook
              </Typography>
            </Box>

            <Typography sx={{ color: "#60A5FA", fontWeight: 700, fontSize: 15, mb: 1.5 }}>
              {analysis.recommendedPlaybookTitle ?? incident.playbookTitle ?? "General Incident Response Playbook"}
            </Typography>

            {(analysis.immediateAdvice ?? "Isolate affected systems. Collect forensic memory and log dumps. Reset compromised credentials.")
              .split(". ")
              .filter(Boolean)
              .map((step, i) => (
                <Box key={i} sx={{ display: "flex", gap: 1, mb: 1.5 }}>
                  <Typography sx={{ color: "#3B82F6", fontWeight: 700, fontSize: 13 }}>
                    {i + 1}.
                  </Typography>
                  <Typography sx={{ color: "#D1D5DB", fontSize: 13, lineHeight: 1.5 }}>
                    {step}
                  </Typography>
                </Box>
              ))}
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

export default InvestigationContent;