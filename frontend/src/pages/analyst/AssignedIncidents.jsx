import { Box, Typography } from "@mui/material";
import AssignedIncidentsContent from "../../components/analyst/AssignedIncidentsContent";

function AssignedIncidents() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Assigned incidents
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Incidents currently assigned to you
      </Typography>

      <AssignedIncidentsContent />

    </Box>
  );
}

export default AssignedIncidents;