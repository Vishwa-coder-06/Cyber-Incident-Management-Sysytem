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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CloseIcon from "@mui/icons-material/Close";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import ShieldIcon from "@mui/icons-material/Shield";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getReporterIncidentDetails } from "../../services/incidentService";
import { getPlaybooks } from "../../services/knowledgeService";

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

function AnalystIncidentDetailsContent() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const incidentId = params.incidentId || location.state?.incidentId;

  const [data, setData] = useState(null);
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
      <Box display="flex" justifyContent="center" alignItems="center" py={10} gap={2}>
        <CircularProgress size={32} sx={{ color: "#2563EB" }} />
        <Typography sx={{ color: "#9CA3AF" }}>Loading incident details...</Typography>
      </Box>
    );
  }

  if (!incidentId || !data) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", py: 6, textAlign: "center" }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 2 }}>
            Incident Not Found
          </Typography>
          <Typography sx={{ color: "#9CA3AF", mb: 3 }}>
            No incident details available for #{incidentId || "N/A"}.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => navigate("/analyst/incidents")}
            sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
          >
            ← Back to Assigned Incidents
          </Button>
        </Paper>
      </Box>
    );
  }

  const timeline = data.timeline ?? [];
  const analysis = data.analysis ?? {};
  const playbookTitle = analysis.recommendedPlaybookTitle ?? "No playbook assigned";

  return (
    <>
      {/* Top Action Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/analyst/incidents")}
          sx={{ color: "#9CA3AF", textTransform: "none", "&:hover": { color: "#FFFFFF" } }}
        >
          Back to Assigned Incidents
        </Button>

        <Button
          variant="contained"
          startIcon={<SearchIcon />}
          onClick={() => navigate(`/analyst/investigation/${incidentId}`, { state: { incidentId, incidentTitle: data.title } })}
          sx={{
            bgcolor: "#16A34A",
            color: "#FFFFFF",
            fontWeight: 700,
            px: 3,
            py: 1,
            borderRadius: 1.5,
            textTransform: "none",
            fontSize: 15,
            "&:hover": { bgcolor: "#15803D" },
          }}
        >
          Open Investigation Workspace
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT COLUMN: Original Incident Information & Timeline */}
        <Grid size={{ xs: 12, md: 7 }}>
          {/* Incident Overview Card */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography sx={{ color: "#9CA3AF", fontSize: 13, fontWeight: 600 }}>
                  INCIDENT #{data.incidentId}
                </Typography>
                <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: 700, mt: 0.5 }}>
                  {data.title}
                </Typography>
              </Box>
              <Box display="flex" gap={1}>
                <Chip
                  label={data.severity}
                  size="small"
                  sx={{ bgcolor: severityColor(data.severity), color: "#FFFFFF", fontWeight: 700 }}
                />
                <Chip
                  label={data.status}
                  size="small"
                  sx={{ bgcolor: statusColor(data.status), color: "#FFFFFF", fontWeight: 600 }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 2, bgcolor: "#444" }} />

            {/* Reporter Full Description */}
            <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 1, fontWeight: 600 }}>
              REPORTER DESCRIPTION
            </Typography>
            <Typography sx={{ color: "#E5E7EB", fontSize: 15, lineHeight: 1.7, mb: 3, whiteSpace: "pre-wrap" }}>
              {data.description || "No description provided."}
            </Typography>

            {/* Metadata Grid */}
            <Grid container spacing={2}>
              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>AFFECTED SYSTEM</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 14, mt: 0.5 }}>
                  {data.affectedSystem || "Not specified"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>REPORTED BY</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 14, mt: 0.5 }}>
                  {data.reportedByName || "Reporter"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>ASSIGNED ANALYST</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 14, mt: 0.5 }}>
                  {data.assignedToName || "Assigned"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>INCIDENT OCCURRED</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: 500, fontSize: 13, mt: 0.5 }}>
                  {data.incidentDateTime ? new Date(data.incidentDateTime).toLocaleString() : "—"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>CREATED TIMESTAMP</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: 500, fontSize: 13, mt: 0.5 }}>
                  {data.createdAt ? new Date(data.createdAt).toLocaleString() : "—"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 6, sm: 4 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>LAST UPDATED</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: 500, fontSize: 13, mt: 0.5 }}>
                  {data.updatedAt ? new Date(data.updatedAt).toLocaleString() : "—"}
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          {/* Timeline Card */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 2 }}>
              Activity Timeline
            </Typography>

            {timeline.length === 0 ? (
              <Typography sx={{ color: "#9CA3AF" }}>No timeline events recorded.</Typography>
            ) : (
              <Box sx={{ position: "relative", pl: 2, borderLeft: "2px solid #444" }}>
                {timeline.map((item, index) => (
                  <Box key={item.timelineId || index} sx={{ mb: 2.5, position: "relative" }}>
                    <Box
                      sx={{
                        position: "absolute",
                        left: -23,
                        top: 4,
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: index === 0 ? "#16A34A" : "#2563EB",
                        border: "2px solid #2B2B2B",
                      }}
                    />
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 14 }}>
                      {item.event}
                    </Typography>
                    <Typography sx={{ color: "#9CA3AF", fontSize: 13, mt: 0.5 }}>
                      {item.description}
                    </Typography>
                    <Typography sx={{ color: "#6B7280", fontSize: 11, mt: 0.5 }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : ""}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* RIGHT COLUMN: AI Analysis & Intelligence */}
        <Grid size={{ xs: 12, md: 5 }}>
          {/* AI Intelligence Card */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              p: 3,
              borderRadius: 2,
              mb: 3,
              border: "1px solid #3B82F6",
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <SmartToyIcon sx={{ color: "#60A5FA" }} />
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                AI Incident Analysis
              </Typography>
            </Box>

            {/* Attack Type & AI Severity */}
            <Box sx={{ bgcolor: "#1E1E1E", p: 2, borderRadius: 1.5, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>ML ATTACK TYPE</Typography>
                  <Typography sx={{ color: "#60A5FA", fontWeight: 700, fontSize: 16, mt: 0.5 }}>
                    {analysis.attackType || "Analyzing..."}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>ML CONFIDENCE</Typography>
                  <Typography sx={{ color: "#4ADE80", fontWeight: 700, fontSize: 16, mt: 0.5 }}>
                    {analysis.confidence != null ? `${(analysis.confidence * 100).toFixed(1)}%` : "—"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>RULE AI SEVERITY</Typography>
                  <Typography sx={{ color: severityColor(analysis.aiSeverity || analysis.severity), fontWeight: 700, fontSize: 15, mt: 0.5 }}>
                    {analysis.aiSeverity || analysis.severity || "MEDIUM"}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>AI PIPELINE</Typography>
                  <Chip label="ACTIVE" size="small" sx={{ bgcolor: "#16A34A", color: "#FFFFFF", fontWeight: 700, height: 22, mt: 0.5 }} />
                </Grid>
              </Grid>
            </Box>

            {/* Root Cause */}
            {analysis.rootCause && (
              <Box mb={2}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, mb: 0.5 }}>
                  PROBABLE ROOT CAUSE
                </Typography>
                <Typography sx={{ color: "#E5E7EB", fontSize: 14, lineHeight: 1.6 }}>
                  {analysis.rootCause}
                </Typography>
              </Box>
            )}

            {/* Immediate Advice */}
            {analysis.immediateAdvice && (
              <Box mb={2}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, mb: 0.5 }}>
                  IMMEDIATE ADVICE
                </Typography>
                <Typography sx={{ color: "#E5E7EB", fontSize: 14, lineHeight: 1.6 }}>
                  {analysis.immediateAdvice}
                </Typography>
              </Box>
            )}

            {/* Recommended Playbook */}
            {playbookTitle && playbookTitle !== "No playbook assigned" && (
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #444" }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, mb: 1 }}>
                  RECOMMENDED PLAYBOOK
                </Typography>
                <Box
                  onClick={() => handlePlaybookClick(playbookTitle)}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    p: 1.5,
                    bgcolor: "#1E1E1E",
                    borderRadius: 1.5,
                    cursor: "pointer",
                    border: "1px solid #444",
                    "&:hover": { borderColor: "#60A5FA", bgcolor: "#252525" },
                    transition: "all 0.2s",
                  }}
                >
                  <ArticleOutlinedIcon sx={{ color: "#60A5FA" }} />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 14 }}>
                      {playbookTitle}
                    </Typography>
                    <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>
                      Click to view recommended mitigation steps
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Similar Historical Incidents */}
            {(() => {
              const validSimilar = Array.isArray(analysis?.similarIncidents)
                ? analysis.similarIncidents.filter((s) => s && (s.category || s.description || s.title))
                : [];
              if (validSimilar.length === 0) return null;
              return (
                <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #444" }}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 600, mb: 1 }}>
                    SIMILAR HISTORICAL INCIDENTS
                  </Typography>
                  {validSimilar.map((sim, i) => (
                    <Box key={i} sx={{ p: 1.5, bgcolor: "#1E1E1E", borderRadius: 1.5, mb: 1 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography sx={{ color: "#60A5FA", fontWeight: 600, fontSize: 13 }}>
                          {sim.category || sim.title || "Historical Incident"}
                        </Typography>
                        {sim.similarity != null && (
                          <Chip
                            label={`${(sim.similarity > 1 ? sim.similarity : sim.similarity * 100).toFixed(1)}% Match`}
                            size="small"
                            sx={{ bgcolor: "#1E3A8A", color: "#93C5FD", fontSize: 11, height: 20 }}
                          />
                        )}
                      </Box>
                      {sim.description && (
                        <Typography sx={{ color: "#9CA3AF", fontSize: 12, mt: 0.5 }}>
                          {sim.description}
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              );
            })()}

          </Paper>
        </Grid>
      </Grid>

      {/* Playbook Preview Modal */}
      <Dialog
        open={playbookDialog.open}
        onClose={closePlaybookDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#1E1E1E", color: "#FFFFFF", borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333" }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <ArticleOutlinedIcon sx={{ color: "#60A5FA" }} />
            <Typography variant="h6" fontWeight={700}>
              {playbookDialog.playbook?.name ?? playbookDialog.playbook?.title ?? "Playbook"}
            </Typography>
          </Box>
          <IconButton onClick={closePlaybookDialog} sx={{ color: "#9CA3AF" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          {playbookDialog.loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={28} sx={{ color: "#60A5FA" }} />
            </Box>
          ) : (
            <Box>
              <Typography sx={{ color: "#9CA3AF", mb: 2, fontSize: 14 }}>
                {playbookDialog.playbook?.description || "Standard operating procedure for responding to this attack vector."}
              </Typography>
              {Array.isArray(playbookDialog.playbook?.steps) && playbookDialog.playbook.steps.length > 0 ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1.5 }}>
                    Procedure Steps:
                  </Typography>
                  {playbookDialog.playbook.steps.map((step, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 1.5, mb: 1.5, p: 1.5, bgcolor: "#2B2B2B", borderRadius: 1.5 }}>
                      <Chip label={idx + 1} size="small" sx={{ bgcolor: "#3B82F6", color: "#FFFFFF", fontWeight: 700, minWidth: 28 }} />
                      <Typography sx={{ color: "#E5E7EB", fontSize: 14, alignSelf: "center" }}>
                        {typeof step === "string" ? step : (step.name || step.description || step.title)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : null}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #333", px: 3, py: 2 }}>
          <Button onClick={closePlaybookDialog} sx={{ color: "#9CA3AF", textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default AnalystIncidentDetailsContent;
