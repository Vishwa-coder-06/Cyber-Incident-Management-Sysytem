import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Chip,
} from "@mui/material";

function WorkloadContent() {
  const analysts = [
    {
      name: "Priya S.",
      incidents: 6,
      progress: 55,
      barColor: "#4A90FF",
      chip: "Medium",
      chipColor: "#D97706",
    },
    {
      name: "Arun K.",
      incidents: 8,
      progress: 72,
      barColor: "#F59E0B",
      chip: "High",
      chipColor: "#DC2626",
    },
    {
      name: "Meena R.",
      incidents: 3,
      progress: 23,
      barColor: "#4A90FF",
      chip: "Low",
      chipColor: "#16A34A",
    },
    {
      name: "Kiran T.",
      incidents: 4,
      progress: 30,
      barColor: "#4A90FF",
      chip: "Low",
      chipColor: "#16A34A",
    },
  ];

  return (
    <>
      {/* Summary */}

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 4,
            }}
          >
            <Typography
              sx={{
                color: "#9CA3AF",
                fontSize: 14,
              }}
            >
              Total Analysts
            </Typography>

            <Typography
              variant="h2"
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                mt: 1,
              }}
            >
              4
            </Typography>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 4,
            }}
          >
            <Typography
              sx={{
                color: "#9CA3AF",
                fontSize: 14,
              }}
            >
              Avg Active Incidents
            </Typography>

            <Typography
              variant="h2"
              sx={{
                color: "#F59E0B",
                fontWeight: 700,
                mt: 1,
              }}
            >
              5.3
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Workload */}

      <Paper
        elevation={0}
        sx={{
          bgcolor: "#2B2B2B",
          borderRadius: 2,
          p: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "#FFFFFF",
            fontWeight: 700,
            mb: 5,
          }}
        >
          Workload by Analyst
        </Typography>

        {analysts.map((analyst) => (
          <Box
            key={analyst.name}
            sx={{
              mb: 5,
            }}
          >
            {/* Name + Chips */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1.5,
              }}
            >
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                {analyst.name}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                }}
              >
                <Chip
                  label={`${analyst.incidents} Incidents`}
                  size="small"
                  sx={{
                    bgcolor: "#2563EB",
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                />

                <Chip
                  label={analyst.chip}
                  size="small"
                  sx={{
                    bgcolor: analyst.chipColor,
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Box>

            {/* Progress */}

            <LinearProgress
              variant="determinate"
              value={analyst.progress}
              sx={{
                height: 7,
                borderRadius: 10,
                bgcolor: "#4A4A4A",

                "& .MuiLinearProgress-bar": {
                  bgcolor: analyst.barColor,
                  borderRadius: 10,
                },
              }}
            />
          </Box>
        ))}
      </Paper>
    </>
  );
}

export default WorkloadContent;