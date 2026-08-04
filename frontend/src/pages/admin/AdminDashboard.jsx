import { Box, Typography } from "@mui/material";
import AdminDashboardContent from "../../components/admin/AdminDashboardContent";

function AdminDashboard() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Admin Dashboard
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        System-wide metrics and health overview
      </Typography>

      <AdminDashboardContent />

    </Box>
  );
}

export default AdminDashboard;