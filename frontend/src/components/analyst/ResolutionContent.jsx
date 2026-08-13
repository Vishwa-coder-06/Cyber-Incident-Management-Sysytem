import { useState, useEffect } from "react";
import {
  Grid, Paper, Typography, TextField, Checkbox,
  FormControlLabel, Chip, Button, Box, CircularProgress,
  Snackbar, Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useLocation, useNavigate } from "react-router-dom";
import { getInvestigation, closeIncident } from "../../services/incidentService";
import { createArticle } from "../../services/knowledgeService";

function ResolutionContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const incidentId = location.state?.incidentId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("");
  const [articleTitle, setArticleTitle] = useState("");
  const [generateKb, setGenerateKb] = useState(true);
  const [closing, setClosing] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!incidentId) { setLoading(false); return; }
    getInvestigation(incidentId)
      .then((d) => {
        setData(d);
        setArticleTitle(
          d?.incident?.title
            ? `Responding to: ${d.incident.title}`
            : "Incident Resolution Article"
        );
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [incidentId]);

  const handleClose = async () => {
    if (!incidentId) return;
    setClosing(true);
    try {
      const categoryTag = data?.incident?.category ?? "incident";
      await closeIncident(incidentId, {
        resolutionSummary: summary,
        articleTitle: articleTitle || "Incident Resolution Article",
        tags: categoryTag,
        generateKnowledgeArticle: generateKb,
      });

      if (generateKb && summary) {
        try {
          await createArticle({
            title: articleTitle || `Resolution: ${data?.incident?.title ?? incidentId}`,
            content: summary,
            category: data?.incident?.category ?? "General",
            tags: categoryTag,
            status: "PUBLISHED",
          });
        } catch (kbErr) {
          console.warn("Could not auto-generate KB article:", kbErr);
        }
      }

      setSnack({ open: true, message: "Incident closed successfully!", severity: "success" });
      const updated = await getInvestigation(incidentId).catch(() => null);
      if (updated) {
        setData(updated);
      } else {
        setData((prev) => prev ? { ...prev, incident: { ...prev.incident, status: "RESOLVED" } } : null);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Failed to close incident.";
      setSnack({ open: true, message: errMsg, severity: "error" });
    } finally {
      setClosing(false);
    }
  };

  const steps = data?.timeline ?? [];
  const incident = data?.incident ?? {};
  const isAlreadyClosed = incident.status === "RESOLVED" || incident.status === "CLOSED";

  if (loading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  }

  if (!incidentId || !data) {
    return (
      <Typography sx={{ color: "#9CA3AF", py: 4 }}>
        No incident selected. Navigate here from Assigned Incidents or Investigation.
      </Typography>
    );
  }

  return (
    <>
      <Grid container spacing={3}>
        {/* LEFT */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Resolution Steps */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              Resolution steps
            </Typography>

            {steps.length === 0 ? (
              <Typography sx={{ color: "#9CA3AF" }}>No steps recorded yet.</Typography>
            ) : (
              steps.map((item, index) => (
                <Box key={item.id ?? index} display="flex" gap={2} mb={3}>
                  <Box sx={{
                    width: 28, height: 28, borderRadius: "50%",
                    bgcolor: "#1565C0",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    color: "#FFF", fontWeight: 700,
                  }}>
                    {index + 1}
                  </Box>
                  <Box>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                      {item.description ?? item.event ?? item.action}
                    </Typography>
                    <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "Recorded"}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Paper>

          {/* Summary */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              Resolution summary
            </Typography>

            <TextField
              fullWidth multiline rows={6}
              disabled={isAlreadyClosed}
              placeholder="Write a summary of what was done and how it was resolved..."
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              sx={{
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
            <Box sx={{ textAlign: "center" }} mt={2}>
              <KeyboardArrowDownIcon sx={{ color: "#777", fontSize: 34 }} />
            </Box>
          </Paper>
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* KB Article */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              Convert to KB article
            </Typography>

            <Typography sx={{ color: "#9CA3AF", mb: 1 }}>Article title</Typography>
            <TextField
              fullWidth
              disabled={isAlreadyClosed}
              value={articleTitle}
              onChange={(e) => setArticleTitle(e.target.value)}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": { bgcolor: "#1E1E1E", "& fieldset": { borderColor: "#444" } },
                "& input": { color: "#FFFFFF" },
              }}
            />

            <Typography sx={{ color: "#9CA3AF", mb: 1 }}>Tags</Typography>
            <Box mb={3}>
              {(incident.category ? [incident.category] : ["incident"]).map((tag) => (
                <Chip key={tag} label={tag} sx={{ color: "#ffffff", mr: 1, mb: 1 }} />
              ))}
            </Box>

            <FormControlLabel
              control={
                <Checkbox
                  disabled={isAlreadyClosed}
                  checked={generateKb}
                  onChange={(e) => setGenerateKb(e.target.checked)}
                />
              }
              label="Auto-generate KB article from resolution"
              sx={{ color: "#FFFFFF" }}
            />

            <Button
              fullWidth variant="contained"
              disabled={closing || isAlreadyClosed}
              onClick={handleClose}
              sx={{ mt: 3, bgcolor: isAlreadyClosed ? "#555" : "#1565C0", color: "#FFFFFF", textTransform: "none", "&:hover": { bgcolor: "#0D47A1" } }}
              startIcon={closing ? <CircularProgress size={14} color="inherit" /> : null}
            >
              {isAlreadyClosed ? "Incident Resolved & Closed" : "Close incident and save"}
            </Button>
          </Paper>

          {/* Status banner */}
          <Paper elevation={0} sx={{ bgcolor: isAlreadyClosed ? "#1B4D2E" : "#174F23", borderRadius: 2, p: 3 }}>
            <Box display="flex" alignItems="center" gap={2}>
              <CheckCircleIcon sx={{ color: "#4ADE80" }} />
              <Box>
                <Typography color="#4ADE80" fontWeight={700}>
                  {isAlreadyClosed ? "Incident Closed" : "Ready to Close"}
                </Typography>
                <Typography color="#C8E6C9" fontSize={14}>
                  {isAlreadyClosed
                    ? `Status: ${incident.status}. The resolution has been saved to the system.`
                    : "All required steps completed. Closing will notify all stakeholders and generate a KB article."}
                </Typography>
              </Box>
            </Box>
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

export default ResolutionContent;