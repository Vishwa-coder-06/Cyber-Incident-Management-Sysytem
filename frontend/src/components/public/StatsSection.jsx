import { Box, Container, Grid, Paper, Typography } from "@mui/material";

const stats = [
  {
    value: "500+",
    label: "Incidents resolved",
    color: "#2196F3",
  },
  {
    value: "98%",
    label: "Resolution rate",
    color: "#22C55E",
  },
  {
    value: "4.2h",
    label: "Avg MTTR",
    color: "#A855F7",
  },
];

function StatsSection() {
  return (
    <Box
      sx={{
        bgcolor: "#2F2F2F",
        py: 6,
      }}
    >
    <Container maxWidth="lg">
      <Grid container spacing={4}>
        {stats.map((item) => (
          <Grid
            size={{xs:12,sm:6,md:4}}
            key={item.label}
          >
            <Paper
              elevation={0}
              sx={{
                bgcolor: "#1F1F1F",
                borderRadius: 2,
                py: 5,
                textAlign: "center",
              }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                sx={{ color: item.color }}
              >
                {item.value}
              </Typography>

              <Typography
                sx={{
                  color: "#9CA3AF",
                  mt: 1,
                }}
              >
                {item.label}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
    </Box>
  );
}

export default StatsSection;