import { useState, useEffect } from "react";
import { Box, Button, Paper, Typography, CircularProgress } from "@mui/material";
import IncidentCard from "./IncidentCard";
import { useNavigate } from "react-router-dom";
import { getMyIncidents } from "../../../services/incidentService";

const SEVERITY_COLORS = {
  CRITICAL: "#EF4444",
  HIGH: "#F59E0B",
  MEDIUM: "#FB923C",
  LOW: "#22C55E",
};

const STATUS_COLORS = {
  OPEN: "#3B82F6",
  ASSIGNED: "#FACC15",
  IN_PROGRESS: "#A855F7",
  RESOLVED: "#22C55E",
  CLOSED: "#6B7280",
};

function RecentIncidents() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyIncidents()
      .then((data) => setIncidents(Array.isArray(data) ? data.slice(0, 5) : []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Paper
      elevation={0}
      sx={{ bgcolor: "#2D2D2D", p: 3, borderRadius: 2 }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" fontWeight={700} sx={{ color: "white" }}>
          Recent Incidents
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/reporter/report-incident")}
        >
          Report New
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={28} />
        </Box>
      ) : incidents.length === 0 ? (
        <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>
          No incidents found.
        </Typography>
      ) : (
        incidents.map((incident) => {
          const sev = (incident.severity || "").toUpperCase();
          const stat = (incident.status || "").toUpperCase().replace(/ /g, "_");
          return (
            <IncidentCard
              key={incident.incidentId ?? incident.id}
              id={`INC-${incident.incidentId ?? incident.id}`}
              title={incident.title}
              source={incident.affectedSystem ?? incident.category ?? "—"}
              severity={incident.severity ?? "—"}
              status={incident.status ?? "—"}
              severityColor={SEVERITY_COLORS[sev] ?? "#9CA3AF"}
              statusColor={STATUS_COLORS[stat] ?? "#9CA3AF"}
            />
          );
        })
      )}
    </Paper>
  );
}

export default RecentIncidents;