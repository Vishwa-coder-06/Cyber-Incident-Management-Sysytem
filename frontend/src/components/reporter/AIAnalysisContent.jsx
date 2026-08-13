import { useState, useEffect } from "react";
import {
  Box, Paper, Typography, Button, Chip, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import { getMyIncidents } from "../../services/incidentService";
import { analyzeIncident } from "../../services/aiService";
import { getPlaybooks } from "../../services/knowledgeService";

function AIAnalysisContent() {
  const [incidents, setIncidents] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState("");

  // Playbook Dialog State
  const [playbookDialog, setPlaybookDialog] = useState({ open: false, playbook: null, loading: false });

  useEffect(() => {
    getMyIncidents()
      .then((data) => setIncidents(Array.isArray(data) ? data : []))
      .catch(() => setIncidents([]))
      .finally(() => setLoadingList(false));
  }, []);

  const handleViewAnalysis = async (incident) => {
    setSelectedIncident(incident);
    setAnalysis(null);
    setError("");
    setLoadingAnalysis(true);
    try {
      const result = await analyzeIncident({
        incidentDescription: incident.description ?? incident.title ?? "",
        title: incident.title ?? "",
        category: incident.category ?? incident.incidentType ?? "",
        severity: incident.severity ?? "",
      });
      setAnalysis(result);
    } catch (err) {
      console.error("[AI] REQUEST FAILED");
      console.error("[AI] status:", err.response?.status);
      console.error("[AI] data:", err.response?.data);
      console.error("[AI] message:", err.message);
      if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else if (err.response?.status === 500) {
        const msg = err.response?.data?.message || err.response?.data || "";
        setError(`AI service error: ${msg || "Internal server error. Check that the Python ML service is running on port 5000."}`);
      } else if (!err.response) {
        setError("Cannot reach the AI service. Ensure the backend (port 8080) and Python service (port 5000) are running.");
      } else {
        setError(`AI analysis failed (HTTP ${err.response?.status}). Please try again.`);
      }
    } finally {
      setLoadingAnalysis(false);
    }
  };

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

  const severityColor = (sev) => {
    const s = (sev || "").toUpperCase();
    if (s === "CRITICAL") return "#FF5252";
    if (s === "HIGH") return "#FF9800";
    if (s === "MEDIUM") return "#FFC107";
    return "#22C55E";
  };

  const severityBorder = (sev) => {
    const s = (sev || "").toUpperCase();
    if (s === "CRITICAL") return "#B71C1C";
    if (s === "HIGH") return "#E65100";
    if (s === "MEDIUM") return "#F9A825";
    return "#1B5E20";
  };

  // ─── Incident List ────────────────────────────────────────────────────────
  if (!selectedIncident) {
    return (
      <Box sx={{ maxWidth: 950, mx: "auto", py: 5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
          <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
            AI Analysis
          </Typography>
        </Box>
        <Typography sx={{ color: "#9CA3AF", mt: 0.5, mb: 4 }}>
          Select an incident to run AI-powered threat analysis.
        </Typography>

        {loadingList ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}><CircularProgress /></Box>
        ) : incidents.length === 0 ? (
          <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>
            No incidents found.
          </Typography>
        ) : (
          incidents.map((incident) => {
            const id = incident.incidentId ?? incident.id;
            return (
              <Paper
                key={id}
                elevation={0}
                sx={{
                  bgcolor: "#292929",
                  border: "1px solid #444",
                  borderRadius: 2,
                  p: 2.5,
                  mb: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  "&:hover": { borderColor: "#A78BFA" },
                  transition: "border-color 0.2s",
                }}
              >
                <Box>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>#INC-{id}</Typography>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: 600, mt: 0.5 }}>
                    {incident.title}
                  </Typography>
                  {incident.status && (
                    <Typography sx={{ color: "#9CA3AF", fontSize: 13, mt: 0.3 }}>
                      Status: {incident.status}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Chip
                    label={incident.severity ?? "—"}
                    size="small"
                    sx={{
                      color: severityColor(incident.severity),
                      border: "1px solid",
                      borderColor: severityBorder(incident.severity),
                      bgcolor: "transparent",
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => handleViewAnalysis(incident)}
                    startIcon={<AutoAwesomeIcon sx={{ fontSize: 16 }} />}
                    sx={{
                      color: "#FFFFFF",
                      borderColor: "#666",
                      textTransform: "none",
                      "&:hover": { borderColor: "#A78BFA", bgcolor: "#A78BFA15" },
                    }}
                  >
                    Analyze
                  </Button>
                </Box>
              </Paper>
            );
          })
        )}
      </Box>
    );
  }

  // ─── Analysis Result ──────────────────────────────────────────────────────
  const id = selectedIncident.incidentId ?? selectedIncident.id;
  const playbookTitle = analysis?.recommendedPlaybookTitle ?? "No playbook assigned";

  return (
    <>
      <Box sx={{ maxWidth: 950, mx: "auto", py: 5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 0.5 }}>
          <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
            AI Analysis Result
          </Typography>
        </Box>
        <Typography sx={{ color: "#9CA3AF", mt: 0.5, mb: 3 }}>
          #INC-{id} — {selectedIncident.title}
        </Typography>

        {loadingAnalysis ? (
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", py: 6, gap: 2 }}>
            <CircularProgress size={28} sx={{ color: "#A78BFA" }} />
            <Typography sx={{ color: "#9CA3AF" }}>Analyzing incident with SecureOps AI...</Typography>
          </Box>
        ) : error ? (
          <Paper elevation={0} sx={{ bgcolor: "#2B0000", border: "1px solid #7F2929", borderRadius: 2, p: 3 }}>
            <Typography sx={{ color: "#EF4444" }}>{error}</Typography>
            <Button variant="outlined" sx={{ mt: 2, color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
              onClick={() => { setSelectedIncident(null); setError(""); }}>
              Back to incidents
            </Button>
          </Paper>
        ) : !analysis ? (
          <Typography sx={{ color: "#EF4444", py: 4 }}>
            Analysis not available for this incident.
          </Typography>
        ) : (
          <>
            {/* AI Badge */}
            <Box sx={{
              display: "inline-flex", alignItems: "center", gap: 1,
              bgcolor: "#1E1040", color: "#C4A7FF",
              border: "1px solid #6545A3", px: 3, py: 1.2, borderRadius: 1, mb: 3,
            }}>
              <AutoAwesomeIcon sx={{ fontSize: 18 }} />
              Analyzed by SecureOps AI
            </Box>

            {/* Category + Severity + Confidence */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr 1fr" }, gap: 2.5, mb: 2.5 }}>
              <Paper elevation={0} sx={{ bgcolor: "#292929", border: "1px solid #444", borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ color: "#777", fontSize: 12, fontWeight: 700, mb: 1.5 }}>ATTACK TYPE</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: 700, fontSize: 18 }}>
                  {analysis.attackType ?? "—"}
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ bgcolor: "#351D1D", border: "1px solid #7F2929", borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ color: "#777", fontSize: 12, fontWeight: 700, mb: 1.5 }}>SEVERITY</Typography>
                <Typography sx={{ color: severityColor(analysis.severity), fontWeight: 700, fontSize: 18 }}>
                  {analysis.severity ?? selectedIncident.severity ?? "—"}
                </Typography>
              </Paper>

              <Paper elevation={0} sx={{ bgcolor: "#1A2E26", border: "1px solid #2E7D32", borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ color: "#777", fontSize: 12, fontWeight: 700, mb: 1.5 }}>CONFIDENCE SCORE</Typography>
                <Typography sx={{ color: "#4ADE80", fontWeight: 700, fontSize: 18 }}>
                  {analysis.confidence != null
                    ? `${(analysis.confidence > 1 ? analysis.confidence : analysis.confidence * 100).toFixed(1)}%`
                    : "N/A"}
                </Typography>
              </Paper>
            </Box>

            {/* Root Cause */}
            <Paper elevation={0} sx={{ bgcolor: "#292929", border: "1px solid #444", borderRadius: 2, p: 2.5, mb: 2.5 }}>
              <Typography sx={{ color: "#777", fontSize: 12, fontWeight: 700, mb: 1.5 }}>PROBABLE ROOT CAUSE</Typography>
              <Typography sx={{ color: "#FFFFFF", lineHeight: 1.7 }}>
                {analysis.rootCause ?? "No root cause identified."}
              </Typography>
            </Paper>

            {/* Immediate Advice + Playbook */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5, mb: 2.5 }}>
              <Paper elevation={0} sx={{ bgcolor: "#292929", border: "1px solid #444", borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ color: "#777", fontSize: 12, fontWeight: 700, mb: 1.5 }}>IMMEDIATE ADVICE</Typography>
                {(analysis.immediateAdvice ?? analysis.recommendation ?? "").split(". ")
                  .filter(Boolean)
                  .map((step, i) => (
                    <Box key={i} sx={{ display: "flex", gap: 1, mb: 0.8 }}>
                      <Typography sx={{ color: "#A78BFA", minWidth: 20, fontWeight: 700 }}>{i + 1}.</Typography>
                      <Typography sx={{ color: "#D1D5DB", lineHeight: 1.5 }}>{step.endsWith(".") ? step : `${step}.`}</Typography>
                    </Box>
                  ))}
              </Paper>

              <Paper elevation={0} sx={{ bgcolor: "#292929", border: "1px solid #444", borderRadius: 2, p: 2.5 }}>
                <Typography sx={{ color: "#777", fontSize: 12, fontWeight: 700, mb: 1.5 }}>RECOMMENDED PLAYBOOK</Typography>
                <Box
                  sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    cursor: playbookTitle && playbookTitle !== "No playbook assigned" ? "pointer" : "default",
                    borderRadius: 1, p: 0.5,
                    "&:hover": playbookTitle && playbookTitle !== "No playbook assigned"
                      ? { bgcolor: "rgba(33,150,243,0.12)" }
                      : {},
                    transition: "background 0.2s",
                  }}
                  onClick={() => handlePlaybookClick(playbookTitle)}
                >
                  <ArticleOutlinedIcon sx={{ color: "#2196F3", fontSize: 22 }} />
                  <Typography
                    sx={{
                      color: "#2196F3",
                      fontWeight: 600,
                      textDecoration: playbookTitle && playbookTitle !== "No playbook assigned" ? "underline" : "none",
                      textDecorationColor: "rgba(33,150,243,0.4)",
                    }}
                  >
                    {playbookTitle}
                  </Typography>
                </Box>
              </Paper>
            </Box>

            {/* Top Similar Historical Incidents */}
            {Array.isArray(analysis.similarIncidents) && analysis.similarIncidents.length > 0 && (
              <Paper elevation={0} sx={{ bgcolor: "#292929", border: "1px solid #444", borderRadius: 2, p: 2.5, mb: 3 }}>
                <Typography sx={{ color: "#777", fontSize: 12, fontWeight: 700, mb: 1.5 }}>SIMILAR HISTORICAL INCIDENTS</Typography>
                {analysis.similarIncidents.map((sim, idx) => (
                  <Box key={idx} sx={{ mb: idx < analysis.similarIncidents.length - 1 ? 1.5 : 0, pb: idx < analysis.similarIncidents.length - 1 ? 1.5 : 0, borderBottom: idx < analysis.similarIncidents.length - 1 ? "1px solid #333" : "none" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography sx={{ color: "#A78BFA", fontWeight: 600, fontSize: 14 }}>
                        {sim.category}
                      </Typography>
                      <Chip
                        label={sim.similarity != null ? `${(sim.similarity > 1 ? sim.similarity : sim.similarity * 100).toFixed(1)}% Match` : "Match"}
                        size="small"
                        sx={{ bgcolor: "#1E1040", color: "#C4A7FF", border: "1px solid #6545A3", fontSize: 11 }}
                      />
                    </Box>
                    <Typography sx={{ color: "#D1D5DB", fontSize: 13, mt: 0.5 }}>
                      {sim.description}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            )}

            {/* Actions */}
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
              <Button
                variant="outlined"
                onClick={() => { setSelectedIncident(null); setAnalysis(null); }}
                sx={{ color: "#FFFFFF", borderColor: "#666", py: 1.3, textTransform: "none", fontWeight: 600,
                  "&:hover": { borderColor: "#FFFFFF" } }}
              >
                ← Back to incidents
              </Button>
              <Button
                variant="outlined"
                onClick={() => handleViewAnalysis(selectedIncident)}
                sx={{ color: "#A78BFA", borderColor: "#6545A3", py: 1.3, textTransform: "none", fontWeight: 600,
                  "&:hover": { borderColor: "#A78BFA" } }}
                startIcon={<AutoAwesomeIcon />}
              >
                Re-analyze
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Playbook Details Dialog */}
      <Dialog
        open={playbookDialog.open}
        onClose={closePlaybookDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1F1F1F",
            color: "#FFFFFF",
            backgroundImage: "none",
          }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            bgcolor: "#1F1F1F",
            borderBottom: "1px solid #333",
            px: 3, py: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
            {playbookDialog.playbook?.name ?? playbookDialog.playbook?.title ?? "Playbook Details"}
          </Typography>
          <IconButton onClick={closePlaybookDialog}>
            <CloseIcon sx={{ color: "#9CA3AF" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "#1F1F1F", px: 3, py: 2.5 }}>
          {playbookDialog.loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
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
                    <Box key={idx} sx={{ display: "flex", gap: 1.5, mb: 1 }}>
                      <Typography sx={{ color: "#42A5F5", fontWeight: 700, minWidth: 20 }}>{idx + 1}.</Typography>
                      <Typography sx={{ color: "#FFFFFF", lineHeight: 1.5 }}>
                        {typeof step === "string" ? step : step.name ?? step.title ?? JSON.stringify(step)}
                      </Typography>
                    </Box>
                  ))
                ) : typeof playbookDialog.playbook?.steps === "string" && playbookDialog.playbook.steps.trim() ? (
                  playbookDialog.playbook.steps.split("\n").filter(Boolean).map((step, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 1.5, mb: 1 }}>
                      <Typography sx={{ color: "#42A5F5", fontWeight: 700, minWidth: 20 }}>{idx + 1}.</Typography>
                      <Typography sx={{ color: "#FFFFFF", lineHeight: 1.5 }}>{step}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: "#9CA3AF" }}>
                    {playbookDialog.playbook?.name ?? playbookDialog.playbook?.title
                      ? "No containment steps defined."
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

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#1F1F1F", borderTop: "1px solid #333" }}>
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

export default AIAnalysisContent;