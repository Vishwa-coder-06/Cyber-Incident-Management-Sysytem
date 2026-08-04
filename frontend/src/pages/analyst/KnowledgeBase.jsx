import { Box, Typography } from "@mui/material";
import KnowledgeBaseContent from "../../components/analyst/KnowledgeBaseContent";

function KnowledgeBase() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Knowledge base
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Search and browse past incident solutions
      </Typography>

      <KnowledgeBaseContent />

    </Box>
  );
}

export default KnowledgeBase;