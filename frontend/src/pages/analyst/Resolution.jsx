import { Box, Typography } from "@mui/material";
import ResolutionContent from "../../components/analyst/ResolutionContent";

function Resolution() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Resolution page
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        #INC-041 · Finalize and close incident
      </Typography>

      <ResolutionContent />

    </Box>
  );
}

export default Resolution;