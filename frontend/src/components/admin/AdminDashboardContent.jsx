import { useState, useEffect } from "react";
import {
  Grid, Paper, Typography, Box, Divider, CircularProgress,
} from "@mui/material";
import { getAdminDashboard } from "../../services/dashboardService";

function AdminDashboardContent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboard()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  }

  const cards = [
    { title: "Total users",        value: data?.totalUsers ?? "—",       color: "#3B82F6" },
    { title: "Active playbooks",   value: data?.activePlaybooks ?? "—",  color: "#22C55E" },
    { title: "KB articles",        value: data?.kbArticles ?? "—",       color: "#A855F7" },
    { title: "Audit events today", value: data?.auditEventsToday ?? data?.auditCount ?? "—", color: "#FACC15" },
  ];

  const chart = Array.isArray(data?.incidentTrend) ? data.incidentTrend : [];
  const audits = Array.isArray(data?.recentAuditEvents) ? data.recentAuditEvents : (Array.isArray(data?.recentAudits) ? data.recentAudits : []);
  const maxCount = Math.max(...chart.map((c) => c.count ?? c.value ?? 0), 1);


  return (
    <Grid container spacing={3}>

      {/* Summary Cards */}
      {cards.map((card) => (
        <Grid size={{ xs: 12, md: 3 }} key={card.title}>
          <Paper sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
            <Typography sx={{ color: "#9CA3AF" }}>{card.title}</Typography>
            <Typography variant="h3" fontWeight={700} sx={{ color: card.color, mt: 1 }}>
              {card.value}
            </Typography>
          </Paper>
        </Grid>
      ))}

      {/* Incident Trend */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, height: "100%" }}>
          <Typography variant="h6" fontWeight={700} mb={4} sx={{ color: "#fff" }}>
            Incident Trend (Last 7 Days)
          </Typography>

          {chart.length === 0 ? (
            <Typography sx={{ color: "#9CA3AF" }}>No trend data available.</Typography>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: 220 }}>
              {chart.map((item, i) => {
                const count = item.count ?? item.value ?? 0;
                const barH = Math.max(Math.round((count / maxCount) * 180), 4);
                const label = item.day ?? item.date ?? `D${i + 1}`;
                return (
                  <Box key={label} sx={{ textAlign: "center" }}>
                    <Box sx={{ width: 22, height: barH, bgcolor: "#3B82F6", borderRadius: 1, mb: 1 }} />
                    <Typography fontSize={12} sx={{ color: "#9CA3AF" }}>{label}</Typography>
                  </Box>
                );
              })}
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Recent Audit Events */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, height: "100%" }}>
          <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: "#fff" }}>
            Recent Audit Events
          </Typography>

          {audits.length === 0 ? (
            <Typography sx={{ color: "#9CA3AF" }}>No recent audit events.</Typography>
          ) : (
            audits.map((audit, i) => (
              <Box key={audit.id ?? i} mb={2}>
                <Typography fontSize={12} sx={{ color: "#9CA3AF" }}>
                  {audit.createdAt ? new Date(audit.createdAt).toLocaleString() : ""}
                </Typography>
                <Typography sx={{ color: "#DDDDDD" }} mt={1}>
                  {audit.description ?? audit.action ?? ""}
                </Typography>
                <Divider sx={{ mt: 2 }} />
              </Box>
            ))
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AdminDashboardContent;