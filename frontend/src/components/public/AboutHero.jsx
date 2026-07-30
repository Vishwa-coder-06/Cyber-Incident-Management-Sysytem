import { Box, Typography } from "@mui/material";

function AboutHero() {
  return (
    <Box
      sx={{
        bgcolor: "#1565C0",
        color: "#FFFFFF",
        py: 10,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h3"
        fontWeight="bold"
      >
        About SecureOps Portal
      </Typography>

      <Typography
        sx={{
          mt: 3,
          fontSize: 22,
          maxWidth: 900,
          mx: "auto",
        }}
      >
        Built for enterprise security teams to detect, respond, and learn
        from every incident — powered by AI.
      </Typography>
    </Box>
  );
}

export default AboutHero;