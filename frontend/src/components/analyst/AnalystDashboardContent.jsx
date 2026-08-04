import {
  Grid,
  Paper,
  Typography,
  Box,
  Chip,
  Divider,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";

function AnalystDashboardContent() {
  const incidents = [
    {
      id: "#INC-041",
      title: "Suspicious login",
      severity: "Critical",
      color: "#E53935",
    },
    {
      id: "#INC-039",
      title: "Phishing email",
      severity: "High",
      color: "#F57C00",
    },
    {
      id: "#INC-036",
      title: "VPN anomaly",
      severity: "Medium",
      color: "#F9A825",
    },
  ];

  const articles = [
    {
      title: "Account Compromise Response",
      info: "Created Jun 27 · 142 views",
    },
    {
      title: "Phishing Triage Checklist",
      info: "Created Jun 25 · 89 views",
    },
  ];

  return (
    <Grid container spacing={3}>

      {/* Summary Cards */}

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography sx={{color:"#9CA3AF"}}>
            Assigned to you
          </Typography>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: 42,
              fontWeight: 700,
              mt: 2,
            }}
          >
            7
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography sx={{color:"#9CA3AF"}}>
            Resolved this week
          </Typography>

          <Typography
            sx={{
              color: "#4ADE80",
              fontSize: 42,
              fontWeight: 700,
              mt: 2,
            }}
          >
            5
          </Typography>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            borderRadius: 2,
            p: 3,
          }}
        >
          <Typography sx={{color:"#9CA3AF"}}>
            Avg resolution time
          </Typography>

          <Typography
            sx={{
              color: "#F59E0B",
              fontSize: 42,
              fontWeight: 700,
              mt: 2,
            }}
          >
            3.8h
          </Typography>
        </Paper>
      </Grid>

      {/* Active Incidents */}

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
            sx={{
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 700,
              mb: 3,
            }}
          >
            Active Incidents
          </Typography>

          {incidents.map((incident) => (
            <Box key={incident.id} mb={2}>

              <Typography sx={{color:"#9CA3AF"}} fontSize={13}>
                {incident.id}
              </Typography>

              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mt={1}
              >
                <Typography
                  sx={{color:"#9CA3AF",fontWeight: 600,}}
                >
                  {incident.title}
                </Typography>

                <Chip
                  label={incident.severity}
                  size="small"
                  sx={{
                    bgcolor: incident.color,
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                />
              </Box>

              <Divider sx={{ mt: 2, bgcolor: "#444" }} />

            </Box>
          ))}

        </Paper>
      </Grid>

      {/* Recent KB */}

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
            sx={{
              color: "#FFFFFF",
              fontSize: 24,
              fontWeight: 700,
              mb: 3,
            }}
          >
            Recent KB Articles
          </Typography>

          {articles.map((article) => (
            <Box key={article.title} mb={3}>

              <Box display="flex">

                <DescriptionIcon
                  sx={{
                    color: "#4ADE80",
                    mr: 2,
                    mt: 0.5,
                  }}
                />

                <Box>

                  <Typography
                  sx={{
                    color: "#ffffff",
                    fontWeight:600,
                  }}
                  >
                    {article.title}
                  </Typography>

                  <Typography
                   sx={{
                    color: "#ffffff",
                    fontWeight:14,
                  }}
                  >
                    {article.info}
                  </Typography>

                </Box>

              </Box>

              <Divider sx={{ mt: 2, bgcolor: "#444" }} />

            </Box>
          ))}

        </Paper>
      </Grid>

    </Grid>
  );
}

export default AnalystDashboardContent;