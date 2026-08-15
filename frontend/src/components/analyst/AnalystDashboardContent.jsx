import { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
  CircularProgress,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import { getAnalystDashboard } from "../../services/assignmentService";
import { useAuth } from "../../contexts/AuthContext";

import { useNavigate } from "react-router-dom";
import { getMe } from "../../services/userService";

function AnalystDashboardContent() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        let uid = user?.userId ?? user?.id;
        if (!uid) {
          const me = await getMe();
          uid = me?.userId ?? me?.id;
        }
        if (!uid) {
          if (isMounted) setLoading(false);
          return;
        }
        const res = await getAnalystDashboard(uid);
        if (isMounted) {
          setData(res);
          setError(false);
        }
      } catch (err) {
        if (isMounted) {
          setData(null);
          setError(true);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboard();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const severityColor = (sev) => {
    const s = (sev || "").toUpperCase();
    if (s === "CRITICAL") return "#E53935";
    if (s === "HIGH") return "#F57C00";
    return "#F9A825";
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !data) {
    return (
      <Box py={4} textAlign="center">
        <Typography sx={{ color: "#EF4444", fontSize: 16 }}>
          Failed to load analyst dashboard data. Please try again later.
        </Typography>
      </Box>
    );
  }

  const incidents = data?.activeIncidents ?? [];
  const articles = data?.recentKbArticles ?? [];

  return (
    <Grid container spacing={3}>
      {/* Summary Cards */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
          <Typography sx={{ color: "#9CA3AF" }}>Assigned to you</Typography>
          <Typography sx={{ color: "#FFFFFF", fontSize: 42, fontWeight: 700, mt: 2 }}>
            {data?.assignedToYou ?? 0}
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
          <Typography sx={{ color: "#9CA3AF" }}>Resolved this week</Typography>
          <Typography sx={{ color: "#4ADE80", fontSize: 42, fontWeight: 700, mt: 2 }}>
            {data?.resolvedThisWeek ?? 0}
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
          <Typography sx={{ color: "#9CA3AF" }}>Avg resolution time</Typography>
          <Typography sx={{ color: "#F59E0B", fontSize: 42, fontWeight: 700, mt: 2 }}>
            {data?.averageResolutionTime != null
              ? `${data.averageResolutionTime}h`
              : "0.0h"}
          </Typography>
        </Paper>
      </Grid>

      {/* Active Incidents */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, height: "100%" }}>
          <Typography sx={{ color: "#FFFFFF", fontSize: 24, fontWeight: 700, mb: 3 }}>
            Active Incidents
          </Typography>

          {incidents.length === 0 ? (
            <Typography sx={{ color: "#9CA3AF" }}>No active incidents.</Typography>
          ) : (
            incidents.map((incident) => {
              const id = incident.incidentId ?? incident.id;
              return (
                <Box
                  key={id}
                  mb={2}
                  onClick={() => navigate(`/analyst/incident-details/${id}`, { state: { incidentId: id, incidentTitle: incident.title } })}
                  sx={{
                    cursor: "pointer",
                    p: 1.5,
                    borderRadius: 1.5,
                    "&:hover": { bgcolor: "#343434" },
                    transition: "background 0.2s",
                  }}
                >
                  <Typography sx={{ color: "#9CA3AF" }} fontSize={13}>
                    #INC-{id}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mt={0.5}>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                      {incident.title}
                    </Typography>
                    <Chip
                      label={incident.severity}
                      size="small"
                      sx={{ bgcolor: severityColor(incident.severity), color: "#FFFFFF", fontWeight: 600 }}
                    />
                  </Box>
                  <Divider sx={{ mt: 1.5, bgcolor: "#444" }} />
                </Box>
              );
            })
          )}

        </Paper>
      </Grid>

      {/* Recent KB Articles */}
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3, height: "100%" }}>
          <Typography sx={{ color: "#FFFFFF", fontSize: 24, fontWeight: 700, mb: 3 }}>
            Recent KB Articles
          </Typography>

          {articles.length === 0 ? (
            <Typography sx={{ color: "#9CA3AF" }}>No recent articles.</Typography>
          ) : (
            articles.map((article) => {
              const artId = article.id ?? article.articleId;
              return (
                <Box
                  key={artId ?? article.title}
                  mb={3}
                  onClick={() => navigate("/analyst/article-view", { state: { articleId: artId } })}
                  sx={{
                    cursor: "pointer",
                    borderRadius: 1,
                    p: 1,
                    "&:hover": { bgcolor: "#343434" },
                    transition: "background 0.2s",
                  }}
                >
                  <Box display="flex">
                    <DescriptionIcon sx={{ color: "#4ADE80", mr: 2, mt: 0.5 }} />
                    <Box>
                      <Typography sx={{ color: "#ffffff", fontWeight: 600 }}>
                        {article.title}
                      </Typography>
                      <Typography sx={{ color: "#9CA3AF", fontSize: 14 }}>
                        {article.category ?? ""}{article.viewCount != null ? ` · ${article.viewCount} views` : ""}
                      </Typography>
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 2, bgcolor: "#444" }} />
                </Box>
              );
            })
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AnalystDashboardContent;