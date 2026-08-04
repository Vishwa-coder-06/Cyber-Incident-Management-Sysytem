import { Box, Typography } from "@mui/material";
import MyIncidentsContent from "../../components/reporter/MyIncidentsContent";

function MyIncidents() {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        My Incidents
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        All incidents submitted by you
      </Typography>

      <MyIncidentsContent />
    </Box>
  );
}

export default MyIncidents;