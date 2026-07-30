import { Box, Container, Paper, Typography } from "@mui/material";

function MissionSection() {
  return (
    <Box
      sx={{
        bgcolor: "#2F2F2F",
        pb: 6,
      }}
    >
      <Container maxWidth="xl">
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#1F1F1F",
            borderRadius: 2,
            p: 4,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
              mb: 2,
            }}
          >
            Our Mission
          </Typography>

          <Typography
            sx={{
              color: "#BDBDBD",
              lineHeight: 1.8,
              fontSize: 16,
            }}
          >
            SecureOps brings together AI-driven analysis, structured workflows,
            and a shared knowledge base so security teams can respond faster,
            collaborate better, and prevent repeat incidents.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
}

export default MissionSection;