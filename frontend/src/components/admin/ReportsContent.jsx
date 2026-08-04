import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  LinearProgress,
} from "@mui/material";

import DownloadIcon from "@mui/icons-material/Download";
import TableViewIcon from "@mui/icons-material/TableView";

function ReportsContent() {

  const systems = [
    {
      name: "Auth system",
      value: 12,
      percent: 100,
    },
    {
      name: "Email",
      value: 9,
      percent: 75,
    },
    {
      name: "Endpoint",
      value: 7,
      percent: 58,
    },
    {
      name: "Network",
      value: 5,
      percent: 42,
    },
  ];

  return (
    <>

      {/* Top Cards */}

      <Grid container spacing={3}>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography sx={{color:"#9CA3AF"}}>
              MTTD (avg)
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#3B82F6",
                fontWeight: 700,
                mt: 1,
              }}
            >
              1.4h
            </Typography>

          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography sx={{color:"#9CA3AF"}}>
              MTTR (avg)
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#22C55E",
                fontWeight: 700,
                mt: 1,
              }}
            >
              4.2h
            </Typography>

          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography sx={{color:"#9CA3AF"}}>
              Incidents this month
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#F59E0B",
                fontWeight: 700,
                mt: 1,
              }}
            >
              42
            </Typography>

          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography sx={{color:"#9CA3AF"}}>
              Repeat incidents
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#EF4444",
                fontWeight: 700,
                mt: 1,
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
        sx={{ mt: 1 }}
      >

        {/* Severity */}

        <Grid size={{ xs: 12, md: 6 }}>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 3,
              height: "100%",
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
              Incidents by severity (this month)
            </Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-around",
                textAlign: "center",
              }}
            >

              <Box>
                <Typography variant="h4" sx={{color:"#EF4444"}} fontWeight={700}>
                  8
                </Typography>
                <Typography sx={{color:"#9CA3AF"}}>
                  Critical
                </Typography>
              </Box>

              <Box>
                <Typography variant="h4" sx={{color:"#F97316"}} fontWeight={700}>
                  14
                </Typography>
                <Typography sx={{color:"#9CA3AF"}}>
                  High
                </Typography>
              </Box>

              <Box>
                <Typography variant="h4" sx={{color:"#FACC15"}} fontWeight={700}>
                  13
                </Typography>
                <Typography sx={{color:"#9CA3AF"}}>
                  Medium
                </Typography>
              </Box>

              <Box>
                        <Typography variant="h4" sx={{color:"#22C55E"}} fontWeight={700}>
                  7
                </Typography>
                <Typography sx={{color:"#9CA3AF"}}>
                  Low
                </Typography>
              </Box>

            </Box>

          </Paper>

        </Grid>

        {/* Systems */}

        <Grid size={{ xs: 12, md: 6 }}>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 3,
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
              Top affected systems
            </Typography>

            {systems.map((system) => (

              <Box
                key={system.name}
                sx={{ mb: 3 }}
              >

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >

                  <Typography sx={{color:"#9CA3AF"}}>
                    {system.name}
                  </Typography>

                  <Typography sx={{color:"#9CA3AF"}}>
                    {system.value}
                  </Typography>

                </Box>

                <LinearProgress
                  variant="determinate"
                  value={system.percent}
                  sx={{
                    height: 6,
                    borderRadius: 2,
                    bgcolor: "#1E1E1E",

                    "& .MuiLinearProgress-bar": {
                      bgcolor: "#3B82F6",
                    },
                  }}
                />

              </Box>

            ))}

          </Paper>

        </Grid>

      </Grid>

      {/* Export Buttons */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mt: 4,
        }}
      >

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{
            color: "#FFFFFF",
            borderColor: "#555",
            textTransform: "none",

            "&:hover": {
              borderColor: "#C62828",
            },
          }}
        >
          Export PDF
        </Button>

        <Button
          variant="outlined"
          startIcon={<TableViewIcon />}
          sx={{
            color: "#FFFFFF",
            borderColor: "#555",
            textTransform: "none",

            "&:hover": {
              borderColor: "#C62828",
            },
          }}
        >
          Export CSV
        </Button>

      </Box>

    </>
  );
}

export default ReportsContent;