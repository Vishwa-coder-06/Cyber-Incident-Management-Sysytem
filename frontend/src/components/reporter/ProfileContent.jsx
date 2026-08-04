import {
  Grid,
  Paper,
  Avatar,
  Box,
  Typography,
  TextField,
  Button,
  Switch,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckIcon from "@mui/icons-material/Check";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function ProfileContent() {
  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#1E1E1E",

      "& fieldset": {
        borderColor: "#444",
      },

      "&:hover fieldset": {
        borderColor: "#1565C0",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1565C0",
      },
    },

    "& input": {
      color: "#FFFFFF",
    },
  };

  return (
    <Grid container spacing={3}>

      {/* LEFT */}

      <Grid size={{ xs: 12, md: 5 }}>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            borderRadius: 2,
            p: 4,
            textAlign: "center",
          }}
        >

          <Avatar
            sx={{
              width: 96,
              height: 96,
              bgcolor: "#1E4DB7",
              fontSize: 42,
              mx: "auto",
              mb: 3,
            }}
          >
            JD
          </Avatar>

          <Typography
            variant="h5"
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
            }}
          >
            John Doe
          </Typography>

          <Typography
            sx={{
              color: "#9CA3AF",
              mt: 1,
            }}
          >
            Reporter · Security Team
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 6,
              mt: 4,
              mb: 4,
            }}
          >

            <Box textAlign="center">

              <AssignmentIcon sx={{ color: "#9CA3AF" }} />

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                }}
              >
                12 incidents
              </Typography>

            </Box>

            <Box textAlign="center">

              <CheckIcon sx={{ color: "#9CA3AF" }} />

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                }}
              >
                8 resolved
              </Typography>

            </Box>

          </Box>

          <Button
            fullWidth
            variant="outlined"
            sx={{
              color: "#FFFFFF",
              borderColor: "#555",
              textTransform: "none",
              height: 46,

              "&:hover": {
                borderColor: "#1565C0",
              },
            }}
          >
            Edit profile photo
          </Button>

          <KeyboardArrowDownIcon
            sx={{
              color: "#6B7280",
              mt: 4,
              fontSize: 34,
            }}
          />

        </Paper>

      </Grid>

      {/* RIGHT */}

      <Grid size={{ xs: 12, md: 7 }}>

        {/* Personal Information */}

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            borderRadius: 2,
            p: 3,
            mb: 3,
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
            Personal Information
          </Typography>

          <Typography color="#FFFFFF" mb={1}>
            Full name
          </Typography>

          <TextField
            fullWidth
            defaultValue="John Doe"
            sx={{
              ...inputStyle,
              mb: 3,
            }}
          />

          <Typography color="#FFFFFF" mb={1}>
            Email address
          </Typography>

          <TextField
            fullWidth
            defaultValue="john.doe@company.com"
            sx={{
              ...inputStyle,
              mb: 3,
            }}
          />

          <Typography color="#FFFFFF" mb={1}>
            Department
          </Typography>

          <TextField
            fullWidth
            defaultValue="Security Team"
            sx={{
              ...inputStyle,
              mb: 4,
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
            }}
          >

            <Button
              fullWidth
              variant="outlined"
              sx={{
                color: "#FFFFFF",
                borderColor: "#555",
                textTransform: "none",
              }}
            >
              Cancel
            </Button>

            <Button
              fullWidth
              variant="contained"
              sx={{
                bgcolor: "#4CAF50",
                textTransform: "none",

                "&:hover": {
                  bgcolor: "#43A047",
                },
              }}
            >
              Save Changes
            </Button>

          </Box>

        </Paper>

        {/* Notification Preferences */}

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            borderRadius: 2,
            p: 3,
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
            Notification Preferences
          </Typography>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >

            <Box>

              <Typography
                color="#FFFFFF"
                fontWeight={600}
              >
                Incident status updates
              </Typography>

              <Typography
                color="#9CA3AF"
                fontSize={14}
              >
                Email when your incident status changes
              </Typography>

            </Box>

            <Switch defaultChecked />

          </Box>

          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >

            <Box>

              <Typography
                color="#FFFFFF"
                fontWeight={600}
              >
                AI analysis complete
              </Typography>

              <Typography
                color="#9CA3AF"
                fontSize={14}
              >
                Notify when AI finishes analyzing
              </Typography>

            </Box>

            <Switch defaultChecked />

          </Box>

        </Paper>

      </Grid>

    </Grid>
  );
}

export default ProfileContent;