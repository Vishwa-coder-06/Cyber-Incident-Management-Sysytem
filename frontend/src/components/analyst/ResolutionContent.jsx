import {
  Grid,
  Paper,
  Typography,
  TextField,
  Checkbox,
  FormControlLabel,
  Chip,
  Button,
  Box,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

function ResolutionContent() {
  return (
    <Grid container spacing={3}>

      {/* LEFT */}

      <Grid size={{ xs: 12, md: 6 }}>

        {/* Resolution Steps */}

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
            Resolution steps
          </Typography>

          {[
            {
              step: "Account disabled and sessions invalidated",
              time: "Completed Jun 28 · 10:02",
              done: true,
            },
            {
              step: "Audit logs reviewed — no lateral movement found",
              time: "Completed Jun 28 · 10:45",
              done: true,
            },
            {
              step: "Password reset and MFA enforced",
              time: "Completed Jun 28 · 11:10",
              done: true,
            },
            {
              step: "Stakeholders notified",
              time: "Pending",
              done: false,
            },
          ].map((item, index) => (
            <Box
              key={index}
              display="flex"
              gap={2}
              mb={3}
            >
              <Box
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  bgcolor: item.done ? "#1565C0" : "#555",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "#FFF",
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </Box>

              <Box>

                <Typography
                  sx={{color:"#FFFFFF",
                  fontWeight:600}}
                >
                  {item.step}
                </Typography>

                <Typography
                  sx={{color:"#9CA3AF",
                  fontSize:13}}
                >
                  {item.time}
                </Typography>

              </Box>

            </Box>
          ))}
        </Paper>

        {/* Summary */}

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
            Resolution summary
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Write a summary of what was done and how it was resolved..."
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#1E1E1E",

                "& fieldset": {
                  borderColor: "#444",
                },

                "&:hover fieldset": {
                  borderColor: "#6750F5",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "#6750F5",
                },
              },

              "& textarea": {
                color: "#FFFFFF",
              },

              "& textarea::placeholder": {
                color: "#9CA3AF",
                opacity: 1,
              },
            }}
          />

          <Box textAlign="center" mt={2}>
            <KeyboardArrowDownIcon
              sx={{
                color: "#777",
                fontSize: 34,
              }}
            />
          </Box>

        </Paper>

      </Grid>

      {/* RIGHT */}

      <Grid size={{ xs: 12, md: 6 }}>

        {/* KB */}

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
            Convert to KB article
          </Typography>

          <Typography sx={{color:"#9CA3AF",mb:1}}>
            Article title
          </Typography>

          <TextField
            fullWidth
            defaultValue="Responding to unauthorized access"
            sx={{
              mb: 3,

              "& .MuiOutlinedInput-root": {
                bgcolor: "#1E1E1E",

                "& fieldset": {
                  borderColor: "#444",
                },
              },

              "& input": {
                color: "#FFFFFF",
              },
            }}
          />

          <Typography sx={{ color:"#9CA3AF",mb:1}}>
            Tags
          </Typography>

          <Box mb={3}>

            <Chip
              label="auth"
              sx={{
                color:"#ffffff",
                mr: 1,
                mb: 1,
              }}
            />

            <Chip
              label="unauthorized-access"
              sx={{
                color:"#ffffff",
                mr: 1,
                mb: 1,
              }}
            />

            <Chip
              label="credential"
              sx={{
                color:"#ffffff",
                mb: 1,
              }}
            />

          </Box>

          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Auto-generate KB article from resolution"
            sx={{
              color: "#FFFFFF",
            }}
          />

          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 3,
              color: "#FFFFFF",
              borderColor: "#555",
              textTransform: "none",
            }}
          >
            Close incident and save
          </Button>

        </Paper>

        {/* Ready */}

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#174F23",
            borderRadius: 2,
            p: 3,
          }}
        >

          <Box
            display="flex"
            alignItems="center"
            gap={2}
          >

            <CheckCircleIcon
              sx={{
                color: "#4ADE80",
              }}
            />

            <Box>

              <Typography
                color="#4ADE80"
                fontWeight={700}
              >
                Ready to close
              </Typography>

              <Typography
                color="#C8E6C9"
                fontSize={14}
              >
                All required steps completed. Closing will notify all stakeholders and generate a KB article.
              </Typography>

            </Box>

          </Box>

        </Paper>

      </Grid>

    </Grid>
  );
}

export default ResolutionContent;