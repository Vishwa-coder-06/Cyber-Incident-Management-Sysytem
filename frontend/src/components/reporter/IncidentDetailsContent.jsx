import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CloseIcon from "@mui/icons-material/Close";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getReporterIncidentDetails, getIncidentResolution } from "../../services/incidentService";
import { getPlaybooks } from "../../services/knowledgeService";

function IncidentDetailsContent() {
  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
  const incidentId = params.incidentId || location.state?.incidentId;
  const [data, setData] = useState(null);
  const [resolution, setResolution] = useState(null);
  const [loading, setLoading] = useState(true);

  // Playbook dialog
  const [playbookDialog, setPlaybookDialog] = useState({ open: false, playbook: null, loading: false });

  useEffect(() => {
    if (!incidentId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    getReporterIncidentDetails(incidentId)
      .then((inc) => {
        setData(inc);
        const status = (inc?.status || "").toUpperCase();
        if (status === "RESOLVED" || status === "CLOSED") {
          getIncidentResolution(incidentId)
            .then(setResolution)
            .catch(() => setResolution(null));
        } else {
          setResolution(null);
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [incidentId]);

  const handlePlaybookClick = async (playbookTitle) => {
    if (!playbookTitle || playbookTitle === "No playbook assigned") return;
    setPlaybookDialog({ open: true, playbook: null, loading: true });
    try {
      const all = await getPlaybooks();
      const found = Array.isArray(all)
        ? all.find((p) =>
            (p.name ?? p.title ?? "").toLowerCase() === playbookTitle.toLowerCase()
          ) ?? all.find((p) =>
            (p.name ?? p.title ?? "").toLowerCase().includes(playbookTitle.toLowerCase().split(" ")[0])
          )
        : null;
      setPlaybookDialog({ open: true, playbook: found ?? { title: playbookTitle }, loading: false });
    } catch {
      setPlaybookDialog({ open: true, playbook: { title: playbookTitle }, loading: false });
    }
  };

  const closePlaybookDialog = () => setPlaybookDialog({ open: false, playbook: null, loading: false });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress size={32} sx={{ color: "#2563EB" }} />
      </Box>
    );
  }

  if (!incidentId || !data) {
    return (
      <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 4, borderRadius: 2, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 1 }}>
          No Incident Selected
        </Typography>
        <Typography sx={{ color: "#9CA3AF" }}>
          Please select an incident from your submitted incidents list.
        </Typography>
      </Paper>
    );
  }

  const timeline = data.timeline ?? [];
  const analysis = data.analysis ?? {};
  const playbookTitle = analysis.recommendedPlaybookTitle ?? "No playbook assigned";
  const isResolved = (data.status || "").toUpperCase() === "RESOLVED" || (data.status || "").toUpperCase() === "CLOSED";

  const severityColor = (sev) => {
    const s = (sev || "").toUpperCase();
    if (s === "CRITICAL") return "error";
    if (s === "HIGH") return "warning";
    if (s === "MEDIUM") return "info";
    return "default";
  };

  return (
    <>
      {/* RESOLUTION BANNER IF RESOLVED */}
      {isResolved && (
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#143320",
            border: "1px solid #1E6B3C",
            borderRadius: 2,
            p: 2.5,
            mb: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <TaskAltIcon sx={{ color: "#4ADE80", fontSize: 32 }} />
            <Box>
              <Typography sx={{ color: "#4ADE80", fontWeight: 700, fontSize: 16 }}>
                Incident Resolved & Closed
              </Typography>
              <Typography sx={{ color: "#A7F3D0", fontSize: 13 }}>
                This incident has been fully investigated and resolved by Security Operations.
              </Typography>
            </Box>
          </Box>

          <Chip
            icon={<CheckCircleIcon sx={{ "&&": { color: "#22C55E" } }} />}
            label="RESOLVED & CLOSED"
            sx={{ bgcolor: "#064E3B", color: "#4ADE80", fontWeight: 700, px: 1 }}
          />
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* LEFT COLUMN */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Incident Information */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" mb={3}>
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                Incident Information
              </Typography>
              <Chip
                label={data.severity ?? "—"}
                color={severityColor(data.severity)}
                size="small"
              />
            </Box>

            <Info title="Incident ID" value={`#INC-${data.incidentId ?? data.id}`} />
            <Info title="Title" value={data.title ?? "—"} />
            <Info title="Affected System" value={data.affectedSystem ?? "—"} />
            <Info title="Reported By" value={data.reportedByName ?? data.reportedBy ?? "—"} />
            <Info title="Date Reported" value={data.incidentDateTime ? new Date(data.incidentDateTime).toLocaleString() : "—"} />
            <Info title="Status" value={data.status ?? "—"} color={isResolved ? "#4ADE80" : "#42A5F5"} />
            <Info title="Assigned Analyst" value={data.assignedToName ?? data.assignedTo ?? "Unassigned"} />
          </Paper>

          {/* Description */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" mb={2} sx={{ color: "#FFFFFF", fontWeight: 600 }}>
              Original Incident Description
            </Typography>
            <Typography sx={{ color: "#E5E7EB" }} lineHeight={1.8}>
              {data.description ?? "No description provided."}
            </Typography>
          </Paper>

          {/* RESOLUTION DETAILS SECTION FOR REPORTER (READ-ONLY) */}
          {isResolved && resolution && (
            <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3, border: "1px solid #16A34A" }}>
              <Typography variant="h6" sx={{ color: "#4ADE80", fontWeight: 700, mb: 2 }}>
                Resolution Details
              </Typography>

              {resolution.finalAttackType && (
                <Box mb={2}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>FINAL CONFIRMED ATTACK TYPE</Typography>
                  <Chip label={resolution.finalAttackType} size="small" sx={{ bgcolor: "#1E3A8A", color: "#93C5FD", fontWeight: 700 }} />
                </Box>
              )}

              {resolution.finalSeverity && (
                <Box mb={2}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>FINAL CONFIRMED SEVERITY</Typography>
                  <Chip label={resolution.finalSeverity} size="small" color={severityColor(resolution.finalSeverity)} sx={{ fontWeight: 700 }} />
                </Box>
              )}

              {resolution.resolutionSummary && (
                <Box mb={2.5}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>RESOLUTION SUMMARY</Typography>
                  <Typography sx={{ color: "#FFFFFF", lineHeight: 1.7, fontSize: 14 }}>
                    {resolution.resolutionSummary}
                  </Typography>
                </Box>
              )}

              {Array.isArray(resolution.resolutionSteps) && resolution.resolutionSteps.length > 0 && (
                <Box mb={2.5}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 1 }}>REMEDIATION STEPS TAKEN</Typography>
                  {resolution.resolutionSteps.map((step, idx) => (
                    <Box key={idx} display="flex" gap={1.5} mb={1}>
                      <Box sx={{ minWidth: 22, height: 22, borderRadius: "50%", bgcolor: "#16A34A", color: "#FFF", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700 }}>
                        {idx + 1}
                      </Box>
                      <Typography sx={{ color: "#E5E7EB", fontSize: 14, alignSelf: "center" }}>
                        {step}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}

              {resolution.rootCause && (
                <Box mb={2.5}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>IDENTIFIED ROOT CAUSE</Typography>
                  <Typography sx={{ color: "#D1D5DB", fontSize: 14, lineHeight: 1.6 }}>
                    {resolution.rootCause}
                  </Typography>
                </Box>
              )}

              {resolution.lessonsLearned && (
                <Box mb={2.5}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>PREVENTIVE ADVICE & LESSONS LEARNED</Typography>
                  <Typography sx={{ color: "#D1D5DB", fontSize: 14, lineHeight: 1.6 }}>
                    {resolution.lessonsLearned}
                  </Typography>
                </Box>
              )}

              <Box display="flex" justifyContent="space-between" alignItems="center" pt={1.5} borderTop="1px solid #444">
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>
                  Resolved by {resolution.resolvedByName || "Security Analyst"} on {resolution.resolvedAt ? new Date(resolution.resolvedAt).toLocaleString() : "Recently"}
                </Typography>

                {resolution.kbArticleId && (
                  <Chip
                    icon={<MenuBookIcon sx={{ "&&": { color: "#60A5FA" } }} />}
                    label="Knowledge Article Published"
                    size="small"
                    sx={{ bgcolor: "#1E3A8A", color: "#60A5FA", fontWeight: 600 }}
                  />
                )}
              </Box>
            </Paper>
          )}
        </Grid>

        {/* RIGHT COLUMN */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* AI Summary */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: "#FFFFFF" }}>
              AI Analysis Summary
            </Typography>

            <Label title="AI CLASSIFIED ATTACK TYPE" />
            <Paper sx={{ bgcolor: "#1E1E1E", p: 1.5, mb: 3 }}>
              <Typography sx={{ color: "#FFFFFF" }}>
                {analysis.attackType ?? analysis.category ?? "Not analyzed yet"}
              </Typography>
            </Paper>

            <Label title="RULE-DERIVED AI SEVERITY" />
            <Paper sx={{ bgcolor: "#1E1E1E", p: 1.5, mb: 3 }}>
              <Typography sx={{ color: "#FFFFFF" }}>
                {analysis.aiSeverity ?? analysis.severity ?? data.severity ?? "—"}
              </Typography>
            </Paper>

            <Label title="RECOMMENDED PLAYBOOK" />
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{
                cursor: playbookTitle !== "No playbook assigned" ? "pointer" : "default",
                borderRadius: 1,
                p: 1.5,
                bgcolor: "#1E1E1E",
                border: "1px solid #444",
                "&:hover": playbookTitle !== "No playbook assigned"
                  ? { borderColor: "#60A5FA", bgcolor: "#252525" }
                  : {},
                transition: "all 0.2s",
              }}
              onClick={() => handlePlaybookClick(playbookTitle)}
            >
              <ArticleOutlinedIcon sx={{ color: "#42A5F5" }} />
              <Typography sx={{
                color: "#42A5F5",
                fontWeight: 600,
                textDecoration: playbookTitle !== "No playbook assigned" ? "underline" : "none",
                textDecorationColor: "rgba(66,165,245,0.4)",
              }}>
                {playbookTitle}
              </Typography>
            </Box>
          </Paper>

          {/* Timeline */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: "#FFFFFF" }}>
              Incident Timeline
            </Typography>

            {timeline.length === 0 ? (
              <Typography sx={{ color: "#9CA3AF" }}>No timeline events recorded yet.</Typography>
            ) : (
              timeline.map((event, idx) => (
                <Box key={event.id ?? idx}>
                  {TimelineItem(
                    event.description ?? event.event ?? event.action,
                    event.createdAt ? new Date(event.createdAt).toLocaleString() : "",
                    idx === 0 ? "#22C55E" : "#3B82F6"
                  )}
                  {idx < timeline.length - 1 && <Divider sx={{ my: 2, borderColor: "#444" }} />}
                </Box>
              ))
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Playbook Details Dialog */}
      <Dialog
        open={playbookDialog.open}
        onClose={closePlaybookDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1F1F1F",
            color: "#FFFFFF",
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderBottom: "1px solid #333",
            px: 3, py: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <ArticleOutlinedIcon sx={{ color: "#60A5FA" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
              {playbookDialog.playbook?.name ?? playbookDialog.playbook?.title ?? "Playbook Details"}
            </Typography>
          </Box>
          <IconButton onClick={closePlaybookDialog}>
            <CloseIcon sx={{ color: "#9CA3AF" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 2.5 }}>
          {playbookDialog.loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={28} sx={{ color: "#60A5FA" }} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {playbookDialog.playbook?.category && (
                <Box>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>CATEGORY</Typography>
                  <Chip
                    label={playbookDialog.playbook.category}
                    size="small"
                    sx={{ bgcolor: "#2563EB", color: "#FFF", fontWeight: 600 }}
                  />
                </Box>
              )}

              {playbookDialog.playbook?.description && (
                <Box>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>DESCRIPTION</Typography>
                  <Typography sx={{ color: "#D1D5DB", lineHeight: 1.6 }}>
                    {playbookDialog.playbook.description}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 1 }}>MITIGATION STEPS</Typography>
                {Array.isArray(playbookDialog.playbook?.steps) && playbookDialog.playbook.steps.length > 0 ? (
                  playbookDialog.playbook.steps.map((step, idx) => (
                    <Box key={idx} display="flex" gap={1.5} mb={1.5} p={1.5} bgcolor="#2B2B2B" borderRadius={1.5}>
                      <Chip label={idx + 1} size="small" sx={{ bgcolor: "#3B82F6", color: "#FFFFFF", fontWeight: 700, minWidth: 24 }} />
                      <Typography sx={{ color: "#FFFFFF", lineHeight: 1.5, alignSelf: "center", fontSize: 14 }}>
                        {typeof step === "string" ? step : step.name ?? step.title ?? JSON.stringify(step)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: "#9CA3AF" }}>
                    Standard response procedure steps.
                  </Typography>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, borderTop: "1px solid #333" }}>
          <Button
            variant="outlined"
            onClick={closePlaybookDialog}
            sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function Info({ title, value, color = "#FFFFFF" }) {
  return (
    <Box mb={2.5}>
      <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 0.3 }}>{title}</Typography>
      <Typography sx={{ color, fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}

function Label({ title }) {
  return (
    <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.8 }}>
      {title}
    </Typography>
  );
}

function TimelineItem(title, time, color) {
  return (
    <Box display="flex" gap={2}>
      <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: color, mt: 0.7 }} />
      <Box>
        <Typography sx={{ color: "#FFFFFF" }} fontWeight={600}>{title}</Typography>
        <Typography sx={{ color: "#9CA3AF" }} fontSize={13}>{time}</Typography>
      </Box>
    </Box>
  );
}

export default IncidentDetailsContent;