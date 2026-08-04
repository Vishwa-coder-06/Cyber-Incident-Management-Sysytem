import {
  Box,
  Grid,
  Paper,
  Typography,
  Divider,
  Chip,
  Button,
} from "@mui/material";

function AssignIncidentContent() {

  const analysts = [
    {
      initials: "MR",
      name: "Meena R.",
      incidents: "3 active",
      availability: "Availability: High",
      load: "Low Load",
      loadColor: "#22C55E",
      selected: false,
    },
    {
      initials: "KT",
      name: "Kiran T.",
      incidents: "4 active · SQL Injection Specialist",
      availability: "",
      load: "Selected",
      loadColor: "#FFFFFF",
      selected: true,
    },
    {
      initials: "PS",
      name: "Priya S.",
      incidents: "6 active",
      availability: "Availability: Medium",
      load: "Med Load",
      loadColor: "#F59E0B",
      selected: false,
    },
    {
      initials: "AK",
      name: "Arun K.",
      incidents: "8 active",
      availability: "Availability: Low",
      load: "High Load",
      loadColor: "#EF4444",
      selected: false,
    },
  ];

  return (
    <Grid container spacing={3}>

      {/* LEFT */}

      <Grid size={{ xs: 12, md: 5 }}>

        <Paper
          sx={{
            bgcolor: "#2B2B2B",
            p: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >

          <Typography
            variant="h6"
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
              mb: 4,
            }}
          >
            Incident Summary
          </Typography>

          <Typography sx={{color:"#9CA3AF"}}>ID</Typography>
          <Typography sx={{color:"#ffffff"}} fontWeight={700} mb={3}>
            #INC-042
          </Typography>

          <Typography sx={{color:"#9CA3AF"}}>Severity</Typography>
          <Typography sx={{color:"#EF4444"}} fontWeight={700} mb={3}>
            Critical
          </Typography>

          <Typography sx={{color:"#9CA3AF"}}>System</Typography>
          <Typography sx={{color:"#ffffff"}} fontWeight={700} mb={3}>
            API Gateway
          </Typography>

          <Typography sx={{color:"#9CA3AF"}}>Reported</Typography>
          <Typography sx={{color:"#ffffff"}} fontWeight={700}>
            Jun 28 · 11:05
          </Typography>

          <Divider sx={{ my: 3, bgcolor: "#444" }} />

          <Typography
            sx={{
              color: "#9CA3AF",
              lineHeight: 1.8,
            }}
          >
            Automated WAF detected multiple SQL injection
            patterns against the payment API endpoint.
            Source IP is a known Tor exit node.
          </Typography>

        </Paper>

        {/* AI */}

        <Paper
          sx={{
            bgcolor: "#2B2B2B",
            p: 3,
            borderRadius: 2,
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
            AI Recommendation
          </Typography>

          <Paper
            sx={{
              bgcolor: "#1E1E1E",
              p: 2,
            }}
          >

            <Typography
              sx={{
                color: "#9CA3AF",
                fontSize: 12,
              }}
            >
              Suggested Analyst
            </Typography>

            <Typography
              sx={{
                color: "#3B82F6",
                fontWeight: 700,
                mt: 1,
              }}
            >
              Meena R. — Lowest workload (3 active)
            </Typography>

          </Paper>

        </Paper>

      </Grid>

      {/* RIGHT */}

      <Grid size={{ xs: 12, md: 7 }}>

        <Paper
          sx={{
            bgcolor: "#2B2B2B",
            p: 3,
            borderRadius: 2,
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
            Select Analyst
          </Typography>

          {analysts.map((analyst) => (

            <Paper
              key={analyst.name}
              sx={{
                bgcolor: analyst.selected ? "#2563EB" : "#1E1E1E",
                p: 2,
                mb: 2,
                borderRadius: 2,
              }}
            >

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >

                <Box display="flex">

                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: analyst.selected ? "#66BB6A" : "#4DA3FF",
                      borderRadius: 1,

                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",

                      color: "#FFFFFF",
                      fontWeight: 700,
                      mr: 2,
                    }}
                  >
                    {analyst.initials}
                  </Box>

                  <Box>

                    <Typography
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 700,
                      }}
                    >
                      {analyst.name}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#D1D5DB",
                        fontSize: 13,
                      }}
                    >
                      {analyst.incidents}
                    </Typography>

                    {analyst.availability && (
                      <Typography
                        sx={{
                          color: "#9CA3AF",
                          fontSize: 13,
                        }}
                      >
                        {analyst.availability}
                      </Typography>
                    )}

                  </Box>

                </Box>

                <Chip
                  label={analyst.load}
                  size="small"
                  sx={{
                    bgcolor: analyst.selected
                      ? "transparent"
                      : analyst.loadColor,

                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                />

              </Box>

            </Paper>

          ))}

          <Button
            fullWidth
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#3A3A3A",
              textTransform: "none",

              "&:hover": {
                bgcolor: "#4A4A4A",
              },
            }}
          >
            Confirm Assignment
          </Button>

        </Paper>

      </Grid>

    </Grid>
  );
}

export default AssignIncidentContent;