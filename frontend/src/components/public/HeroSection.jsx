import { Box, Typography, Button, Container } from "@mui/material";

function HeroSection() {
  return (
    <Box
      sx={{
        bgcolor: "#1565C0",
        color: "white",
        py: 18,
        borderTop: "3px solid #29B6F6",
      }}
    >
      <Container maxWidth="{false}">

        <Typography
          variant="h2"
          fontWeight="bold"
          align="center"
        >
          Security Incident Management, Reimagined
        </Typography>

        <Typography
          variant="h6"
          align="center"
          sx={{
            mt: 3,
            opacity: 0.9,
          }}
        >
          AI-powered analysis • Automated playbooks •
          Real-time collaboration
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 3,
            mt: 5,
          }}
        >
          <Button
            variant="outlined"
            color="inherit"
            size="large"
          >
            Report an Incident
          </Button>

          <Button
            variant="outlined"
            color="inherit"
            size="large"
          >
            Learn More
          </Button>

        </Box>

      </Container>
    </Box>
  );
}

export default HeroSection;