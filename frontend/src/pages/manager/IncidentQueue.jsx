import { Box, Typography } from "@mui/material";
import IncidentQueueContent from "../../components/manager/IncidentQueueContent";

function IncidentQueue() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Incident Queue
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        All open incidents across the organization
      </Typography>

      <IncidentQueueContent />

    </Box>
  );
}

export default IncidentQueue;