import { Box, Typography } from "@mui/material";
import InvestigationContent from "../../components/analyst/InvestigationContent";

function Investigation() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Investigation workspace
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        #INC-041 · Suspicious login from unknown IP
      </Typography>

      <InvestigationContent />

    </Box>
  );
}

export default Investigation;