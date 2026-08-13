import { useState, useEffect } from "react";
import {
  Grid, Paper, Typography, Box, CircularProgress,
} from "@mui/material";
import { getAdminReport } from "../../services/reportService";

function StatCard({ label, value, color }) {
  return (
    <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, height: "100%" }}>
      <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>{label}</Typography>
      <Typography variant="h3" sx={{ color, fontWeight: 700, mt: 1 }}>{value ?? "—"}</Typography>
    </Paper>
  );
}

function ReportsContent() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminReport()
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  }

  const topSystems = Array.isArray(report?.topAffectedSystems) ? report.topAffectedSystems : [];
  const maxSys = Math.max(...topSystems.map((s) => s.count ?? s[1] ?? 0), 1);

  return (
    <Grid container spacing={3}>
      {/* MTTD / MTTR */}
      <Grid size={{ xs: 12, md: 3 }}>
        <StatCard label="MTTD (avg)" value={report?.mttdHours != null ? `${report.mttdHours}h` : null} color="#3B82F6" />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <StatCard label="MTTR (avg)" value={report?.mttrHours != null ? `${report.mttrHours}h` : null} color="#22C55E" />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <StatCard label="Incidents this month" value={report?.incidentsThisMonth} color="#A855F7" />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <StatCard label="Repeat incidents" value={report?.repeatIncidents} color="#F59E0B" />
      </Grid>

      {/* Severity Breakdown */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
            Severity Breakdown
          </Typography>

          {[
            { label: "Critical", value: report?.critical, color: "#EF4444" },
            { label: "High",     value: report?.high,     color: "#F97316" },
            { label: "Medium",   value: report?.medium,   color: "#F59E0B" },
            { label: "Low",      value: report?.low,      color: "#22C55E" },
          ].map(({ label, value, color }) => (
            <Box key={label} sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
              <Typography sx={{ color: "#9CA3AF" }}>{label}</Typography>
              <Typography sx={{ color, fontWeight: 700 }}>{value ?? "—"}</Typography>
            </Box>
          ))}
        </Paper>
      </Grid>

      {/* Top Affected Systems */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 3 }}>
            Top Affected Systems
          </Typography>

          {topSystems.length === 0 ? (
            <Typography sx={{ color: "#9CA3AF" }}>No data available.</Typography>
          ) : (
            topSystems.map((sys, i) => {
              const name  = sys.system ?? sys.name  ?? sys[0] ?? `System ${i + 1}`;
              const count = sys.count  ?? sys.total ?? sys[1] ?? 0;
              const pct   = Math.round((count / maxSys) * 100);
              return (
                <Box key={name} mb={2}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                    <Typography sx={{ color: "#9CA3AF" }}>{name}</Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>{count}</Typography>
                  </Box>
                  <Box sx={{ height: 6, bgcolor: "#444", borderRadius: 3 }}>
                    <Box sx={{ height: 6, width: `${pct}%`, bgcolor: "#3B82F6", borderRadius: 3 }} />
                  </Box>
                </Box>
              );
            })
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default ReportsContent;