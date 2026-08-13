import { useState, useEffect } from "react";
import {
  Box, Paper, Typography, Button, Chip, CircularProgress, Divider,
} from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { getMyIncidents } from "../../services/incidentService";
import { analyzeIncident } from "../../services/aiService";

function AIAnalysisContent() {
  const [incidents, setIncidents] = useState([]);
  const [loadingList, setLoadingList] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState("");

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
      setError(err.response?.status === 401
        ? "Session expired. Please log in again."
        : "AI analysis failed. Please try again.");
    } finally {
      setLoadingAnalysis(false);
    }
  };

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
        <Box display="flex" alignItems="center" gap={2} mb={0.5}>
          <AutoAwesomeIcon sx={{ color: "#A78BFA", fontSize: 32 }} />
          <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
            AI Analysis
          </Typography>
        </Box>
        <Typography sx={{ color: "#9CA3AF", mt: 0.5, mb: 4 }}>
          Select an incident to run AI-powered threat analysis.
        </Typography>

        {loadingList ? (
          <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>
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

  return (
    <Box sx={{ maxWidth: 950, mx: "auto", py: 5 }}>
      <Box display="flex" alignItems="center" gap={2} mb={0.5}>
        <AutoAwesomeIcon sx={{ color: "#A78BFA", fontSize: 32 }} />
        <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
          AI Analysis Result
        </Typography>
      </Box>
      <Typography sx={{ color: "#9CA3AF", mt: 0.5, mb: 3 }}>
        #INC-{id} — {selectedIncident.title}
      </Typography>

      {loadingAnalysis ? (
        <Box display="flex" alignItems="center" justifyContent="center" py={6} gap={2}>
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
                  <Box key={i} display="flex" gap={1} mb={0.8}>
                    <Typography sx={{ color: "#A78BFA", minWidth: 20, fontWeight: 700 }}>{i + 1}.</Typography>
                    <Typography sx={{ color: "#D1D5DB", lineHeight: 1.5 }}>{step.endsWith(".") ? step : `${step}.`}</Typography>
                  </Box>
                ))}
            </Paper>

            <Paper elevation={0} sx={{ bgcolor: "#292929", border: "1px solid #444", borderRadius: 2, p: 2.5 }}>
              <Typography sx={{ color: "#777", fontSize: 12, fontWeight: 700, mb: 1.5 }}>RECOMMENDED PLAYBOOK</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ArticleOutlinedIcon sx={{ color: "#2196F3", fontSize: 22 }} />
                <Typography sx={{ color: "#2196F3", fontWeight: 600 }}>
                  {analysis.recommendedPlaybookTitle ?? "No playbook assigned"}
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
                  <Box display="flex" justifyContent="space-between" alignItems="center">
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
  );
}

export default AIAnalysisContent;