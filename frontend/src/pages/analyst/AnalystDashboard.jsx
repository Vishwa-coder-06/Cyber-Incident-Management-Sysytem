import { Box, Typography } from "@mui/material";
import AnalystDashboardContent from "../../components/analyst/AnalystDashboardContent";

function AnalystDashboard() {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Analyst Dashboard
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Your workload and recent activity
      </Typography>

      <AnalystDashboardContent />
    </Box>
  );
}

export default AnalystDashboard;