import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Divider,
} from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

function IncidentDetailsContent() {
  return (
    <Grid container spacing={3}>

      {/* LEFT */}

      <Grid size={{ xs: 12, md: 7 }}>

        {/* Incident Information */}

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            p: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >

          <Box
            display="flex"
            justifyContent="space-between"
            mb={3}
          >
            <Typography
              variant="h6"
              sx={{color: "#FFFFFF", fontWeight: 700,}}
            >
              Incident Information
            </Typography>

            <Chip
              label="Critical"
              color="error"
              size="small"
            />
          </Box>

          <Info title="Incident ID" value="#INC-041" />

          <Info title="Affected system" value="Auth system" />

          <Info title="Reported by" value="John Doe" />

          <Info title="Date reported" value="Jun 28, 2026 · 09:12" />

          <Info title="Status" value="Open" color="#42A5F5" />

          <Info title="Assigned to" value="Priya S. (Analyst)" />

        </Paper>

        {/* Description */}

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            p: 3,
            borderRadius: 2,
          }}
        >

          <Typography
            variant="h6"
            mb={2}
            sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
          >
            Description
          </Typography>

          <Typography
            sx={{color: "#FFFFFF"}}
            lineHeight={1.8}
          >
            A login was detected from an IP address in Eastern Europe
            at 02:34 AM. The account belongs to a senior engineer who
            reported not initiating the session. No MFA prompt was
            triggered.
          </Typography>

        </Paper>

      </Grid>

      {/* RIGHT */}

      <Grid size={{ xs: 12, md: 5 }}>

        {/* AI Summary */}

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            p: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >

          <Typography
            variant="h6"
            color="white"
            fontWeight={700}
            mb={3}
            sx={{color: "#FFFFFF"}}

          >
            AI Analysis Summary
          </Typography>

          <Label title="CATEGORY" />

          <Paper
            sx={{
              bgcolor: "#1E1E1E",
              p: 1.5,
              mb: 3,
            }}
          >
            <Typography sx={{color: "#FFFFFF"}}>
              Unauthorized Access
            </Typography>
          </Paper>

          <Label title="SEVERITY" />

          <Paper
            sx={{
              bgcolor: "#401E1E",
              p: 1.5,
              mb: 3,
            }}
          >
            <Typography sx={{color: "#FFFFFF"}}
>
              Critical
            </Typography>
          </Paper>

          <Label title="PLAYBOOK" />

          <Box
            display="flex"
            alignItems="center"
            gap={1}
          >
            <ArticleOutlinedIcon
              sx={{
                color: "#42A5F5",
              }}
            />

            <Typography sx={{color: "#42A5F5"}}
>
              Account Compromise v2.1
            </Typography>
          </Box>

        </Paper>

        {/* Timeline */}

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            p: 3,
            borderRadius: 2,
          }}
        >

          <Typography
            variant="h6"
            color="white"
            fontWeight={700}
            mb={3}
            sx={{color: "#FFFFFF"}}
          >
            Timeline
          </Typography>

          {TimelineItem(
            "Submitted by reporter",
            "Jun 28 · 09:12",
            "#22C55E"
          )
        }

          <Divider sx={{ my: 2 }} />

          {TimelineItem(
            "AI analysis complete",
            "Jun 28 · 09:13",
            "#22C55E"
          )}

          <Divider sx={{ my: 2 }} />

          {TimelineItem(
            "Under investigation",
            "Jun 28 · 09:45",
            "#3B82F6"
          )}

        </Paper>

      </Grid>

    </Grid>
  );
}

function Info({ title, value, color = "#FFFFFF" }) {
  return (
    <Box mb={3}>
      <Typography
        sx={{
          color: "#808080",
          fontSize: 13,
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color,
          fontWeight: 600,
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function Label({ title }) {
  return (
    <Typography
      sx={{
        color: "#808080",
        fontSize: 12,
        fontWeight: 700,
        mb: 1,
      }}
    >
      {title}
    </Typography>
  );
}

function TimelineItem(title, time, color) {
  return (
    <Box
      display="flex"
      gap={2}
    >
      <Box
        sx={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          bgcolor: color,
          mt: 0.7,
        }}
      />

      <Box>
        <Typography
          sx={{color: "#FFFFFF"}}
          fontWeight={600}
        >
          {title}
        </Typography>

        <Typography
          sx={{color: "#808080"}}
          fontSize={13}
        >
          {time}
        </Typography>
      </Box>
    </Box>
  );
}

export default IncidentDetailsContent;