import { Box, Typography } from "@mui/material";
import AssignIncidentContent from "../../components/manager/AssignIncidentContent";

function AssignIncident() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Assign Incident
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        #INC-042 · SQL injection attempt on API
      </Typography>

      <AssignIncidentContent />

    </Box>
  );
}

export default AssignIncident;