import { Paper, TextField, Grid, Typography,Box } from "@mui/material";
import EvidenceUpload from "./EvidenceUpload";
import ReportIncidentActions from "./ReportIncidentActions";

function ReportIncidentForm() {
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#2D2D2D",
      borderRadius: 2,

      "& fieldset": {
        borderColor: "#555555",
      },

      "&:hover fieldset": {
        borderColor: "#1565C0",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1565C0",
        borderWidth: 2,
      },
    },

    "& input": {
      color: "#FFFFFF",
    },

    "& textarea": {
      color: "#FFFFFF",
    },

    "& input::placeholder": {
      color: "#9CA3AF",
      opacity: 1,
    },

    "& textarea::placeholder": {
      color: "#9CA3AF",
      opacity: 1,
    },
  };

  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#1E1E1E",
        p: 4,
        borderRadius: 2,
      }}
    >
      <Grid container spacing={3}>
        {/* Incident Title */}

        <Grid size={12}>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Incident title
          </Typography>

          <TextField
            fullWidth
            placeholder="Brief description of what happened"
            sx={inputStyle}
          />
        </Grid>

        {/* Affected System */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Affected system
          </Typography>

          <TextField
            fullWidth
            placeholder="e.g. CRM Server"
            sx={inputStyle}
          />
        </Grid>

        {/* Date & Time */}

        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Date & time of incident
          </Typography>

          <TextField
            fullWidth
            type="datetime-local"
            sx={inputStyle}
          />
        </Grid>

        {/* Description */}

        <Grid size={12}>
          <Typography
            sx={{
              color: "#FFFFFF",
              fontSize: 15,
              fontWeight: 600,
              mb: 1,
            }}
          >
            Description
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Describe what you observed and any steps already taken..."
            sx={inputStyle}
          />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <EvidenceUpload />
    </Box>

      <Box sx={{ mt: 2 }}>
        <ReportIncidentActions />
    </Box>
    </Paper>
  );
}

export default ReportIncidentForm;