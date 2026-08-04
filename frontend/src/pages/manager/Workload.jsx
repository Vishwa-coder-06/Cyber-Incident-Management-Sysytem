import { Box, Typography } from "@mui/material";
import WorkloadContent from "../../components/manager/WorkloadContent";

function Workload() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Analyst Workload
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Current capacity and incident distribution
      </Typography>

      <WorkloadContent />

    </Box>
  );
}

export default Workload;