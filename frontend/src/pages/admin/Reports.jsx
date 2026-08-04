import { Box, Typography } from "@mui/material";
import ReportsContent from "../../components/admin/ReportsContent";

function Reports() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Reports
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Organization-wide incident analytics and metrics
      </Typography>

      <ReportsContent />

    </Box>
  );
}

export default Reports;