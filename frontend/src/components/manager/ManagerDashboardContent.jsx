import { useState, useEffect } from "react";
import {
  Box, Grid, Paper, Typography, LinearProgress,
  Chip, Divider, Button, CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getManagerDashboard } from "../../services/assignmentService";

const SEV_COLORS = {
  CRITICAL: "#DC2626",
  HIGH: "#EF4444",
  MEDIUM: "#F59E0B",
  LOW: "#22C55E",
};

function ManagerDashboardContent() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getManagerDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  }

  const workload = data?.analystWorkload ?? [];
  const unassigned = data?.unassignedIncidents ?? [];
  const maxWorkload = Math.max(...workload.map((a) => a.assignmentCount ?? a.activeCount ?? a.count ?? 0), 1);

  return (
    <>
      {/* Summary Cards */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography color="#9CA3AF">Open incidents</Typography>
            <Typography variant="h3" sx={{ color: "#3B82F6", fontWeight: 700 }}>
              {data?.openIncidents ?? "—"}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography color="#9CA3AF">MTTR (avg)</Typography>
            <Typography variant="h3" sx={{ color: "#F59E0B", fontWeight: 700 }}>
              {data?.mttr != null ? `${data.mttr}h` : "—"}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography color="#9CA3AF">Resolved today</Typography>
            <Typography variant="h3" sx={{ color: "#22C55E", fontWeight: 700 }}>
              {data?.resolvedToday ?? "—"}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Bottom */}
      <Grid container spacing={3} sx={{ mt: 1 }}>

        {/* Analyst Workload */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              Analyst Workload
            </Typography>

            {workload.length === 0 ? (
              <Typography sx={{ color: "#9CA3AF" }}>No workload data.</Typography>
            ) : (
              workload.map((analyst) => {
                const count = analyst.assignmentCount ?? analyst.activeCount ?? analyst.count ?? 0;
                const pct = Math.round((count / maxWorkload) * 100);
                const name = analyst.analystName ?? analyst.name ?? `Analyst ${analyst.analystId}`;
                const color = pct >= 80 ? "#F59E0B" : "#4DA3FF";
                return (
                  <Box key={analyst.analystId ?? name} sx={{ mb: 4 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>{name}</Typography>
                      <Typography color="#9CA3AF">{count}</Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={pct}
                      sx={{
                        height: 8, borderRadius: 5, bgcolor: "#555",
                        "& .MuiLinearProgress-bar": { bgcolor: color },
                      }}
                    />
                  </Box>
                );
              })
            )}
          </Paper>
        </Grid>

        {/* Unassigned Incidents */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, height: "100%" }}>
            <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
              Unassigned Incidents
            </Typography>

            {unassigned.length === 0 ? (
              <Typography sx={{ color: "#9CA3AF" }}>No unassigned incidents.</Typography>
            ) : (
              unassigned.map((incident) => {
                const id = incident.incidentId ?? incident.id;
                const sev = (incident.severity || "").toUpperCase();
                return (
                  <Box key={id} sx={{ mb: 3 }}>
                    <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
                      #INC-{id}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                        {incident.title}
                      </Typography>
                      <Chip
                        label={incident.severity}
                        size="small"
                        sx={{ bgcolor: SEV_COLORS[sev] ?? "#555", color: "#FFFFFF" }}
                      />
                    </Box>
                    <Divider sx={{ mt: 2, bgcolor: "#444" }} />
                  </Box>
                );
              })
            )}

            <Button
              fullWidth variant="outlined"
              onClick={() => navigate("/manager/incident-queue")}
              sx={{
                color: "#FFFFFF", borderColor: "#555", textTransform: "none", py: 1.2,
                "&:hover": { borderColor: "#6C3CE9" },
              }}
            >
              Assign Incidents
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default ManagerDashboardContent;