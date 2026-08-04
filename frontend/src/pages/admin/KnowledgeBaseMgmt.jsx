import { Box, Typography } from "@mui/material";
import KnowledgeBaseContent from "../../components/admin/KnowledgeBaseMgmtContent";

function KnowledgeBaseMgmt() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Knowledge Management
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Oversee all KB articles across the system
      </Typography>

      <KnowledgeBaseContent />

    </Box>
  );
}

export default KnowledgeBaseMgmt;