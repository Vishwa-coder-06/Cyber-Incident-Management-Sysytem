import { Box, Button, Paper, Typography } from "@mui/material";
import IncidentCard from "./IncidentCard";
import { useNavigate } from "react-router-dom";

function RecentIncidents() {
  const navigate = useNavigate();

  const incidents = [
    {
      id: "INC-041",
      title: "Suspicious login from unknown IP",
      source: "Auth System",
      severity: "Critical",
      status: "Open",
      severityColor: "#EF4444",
      statusColor: "#3B82F6",
    },
    {
      id: "INC-039",
      title: "Phishing email reported by employee",
      source: "Email",
      severity: "High",
      status: "Assigned",
      severityColor: "#F59E0B",
      statusColor: "#FACC15",
    },
    {
      id: "INC-035",
      title: "Unusual data export from CRM",
      source: "CRM",
      severity: "Medium",
      status: "Resolved",
      severityColor: "#FB923C",
      statusColor: "#22C55E",
    },
    {
      id: "INC-031",
      title: "Ransomware warning on endpoint",
      source: "Endpoint",
      severity: "Critical",
      status: "Resolved",
      severityColor: "#EF4444",
      statusColor: "#22C55E",
    },
  ];

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#2D2D2D",
        p: 3,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          sx={{ color: 'white' }}
        >
          Recent Incidents
        </Typography>

        <Button variant="contained"
        onClick={()=>navigate("/report-incident")}>
          Report New
        </Button>
      </Box>

      {incidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          {...incident}
        />
      ))}
    </Paper>
  );
}

export default RecentIncidents;