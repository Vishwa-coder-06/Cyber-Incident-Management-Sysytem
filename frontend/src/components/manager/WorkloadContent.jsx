import { useState, useEffect } from "react";
import {
  Box, Grid, Paper, Typography,
  LinearProgress, Chip, CircularProgress,
} from "@mui/material";
import { getManagerWorkload } from "../../services/dashboardService";

function loadChip(count, max) {
  const pct = max > 0 ? count / max : 0;
  if (pct >= 0.7) return { label: "High", color: "#DC2626" };
  if (pct >= 0.4) return { label: "Medium", color: "#D97706" };
  return { label: "Low", color: "#16A34A" };
}

function WorkloadContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getManagerWorkload()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  }

  const analysts = data?.workload ?? data?.analysts ?? [];
  const maxCount = Math.max(...analysts.map((a) => a.activeIncidents ?? a.assignmentCount ?? a.activeCount ?? a.count ?? 0), 1);
  const avgWorkload = data?.averageWorkload != null
    ? Number(data.averageWorkload).toFixed(1)
    : (analysts.length > 0
        ? (analysts.reduce((s, a) => s + (a.activeIncidents ?? a.assignmentCount ?? a.activeCount ?? a.count ?? 0), 0) / analysts.length).toFixed(1)
        : "—");

  return (
    <>
      {/* Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 4 }}>
            <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>Total Analysts</Typography>
            <Typography variant="h2" sx={{ color: "#FFFFFF", fontWeight: 700, mt: 1 }}>
              {data?.totalAnalysts ?? analysts.length}
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 4 }}>
            <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>Avg Active Incidents</Typography>
            <Typography variant="h2" sx={{ color: "#F59E0B", fontWeight: 700, mt: 1 }}>
              {avgWorkload}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Workload by Analyst */}
      <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 4 }}>
        <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 5 }}>
          Workload by Analyst
        </Typography>

        {analysts.length === 0 ? (
          <Typography sx={{ color: "#9CA3AF" }}>No analyst data available.</Typography>
        ) : (
          analysts.map((analyst) => {
            const count = analyst.activeIncidents ?? analyst.assignmentCount ?? analyst.activeCount ?? analyst.count ?? 0;
            const pct = Math.round((count / maxCount) * 100);
            const fullName = `${analyst.firstName ?? ""} ${analyst.lastName ?? ""}`.trim();
            const name = analyst.name ?? analyst.analystName ?? (fullName.length > 0 ? fullName : `Analyst ${analyst.analystId ?? ""}`);
            const { label, color: chipColor } = loadChip(count, maxCount);
            const barColor = pct >= 70 ? "#F59E0B" : "#4A90FF";

            return (
              <Box key={analyst.analystId ?? name} sx={{ mb: 5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 18 }}>
                    {name}
                  </Typography>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Chip
                      label={`${count} Incidents`}
                      size="small"
                      sx={{ bgcolor: "#2563EB", color: "#FFFFFF", fontWeight: 600 }}
                    />
                    <Chip
                      label={label}
                      size="small"
                      sx={{ bgcolor: chipColor, color: "#FFFFFF", fontWeight: 600 }}
                    />
                  </Box>
                </Box>

                <LinearProgress
                  variant="determinate"
                  value={pct}
                  sx={{
                    height: 7, borderRadius: 10, bgcolor: "#4A4A4A",
                    "& .MuiLinearProgress-bar": { bgcolor: barColor, borderRadius: 10 },
                  }}
                />
              </Box>
            );
          })
        )}
      </Paper>
    </>
  );
}

export default WorkloadContent;