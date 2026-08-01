import { Box, Typography } from "@mui/material";

function DashboardHeader() {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#FFFFFF",
          mb: 1,
        }}
      >
        Reporter dashboard
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          fontSize: 16,
        }}
      >
        Overview of your submitted incidents
      </Typography>
    </Box>
  );
}

export default DashboardHeader;