import { Box, Typography } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";

function LoginLeftPanel() {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "#1565C0",
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        p: 6,
      }}
    >
      <SecurityIcon
        sx={{
          fontSize: 80,
          mb: 4,
        }}
      />

      <Typography
        variant="h3"
        fontWeight="bold"
        gutterBottom
      >
        SecureOps Portal
      </Typography>

      <Typography
        variant="h6"
        sx={{
          textAlign: "center",
          maxWidth: 450,
          opacity: 0.9,
        }}
      >
        Enterprise-grade incident response with AI-powered insights.
      </Typography>
    </Box>
  );
}

export default LoginLeftPanel;