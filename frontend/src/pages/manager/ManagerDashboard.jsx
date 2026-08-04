import { Box, Typography } from "@mui/material";
import ManagerDashboardContent from "../../components/manager/ManagerDashboardContent";

function ManagerDashboard() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Manager Dashboard
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Team performance and incident overview
      </Typography>

      <ManagerDashboardContent />

    </Box>
  );
}

export default ManagerDashboard;