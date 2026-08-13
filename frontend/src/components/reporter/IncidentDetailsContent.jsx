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
import CloseIcon from "@mui/icons-material/Close";
import { useLocation } from "react-router-dom";
import { getReporterIncidentDetails } from "../../services/incidentService";
import { getPlaybooks } from "../../services/knowledgeService";

function IncidentDetailsContent() {
  const location = useLocation();
  const incidentId = location.state?.incidentId;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Playbook dialog
  const [playbookDialog, setPlaybookDialog] = useState({ open: false, playbook: null, loading: false });

  useEffect(() => {
    if (!incidentId) {
      setLoading(false);
      return;
    }
    getReporterIncidentDetails(incidentId)
      .then(setData)
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
        <CircularProgress />
      </Box>
    );
  }

  if (!incidentId || !data) {
    return (
      <Typography sx={{ color: "#9CA3AF", py: 4 }}>
        No incident selected. Navigate here from the incidents list.
      </Typography>
    );
  }

  const timeline = data.timeline ?? [];
  const analysis = data.analysis ?? {};
  const playbookTitle = analysis.recommendedPlaybookTitle ?? "No playbook assigned";

  const severityColor = (sev) => {
    const s = (sev || "").toUpperCase();
    if (s === "CRITICAL") return "error";
    if (s === "HIGH") return "warning";
    return "default";
  };

  return (
    <>
      <Grid container spacing={3}>

        {/* LEFT */}
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
            <Info title="Affected system" value={data.affectedSystem ?? "—"} />
            <Info title="Reported by" value={data.reportedByName ?? data.reportedBy ?? "—"} />
            <Info title="Date reported" value={data.incidentDateTime ? new Date(data.incidentDateTime).toLocaleString() : "—"} />
            <Info title="Status" value={data.status ?? "—"} color="#42A5F5" />
            <Info title="Assigned to" value={data.assignedToName ?? data.assignedTo ?? "Not assigned"} />
          </Paper>

          {/* Description */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" mb={2} sx={{ color: "#FFFFFF", fontWeight: 600 }}>
              Description
            </Typography>
            <Typography sx={{ color: "#FFFFFF" }} lineHeight={1.8}>
              {data.description ?? "No description provided."}
            </Typography>
          </Paper>
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 5 }}>

          {/* AI Summary */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: "#FFFFFF" }}>
              AI Analysis Summary
            </Typography>

            <Label title="CATEGORY" />
            <Paper sx={{ bgcolor: "#1E1E1E", p: 1.5, mb: 3 }}>
              <Typography sx={{ color: "#FFFFFF" }}>
                {analysis.attackType ?? analysis.category ?? "Not analyzed yet"}
              </Typography>
            </Paper>

            <Label title="SEVERITY" />
            <Paper sx={{ bgcolor: "#401E1E", p: 1.5, mb: 3 }}>
              <Typography sx={{ color: "#FFFFFF" }}>
                {analysis.severity ?? data.severity ?? "—"}
              </Typography>
            </Paper>

            <Label title="PLAYBOOK" />
            <Box
              display="flex"
              alignItems="center"
              gap={1}
              sx={{
                cursor: playbookTitle !== "No playbook assigned" ? "pointer" : "default",
                borderRadius: 1,
                p: 0.5,
                "&:hover": playbookTitle !== "No playbook assigned"
                  ? { bgcolor: "rgba(66,165,245,0.08)" }
                  : {},
                transition: "background 0.2s",
              }}
              onClick={() => handlePlaybookClick(playbookTitle)}
            >
              <ArticleOutlinedIcon sx={{ color: "#42A5F5" }} />
              <Typography sx={{
                color: "#42A5F5",
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
              Timeline
            </Typography>

            {timeline.length === 0 ? (
              <Typography sx={{ color: "#9CA3AF" }}>No timeline events yet.</Typography>
            ) : (
              timeline.map((event, idx) => (
                <Box key={event.id ?? idx}>
                  {TimelineItem(
                    event.description ?? event.event ?? event.action,
                    event.createdAt ? new Date(event.createdAt).toLocaleString() : "",
                    idx === 0 ? "#22C55E" : "#3B82F6"
                  )}
                  {idx < timeline.length - 1 && <Divider sx={{ my: 2 }} />}
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
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#2B2B2B", color: "#FFFFFF", p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
            {playbookDialog.playbook?.name ?? playbookDialog.playbook?.title ?? "Playbook Details"}
          </Typography>
          <IconButton onClick={closePlaybookDialog}>
            <CloseIcon sx={{ color: "#9CA3AF" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers sx={{ borderColor: "#444" }}>
          {playbookDialog.loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {playbookDialog.playbook?.category && (
                <Box>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>CATEGORY</Typography>
                  <Chip
                    label={playbookDialog.playbook.category}
                    size="small"
                    sx={{ bgcolor: "#2563EB", color: "#FFF" }}
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
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 1 }}>CONTAINMENT STEPS</Typography>
                {Array.isArray(playbookDialog.playbook?.steps) && playbookDialog.playbook.steps.length > 0 ? (
                  playbookDialog.playbook.steps.map((step, idx) => (
                    <Box key={idx} display="flex" gap={1.5} mb={1}>
                      <Typography sx={{ color: "#42A5F5", fontWeight: 700, minWidth: 20 }}>{idx + 1}.</Typography>
                      <Typography sx={{ color: "#FFFFFF", lineHeight: 1.5 }}>
                        {typeof step === "string" ? step : step.name ?? step.title ?? JSON.stringify(step)}
                      </Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: "#9CA3AF" }}>
                    {playbookDialog.playbook?.name ?? playbookDialog.playbook?.title
                      ? "Playbook found but no steps defined."
                      : "Playbook details not available."}
                  </Typography>
                )}
              </Box>

              {playbookDialog.playbook?.updatedAt && (
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>
                  Last updated: {new Date(playbookDialog.playbook.updatedAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
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
    <Box mb={3}>
      <Typography sx={{ color: "#808080", fontSize: 13, mb: 0.5 }}>{title}</Typography>
      <Typography sx={{ color, fontWeight: 600 }}>{value}</Typography>
    </Box>
  );
}

function Label({ title }) {
  return (
    <Typography sx={{ color: "#808080", fontSize: 12, fontWeight: 700, mb: 1 }}>
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
        <Typography sx={{ color: "#808080" }} fontSize={13}>{time}</Typography>
      </Box>
    </Box>
  );
}

export default IncidentDetailsContent;