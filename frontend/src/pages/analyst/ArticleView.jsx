import { Box, Typography } from "@mui/material";
import ArticleViewContent from "../../components/analyst/ArticleViewContent";

function ArticleView() {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Responding to unauthorized login attempts
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Knowledge base article · Auth & Access
      </Typography>

      <ArticleViewContent />
    </Box>
  );
}

export default ArticleView;