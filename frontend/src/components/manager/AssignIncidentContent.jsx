import { useState, useEffect } from "react";
import {
  Box, Grid, Paper, Typography, Divider,
  Chip, Button, CircularProgress, Snackbar, Alert,
} from "@mui/material";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getAssignmentPageData } from "../../services/dashboardService";
import { createAssignment } from "../../services/assignmentService";
import { useAuth } from "../../contexts/AuthContext";

function loadLabel(count) {
  if (count >= 7) return { label: "High Load", color: "#EF4444" };
  if (count >= 4) return { label: "Med Load", color: "#F59E0B" };
  return { label: "Low Load", color: "#22C55E" };
}

function avail(analyst) {
  if (analyst.availability) return analyst.availability;
  const n = analyst.activeIncidents ?? analyst.activeCount ?? 0;
  if (n >= 7) return "LOW";
  if (n >= 4) return "MEDIUM";
  return "HIGH";
}

function AssignIncidentContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const { incidentId: paramId } = useParams();
  const { user } = useAuth();

  // Support both location.state.incidentId AND URL param /assign/:incidentId
  const incidentId = location.state?.incidentId ?? paramId;
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnalystId, setSelectedAnalystId] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    if (!incidentId) { setLoading(false); return; }
    getAssignmentPageData(incidentId)
      .then((data) => {
        setPageData(data);
        const rec = data?.recommendedAnalyst;
        if (rec) {
          setSelectedAnalystId(rec.analystId ?? rec.userId ?? rec.id);
        }
      })
      .catch(() => setPageData(null))
      .finally(() => setLoading(false));
  }, [incidentId]);

  const handleConfirm = async () => {
    if (!selectedAnalystId || !incidentId) return;
    setAssigning(true);
    try {
      await createAssignment({
        incidentId: Number(incidentId),
        analystId: Number(selectedAnalystId),
        managerId: user?.userId ? Number(user.userId) : null,
        status: "ASSIGNED",
      });
      setSnack({ open: true, message: "Incident assigned successfully!", severity: "success" });
      setTimeout(() => navigate("/manager/incident-queue"), 1500);
    } catch {
      setSnack({ open: true, message: "Failed to assign incident.", severity: "error" });
    } finally {
      setAssigning(false);
    }
  };

  if (loading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  }

  if (!incidentId || !pageData) {
    return (
      <Typography sx={{ color: "#9CA3AF", py: 4, textAlign: "center" }}>
        No incident selected. Please select an incident from the Incident Queue.
      </Typography>
    );
  }

  const incident = pageData.incident ?? {};
  const analysts = pageData.analysts ?? [];
  const recommended = pageData.recommendedAnalyst;

  // Check if incident is already assigned
  const isAlreadyAssigned =
    incident.assignedAnalyst != null ||
    incident.assignedTo != null ||
    incident.assignedToName != null ||
    (incident.status && ["ASSIGNED", "IN_PROGRESS", "INVESTIGATING", "RESOLVED"].includes((incident.status ?? "").toUpperCase()));

  const assignedAnalystInfo = incident.assignedAnalyst ?? incident.assignedTo ?? incident.assignedToName;

  const analystName = (a) =>
    a.name ?? (`${a.firstName ?? ""} ${a.lastName ?? ""}`.trim() || `Analyst ${a.analystId}`);

  return (
    <>
      <Grid container spacing={3}>
        {/* LEFT — Incident Summary */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 4 }}>
              Incident Summary
            </Typography>

            {[
              { label: "ID", value: `#INC-${incident.incidentId ?? incident.id ?? incidentId}` },
              { label: "Title", value: incident.title ?? "—" },
              { label: "Severity", value: incident.severity ?? "—", color: "#EF4444" },
              { label: "Status", value: incident.status ?? "—" },
              { label: "System", value: incident.affectedSystem ?? incident.system ?? "—" },
            ].map(({ label, value, color }) => (
              <Box key={label} mb={2}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>{label}</Typography>
                <Typography sx={{ color: color ?? "#FFFFFF" }} fontWeight={700}>{value}</Typography>
              </Box>
            ))}

            {incident.description && (
              <>
                <Divider sx={{ my: 2, bgcolor: "#444" }} />
                <Typography sx={{ color: "#9CA3AF", lineHeight: 1.8 }}>
                  {incident.description}
                </Typography>
              </>
            )}
          </Paper>

          {/* AI / System Recommendation */}
          {!isAlreadyAssigned && recommended && (
            <Paper sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
                Recommended Analyst
              </Typography>
              <Paper sx={{ bgcolor: "#1E1E1E", p: 2 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>Suggested Analyst</Typography>
                <Typography sx={{ color: "#3B82F6", fontWeight: 700, mt: 1 }}>
                  {analystName(recommended)}
                </Typography>
                <Typography sx={{ color: "#9CA3AF", fontSize: 13, mt: 0.5 }}>
                  {recommended.activeIncidents ?? 0} active incidents · Availability: {avail(recommended)}
                </Typography>
              </Paper>
            </Paper>
          )}
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>

            {isAlreadyAssigned ? (
              /* ── Already Assigned View ── */
              <>
                <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
                  Current Assignment
                </Typography>

                <Paper sx={{ bgcolor: "#1A2E1A", border: "1px solid #2E7D32", p: 3, borderRadius: 2, mb: 3 }}>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, mb: 1 }}>ASSIGNED ANALYST</Typography>
                  {(() => {
                    const aa = incident.assignedAnalyst;
                    const displayName = typeof aa === "object" && aa !== null
                      ? analystName(aa)
                      : typeof assignedAnalystInfo === "string"
                        ? assignedAnalystInfo
                        : "Assigned";
                    const count = typeof aa === "object" && aa !== null ? (aa.activeIncidents ?? 0) : null;
                    const initials = displayName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

                    return (
                      <Box display="flex" alignItems="center" gap={2} mt={1}>
                        <Box sx={{
                          width: 44, height: 44, bgcolor: "#2E7D32",
                          borderRadius: 1, display: "flex", alignItems: "center",
                          justifyContent: "center", color: "#FFFFFF", fontWeight: 700,
                        }}>
                          {initials}
                        </Box>
                        <Box>
                          <Typography sx={{ color: "#FFFFFF", fontWeight: 700, fontSize: 18 }}>
                            {displayName}
                          </Typography>
                          {count !== null && (
                            <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
                              {count} active incidents · {avail(aa)}
                            </Typography>
                          )}
                          {typeof aa === "object" && aa?.email && (
                            <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>{aa.email}</Typography>
                          )}
                        </Box>
                      </Box>
                    );
                  })()}
                </Paper>

                <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
                  This incident is already assigned. To reassign, please use the Incident Queue.
                </Typography>

                <Button
                  variant="outlined"
                  onClick={() => navigate("/manager/incident-queue")}
                  sx={{ mt: 3, color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
                >
                  Back to Incident Queue
                </Button>
              </>
            ) : (
              /* ── Unassigned: Select Analyst ── */
              <>
                <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
                  Select Analyst
                </Typography>

                {analysts.length === 0 ? (
                  <Typography sx={{ color: "#9CA3AF" }}>No analysts available.</Typography>
                ) : (
                  analysts.map((analyst) => {
                    const aId = analyst.analystId ?? analyst.userId ?? analyst.id;
                    const isSelected = selectedAnalystId === aId;
                    const count = analyst.activeIncidents ?? analyst.activeCount ?? 0;
                    const { label, color } = loadLabel(count);
                    const name = analystName(analyst);
                    const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

                    return (
                      <Paper
                        key={aId}
                        onClick={() => setSelectedAnalystId(aId)}
                        sx={{
                          bgcolor: isSelected ? "#2563EB" : "#1E1E1E",
                          p: 2, mb: 2, borderRadius: 2, cursor: "pointer",
                          "&:hover": { bgcolor: isSelected ? "#1D4ED8" : "#2A2A2A" },
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Box display="flex">
                            <Box sx={{
                              width: 40, height: 40, bgcolor: isSelected ? "#66BB6A" : "#4DA3FF",
                              borderRadius: 1, display: "flex", alignItems: "center",
                              justifyContent: "center", color: "#FFFFFF", fontWeight: 700, mr: 2,
                            }}>
                              {initials}
                            </Box>
                            <Box>
                              <Typography sx={{ color: "#FFFFFF", fontWeight: 700 }}>{name}</Typography>
                              <Typography sx={{ color: "#D1D5DB", fontSize: 13 }}>
                                {count} active incidents · {avail(analyst)} availability
                              </Typography>
                              {analyst.email && (
                                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>{analyst.email}</Typography>
                              )}
                            </Box>
                          </Box>

                          <Chip
                            label={isSelected ? "Selected" : label}
                            size="small"
                            sx={{ bgcolor: isSelected ? "transparent" : color, color: "#FFFFFF", fontWeight: 600 }}
                          />
                        </Box>
                      </Paper>
                    );
                  })
                )}

                <Button
                  fullWidth variant="contained"
                  disabled={!selectedAnalystId || assigning}
                  onClick={handleConfirm}
                  sx={{
                    mt: 2, bgcolor: "#2563EB", textTransform: "none",
                    "&:hover": { bgcolor: "#1D4ED8" },
                  }}
                  startIcon={assigning ? <CircularProgress size={14} color="inherit" /> : null}
                >
                  {assigning ? "Assigning..." : "Confirm Assignment"}
                </Button>
              </>
            )}
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

export default AssignIncidentContent;