import {
  Box,
  Grid,
  Paper,
  Typography,
  LinearProgress,
  Chip,
  Divider,
  Button,
} from "@mui/material";

function ManagerDashboardContent() {

  const workload = [
    {
      name: "Priya S.",
      value: 60,
      count: 6,
      color: "#4DA3FF",
    },
    {
      name: "Arun K.",
      value: 80,
      count: 8,
      color: "#F59E0B",
    },
    {
      name: "Meena R.",
      value: 30,
      count: 3,
      color: "#4DA3FF",
    },
    {
      name: "Kiran T.",
      value: 40,
      count: 4,
      color: "#4DA3FF",
    },
  ];

  const incidents = [
    {
      id: "#INC-042",
      title: "SQL injection attempt on API",
      severity: "Critical",
      color: "#DC2626",
    },
    {
      id: "#INC-040",
      title: "VPN access from blocked region",
      severity: "High",
      color: "#EF4444",
    },
    {
      id: "#INC-038",
      title: "File exfiltration alert",
      severity: "Medium",
      color: "#F59E0B",
    },
  ];

  return (
    <>

      {/* Summary Cards */}

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              bgcolor: "#2B2B2B",
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography color="#9CA3AF">
              Open incidents
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#3B82F6",
                fontWeight: 700,
              }}
            >
              14
            </Typography>

          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              bgcolor: "#2B2B2B",
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography color="#9CA3AF">
              MTTR (avg)
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#F59E0B",
                fontWeight: 700,
              }}
            >
              4.2h
            </Typography>

          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            sx={{
              bgcolor: "#2B2B2B",
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography color="#9CA3AF">
              Resolved today
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#22C55E",
                fontWeight: 700,
              }}
            >
              6
            </Typography>

          </Paper>
        </Grid>

      </Grid>

      {/* Bottom */}

      <Grid
        container
        spacing={3}
        sx={{
          mt: 1,
        }}
      >

        {/* Analyst Workload */}

        <Grid size={{ xs: 12, md: 6 }}>

          <Paper
            sx={{
              bgcolor: "#2B2B2B",
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >

            <Typography
              variant="h6"
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                mb: 3,
              }}
            >
              Analyst Workload
            </Typography>

            {workload.map((user) => (

              <Box
                key={user.name}
                sx={{
                  mb: 4,
                }}
              >

                <Box
                  display="flex"
                  justifyContent="space-between"
                  mb={1}
                >

                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  >
                    {user.name}
                  </Typography>

                  <Typography color="#9CA3AF">
                    {user.count}
                  </Typography>

                </Box>

                <LinearProgress
                  variant="determinate"
                  value={user.value}
                  sx={{
                    height: 8,
                    borderRadius: 5,
                    bgcolor: "#555",

                    "& .MuiLinearProgress-bar": {
                      bgcolor: user.color,
                    },
                  }}
                />

              </Box>

            ))}

          </Paper>

        </Grid>

        {/* Unassigned Incidents */}

        <Grid size={{ xs: 12, md: 6 }}>

          <Paper
            sx={{
              bgcolor: "#2B2B2B",
              p: 3,
              borderRadius: 2,
              height: "100%",
            }}
          >

            <Typography
              variant="h6"
              sx={{
                color: "#FFFFFF",
                fontWeight: 700,
                mb: 3,
              }}
            >
              Unassigned Incidents
            </Typography>

            {incidents.map((incident) => (

              <Box
                key={incident.id}
                sx={{
                  mb: 3,
                }}
              >

                <Typography
                  sx={{
                    color: "#9CA3AF",
                    fontSize: 13,
                  }}
                >
                  {incident.id}
                </Typography>

                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  mt={1}
                >

                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  >
                    {incident.title}
                  </Typography>

                  <Chip
                    label={incident.severity}
                    size="small"
                    sx={{
                      bgcolor: incident.color,
                      color: "#FFFFFF",
                    }}
                  />

                </Box>

                <Divider
                  sx={{
                    mt: 2,
                    bgcolor: "#444",
                  }}
                />

              </Box>

            ))}

            <Button
              fullWidth
              variant="outlined"
              sx={{
                color: "#FFFFFF",
                borderColor: "#555",
                textTransform: "none",
                py: 1.2,

                "&:hover": {
                  borderColor: "#6C3CE9",
                },
              }}
            >
              Assign Incidents
            </Button>

          </Paper>

        </Grid>

      </Grid>

    </>
  );
}

export default ManagerDashboardContent;