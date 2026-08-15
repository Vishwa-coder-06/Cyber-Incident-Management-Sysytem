import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Chip,
  Divider,
  CircularProgress,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  getInvestigation,
  resolveIncident,
  getIncidentResolution,
  convertToKB,
  addToTrainingData
} from "../../services/incidentService";

const ATTACK_TYPES = [
  "Phishing",
  "Ransomware",
  "DDoS",
  "Insider Threat",
  "Lateral Movement",
  "Malware",
  "Unauthorized Access",
  "Other"
];

const SEVERITY_OPTIONS = [
  "CRITICAL",
  "HIGH",
  "MEDIUM",
  "LOW"
];

function severityColor(sev) {
  const s = (sev || "").toUpperCase();
  if (s === "CRITICAL") return "#EF4444";
  if (s === "HIGH") return "#F97316";
  if (s === "MEDIUM") return "#F59E0B";
  return "#22C55E";
}

function ResolutionContent() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const incidentId = params.incidentId || location.state?.incidentId;
  const incidentTitle = location.state?.incidentTitle;

  const [investigationData, setInvestigationData] = useState(null);
  const [existingResolution, setExistingResolution] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [convertingKb, setConvertingKb] = useState(false);
  const [stagingTraining, setStagingTraining] = useState(false);
  const [trainingStaged, setTrainingStaged] = useState(false);

  // Form State
  const [summary, setSummary] = useState("");
  const [steps, setSteps] = useState([""]);
  const [rootCause, setRootCause] = useState("");
  const [selectedAttackType, setSelectedAttackType] = useState("Phishing");
  const [customAttackType, setCustomAttackType] = useState("");
  const [finalSeverity, setFinalSeverity] = useState("HIGH");
  const [lessonsLearned, setLessonsLearned] = useState("");

  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!incidentId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      getInvestigation(incidentId).catch(() => null),
      getIncidentResolution(incidentId).catch(() => null)
    ]).then(([inv, res]) => {
      setInvestigationData(inv);
      if (res) {
        setExistingResolution(res);
        setSummary(res.resolutionSummary || "");
        setSteps(res.resolutionSteps && res.resolutionSteps.length > 0 ? res.resolutionSteps : [""]);
        setRootCause(res.rootCause || "");
        
        const attackType = res.finalAttackType || "Phishing";
        if (ATTACK_TYPES.filter(t => t !== "Other").includes(attackType)) {
          setSelectedAttackType(attackType);
          setCustomAttackType("");
        } else {
          setSelectedAttackType("Other");
          setCustomAttackType(attackType);
        }

        setFinalSeverity(res.finalSeverity || "HIGH");
        setLessonsLearned(res.lessonsLearned || "");
      } else {
        // Pre-fill initial defaults from investigation analysis if available
        const aiType = inv?.analysis?.attackType || inv?.incident?.category;
        if (aiType) {
          if (ATTACK_TYPES.filter(t => t !== "Other").includes(aiType)) {
            setSelectedAttackType(aiType);
            setCustomAttackType("");
          } else {
            setSelectedAttackType("Other");
            setCustomAttackType(aiType);
          }
        }
        const initialSev = inv?.analysis?.aiSeverity || inv?.incident?.severity;
        if (initialSev && SEVERITY_OPTIONS.includes(initialSev.toUpperCase())) {
          setFinalSeverity(initialSev.toUpperCase());
        }
        if (inv?.analysis?.rootCause) {
          setRootCause(inv.analysis.rootCause);
        }
      }
    }).finally(() => setLoading(false));
  }, [incidentId]);

  const handleAddStep = () => {
    setSteps((prev) => [...prev, ""]);
  };

  const handleStepChange = (index, value) => {
    setSteps((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const handleRemoveStep = (index) => {
    setSteps((prev) => {
      if (prev.length <= 1) return [""];
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmitResolution = async () => {
    if (!summary.trim()) {
      setSnack({ open: true, message: "Please provide a resolution summary.", severity: "warning" });
      return;
    }

    const filteredSteps = steps.map((s) => s.trim()).filter(Boolean);
    if (filteredSteps.length === 0) {
      setSnack({ open: true, message: "Please add at least one resolution step.", severity: "warning" });
      return;
    }

    let finalType = selectedAttackType;
    if (selectedAttackType === "Other") {
      if (!customAttackType.trim()) {
        setSnack({ open: true, message: "Please enter a custom attack type for 'Other'.", severity: "warning" });
        return;
      }
      finalType = customAttackType.trim();
    }

    setSubmitting(true);
    try {
      const payload = {
        resolutionSummary: summary.trim(),
        resolutionSteps: filteredSteps,
        rootCause: rootCause.trim(),
        finalAttackType: finalType,
        finalSeverity,
        lessonsLearned: lessonsLearned.trim()
      };

      const result = await resolveIncident(incidentId, payload);
      setExistingResolution(result);
      setSnack({
        open: true,
        message: "Incident resolved and closed successfully! Ground-truth labels persisted.",
        severity: "success"
      });
      // Refresh investigation data
      const updatedInv = await getInvestigation(incidentId).catch(() => null);
      if (updatedInv) setInvestigationData(updatedInv);
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to submit resolution.";
      setSnack({ open: true, message: errMsg, severity: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleConvertToKB = async () => {
    if (!incidentId) return;
    setConvertingKb(true);
    try {
      const res = await convertToKB(incidentId);
      setExistingResolution((prev) => prev ? { ...prev, kbArticleId: res.kbArticleId } : prev);
      setSnack({
        open: true,
        message: `Converted to Knowledge Base Article (ID: ${res.kbArticleId})!`,
        severity: "success"
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to convert to KB article.";
      setSnack({ open: true, message: errMsg, severity: "error" });
    } finally {
      setConvertingKb(false);
    }
  };

  const handleStageTraining = async () => {
    if (!incidentId || trainingStaged || stagingTraining) return;
    setStagingTraining(true);
    try {
      await addToTrainingData(incidentId);
      setTrainingStaged(true);
      setSnack({
        open: true,
        message: "AI training data request submitted. An administrator must approve it before retraining.",
        severity: "success"
      });
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to stage AI training data.";
      setSnack({ open: true, message: errMsg, severity: "error" });
    } finally {
      setStagingTraining(false);
    }
  };

  const isResolved = Boolean(
    existingResolution ||
    investigationData?.incident?.status === "RESOLVED" ||
    investigationData?.incident?.status === "CLOSED"
  );

  // Styling ensuring strong visibility in normal, focused, and disabled/read-only states
  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#1E1E1E",
      color: "#FFFFFF",
      borderRadius: 1.5,
      "& fieldset": { borderColor: "#444" },
      "&:hover fieldset": { borderColor: "#1565C0" },
      "&.Mui-focused fieldset": { borderColor: "#1565C0" },
      "&.Mui-disabled": {
        bgcolor: "#1E1E1E",
        "& fieldset": { borderColor: "#333" },
      },
    },
    "& .MuiInputBase-input": {
      color: "#FFFFFF",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      color: "#FFFFFF !important",
      WebkitTextFillColor: "#FFFFFF !important",
    },
    "& .MuiInputBase-inputMultiline.Mui-disabled": {
      color: "#FFFFFF !important",
      WebkitTextFillColor: "#FFFFFF !important",
    },
    "& .MuiSelect-select.Mui-disabled": {
      color: "#FFFFFF !important",
      WebkitTextFillColor: "#FFFFFF !important",
    },
    "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
    "& textarea::placeholder": { color: "#9CA3AF", opacity: 1 },
    "& .MuiSvgIcon-root": { color: "#FFFFFF" },
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10} gap={2}>
        <CircularProgress size={32} sx={{ color: "#1565C0" }} />
        <Typography sx={{ color: "#9CA3AF" }}>Loading incident resolution data...</Typography>
      </Box>
    );
  }

  if (!incidentId) {
    return (
      <Box sx={{ maxWidth: 800, mx: "auto", py: 6, textAlign: "center" }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 2 }}>
            No Incident Selected
          </Typography>
          <Typography sx={{ color: "#9CA3AF", mb: 3 }}>
            Please select an assigned incident from the incidents list or investigation workspace.
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

  const title = incidentTitle || investigationData?.incident?.title || `Incident #${incidentId}`;
  const effectiveAttackTypeDisplay = selectedAttackType === "Other" && customAttackType
    ? customAttackType
    : (existingResolution?.finalAttackType || selectedAttackType);

  return (
    <>
      <Box sx={{ maxWidth: 1200, mx: "auto", pb: 6 }}>
        {/* Header navigation & title */}
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(`/analyst/investigation/${incidentId}`, { state: { incidentId, incidentTitle: title } })}
              sx={{ color: "#9CA3AF", borderColor: "#444", textTransform: "none" }}
            >
              Investigation
            </Button>
            <Box>
              <Typography variant="h5" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                Incident Resolution
              </Typography>
              <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
                #INC-{incidentId} — {title}
              </Typography>
            </Box>
          </Box>

          {isResolved && (
            <Chip
              icon={<CheckCircleIcon sx={{ "&&": { color: "#22C55E" } }} />}
              label="RESOLVED & CLOSED"
              sx={{ bgcolor: "#1B4D2E", color: "#4ADE80", fontWeight: 700, px: 1 }}
            />
          )}
        </Box>

        {isResolved && existingResolution && (
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
              gap: 2
            }}
          >
            <Box display="flex" alignItems="center" gap={2}>
              <TaskAltIcon sx={{ color: "#4ADE80", fontSize: 32 }} />
              <Box>
                <Typography sx={{ color: "#4ADE80", fontWeight: 700, fontSize: 16 }}>
                  Resolution Complete & Persisted
                </Typography>
                <Typography sx={{ color: "#A7F3D0", fontSize: 13 }}>
                  Resolved by {existingResolution.resolvedByName || "Analyst"} on{" "}
                  {existingResolution.resolvedAt ? new Date(existingResolution.resolvedAt).toLocaleString() : "Recently"}
                </Typography>
              </Box>
            </Box>

            <Box display="flex" gap={1.5}>
              <Chip
                label={`Ground Truth: ${existingResolution.finalAttackType}`}
                sx={{ bgcolor: "#064E3B", color: "#6EE7B7", border: "1px solid #059669", fontWeight: 600 }}
              />
              <Chip
                label={`Severity: ${existingResolution.finalSeverity}`}
                sx={{
                  bgcolor: "#064E3B",
                  color: severityColor(existingResolution.finalSeverity),
                  border: "1px solid #059669",
                  fontWeight: 600
                }}
              />
            </Box>
          </Paper>
        )}

        <Grid container spacing={3}>
          {/* ─── LEFT COLUMN: Narrative & Steps ─── */}
          <Grid size={{ xs: 12, md: 7 }}>
            {/* Resolution Summary */}
            <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1 }}>
                Resolution Summary
              </Typography>
              <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 2 }}>
                Provide a comprehensive overview of how this incident was mitigated and resolved.
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={5}
                disabled={isResolved}
                placeholder="Detail the technical actions taken to contain the threat and restore normal operations..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                sx={fieldStyle}
              />
            </Paper>

            {/* Ordered Resolution Steps */}
            <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, mb: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                  Ordered Resolution Steps
                </Typography>
                {!isResolved && (
                  <Button
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddStep}
                    sx={{ color: "#60A5FA", textTransform: "none" }}
                  >
                    Add Step
                  </Button>
                )}
              </Box>
              <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 2.5 }}>
                Numbered sequence of execution steps followed during containment and remediation.
              </Typography>

              {steps.map((stepText, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, mb: 2 }}>
                  <Box
                    sx={{
                      minWidth: 28,
                      height: 28,
                      borderRadius: "50%",
                      bgcolor: "#1565C0",
                      color: "#FFFFFF",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      mt: 1.2
                    }}
                  >
                    {index + 1}
                  </Box>
                  <TextField
                    fullWidth
                    size="small"
                    multiline
                    disabled={isResolved}
                    placeholder={`Step ${index + 1}: Action taken...`}
                    value={stepText}
                    onChange={(e) => handleStepChange(index, e.target.value)}
                    sx={fieldStyle}
                  />
                  {!isResolved && steps.length > 1 && (
                    <IconButton
                      onClick={() => handleRemoveStep(index)}
                      sx={{ color: "#9CA3AF", "&:hover": { color: "#EF4444" }, mt: 0.5 }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Paper>

            {/* Root Cause */}
            <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1 }}>
                Identified Root Cause
              </Typography>
              <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 2 }}>
                The underlying vulnerability, configuration error, or trigger that allowed the incident.
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                disabled={isResolved}
                placeholder="Explain the root cause analysis findings..."
                value={rootCause}
                onChange={(e) => setRootCause(e.target.value)}
                sx={fieldStyle}
              />
            </Paper>
          </Grid>

          {/* ─── RIGHT COLUMN: Ground Truth Classification & Lessons Learned ─── */}
          <Grid size={{ xs: 12, md: 5 }}>
            {/* Analyst Final Ground-Truth Labels */}
            <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, mb: 3 }}>
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1 }}>
                Final Classification
              </Typography>
              <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 2.5 }}>
                Confirmed analyst ground-truth labels used for auditing and future AI training pipelines.
              </Typography>

              {/* Final Attack Type Dropdown */}
              <Box mb={2.5}>
                <Typography sx={{ color: "#D1D5DB", fontSize: 14, fontWeight: 600, mb: 0.8 }}>
                  Final Attack Type (Ground Truth)
                </Typography>
                <TextField
                  select
                  fullWidth
                  disabled={isResolved}
                  value={selectedAttackType}
                  onChange={(e) => setSelectedAttackType(e.target.value)}
                  sx={fieldStyle}
                >
                  {ATTACK_TYPES.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Custom Attack Type Text Input when "Other" is selected */}
                {selectedAttackType === "Other" && (
                  <Box mt={1.5}>
                    <Typography sx={{ color: "#60A5FA", fontSize: 13, fontWeight: 600, mb: 0.5 }}>
                      Enter Attack Type
                    </Typography>
                    <TextField
                      fullWidth
                      size="small"
                      disabled={isResolved}
                      placeholder="Specify custom attack vector (e.g. Zero-Day API Exploit)..."
                      value={customAttackType}
                      onChange={(e) => setCustomAttackType(e.target.value)}
                      sx={fieldStyle}
                    />
                  </Box>
                )}
              </Box>

              {/* Final Severity */}
              <Box mb={2.5}>
                <Typography sx={{ color: "#D1D5DB", fontSize: 14, fontWeight: 600, mb: 0.8 }}>
                  Final Severity (Analyst Confirmed)
                </Typography>
                <TextField
                  select
                  fullWidth
                  disabled={isResolved}
                  value={finalSeverity}
                  onChange={(e) => setFinalSeverity(e.target.value)}
                  sx={fieldStyle}
                >
                  {SEVERITY_OPTIONS.map((sev) => (
                    <MenuItem key={sev} value={sev}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: severityColor(sev) }} />
                        <Typography sx={{ color: severityColor(sev), fontWeight: 600 }}>{sev}</Typography>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Divider sx={{ borderColor: "#444", my: 2.5 }} />

              {/* Lessons Learned */}
              <Box>
                <Typography sx={{ color: "#D1D5DB", fontSize: 14, fontWeight: 600, mb: 0.8 }}>
                  Lessons Learned & Preventive Advice
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  disabled={isResolved}
                  placeholder="Recommendations to prevent recurrence (e.g. policy updates, additional logging)..."
                  value={lessonsLearned}
                  onChange={(e) => setLessonsLearned(e.target.value)}
                  sx={fieldStyle}
                />
              </Box>
            </Paper>

            {/* Action Card */}
            <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
              {!isResolved ? (
                <>
                  <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1 }}>
                    Finalize & Close
                  </Typography>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 3 }}>
                    Submitting resolution marks the incident as RESOLVED, persists ground-truth labels, and updates the timeline.
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={submitting}
                    onClick={handleSubmitResolution}
                    startIcon={submitting ? <CircularProgress size={18} color="inherit" /> : <TaskAltIcon />}
                    sx={{
                      bgcolor: "#16A34A",
                      color: "#FFFFFF",
                      py: 1.4,
                      fontWeight: 700,
                      textTransform: "none",
                      fontSize: 15,
                      "&:hover": { bgcolor: "#15803D" },
                    }}
                  >
                    Submit Resolution & Close Incident
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 1 }}>
                    Post-Resolution Pipeline
                  </Typography>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 2.5 }}>
                    Convert confirmed resolution findings into organizational knowledge or stage as curated AI training data.
                  </Typography>

                  <Box display="flex" flexDirection="column" gap={1.5}>
                    {/* KB Conversion / View */}
                    {existingResolution?.kbArticleId ? (
                      <Button
                        fullWidth
                        variant="outlined"
                        startIcon={<MenuBookIcon />}
                        onClick={() => navigate(`/analyst/article-view/${existingResolution.kbArticleId}`, {
                          state: { articleId: existingResolution.kbArticleId }
                        })}
                        sx={{
                          color: "#60A5FA",
                          borderColor: "#1D4ED8",
                          textTransform: "none",
                          py: 1.2,
                          fontWeight: 600,
                          "&:hover": { borderColor: "#3B82F6", bgcolor: "#1E3A8A20" }
                        }}
                      >
                        View Published KB Article →
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant="outlined"
                        disabled={convertingKb}
                        startIcon={convertingKb ? <CircularProgress size={16} color="inherit" /> : <MenuBookIcon />}
                        onClick={handleConvertToKB}
                        sx={{
                          color: "#60A5FA",
                          borderColor: "#1D4ED8",
                          textTransform: "none",
                          py: 1.2,
                          fontWeight: 600,
                          "&:hover": { borderColor: "#3B82F6", bgcolor: "#1E3A8A20" }
                        }}
                      >
                        Convert Resolution to KB Article
                      </Button>
                    )}

                    {/* AI Training Data Staging */}
                    <Button
                      fullWidth
                      variant="outlined"
                      disabled={stagingTraining || trainingStaged}
                      startIcon={stagingTraining ? <CircularProgress size={16} color="inherit" /> : <AutoAwesomeIcon />}
                      onClick={handleStageTraining}
                      sx={{
                        color: trainingStaged ? "#4ADE80" : "#C4A7FF",
                        borderColor: trainingStaged ? "#059669" : "#6545A3",
                        textTransform: "none",
                        py: 1.2,
                        fontWeight: 600,
                        "&:hover": { borderColor: "#A78BFA", bgcolor: "#6545A320" }
                      }}
                    >
                      {trainingStaged ? "Staged for AI Training ✓" : "Stage for AI Training Data"}
                    </Button>

                    <Divider sx={{ borderColor: "#444", my: 1 }} />

                    <Button
                      fullWidth
                      variant="outlined"
                      onClick={() => navigate("/analyst/assigned-incidents")}
                      sx={{ color: "#9CA3AF", borderColor: "#444", textTransform: "none", py: 1.1 }}
                    >
                      ← Back to Assigned Incidents
                    </Button>
                  </Box>
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
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

export default ResolutionContent;