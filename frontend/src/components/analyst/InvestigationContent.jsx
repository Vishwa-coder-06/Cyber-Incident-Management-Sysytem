import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from "@mui/material";

import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import InvestigationEvidenceUpload from "./InvestigationEvidenceUpload";

function InvestigationContent() {

  return (

    <Grid container spacing={3}>

      {/* LEFT */}

      <Grid size={{ xs: 12, md: 8 }}>

        {/* Notes */}

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
            sx={{
              color: "#FFFFFF",
              mb: 3,
              fontWeight: 700,
            }}
          >
            Investigation notes
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={6}
            placeholder="Add your findings, observations, and evidence here..."
            sx={{
              mb: 3,

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

          <Box display="flex" gap={2}>

            <InvestigationEvidenceUpload/>

            <Button
              variant="outlined"
              sx={{
                color: "#FFFFFF",
                borderColor: "#555",
                textTransform: "none",
                 my:1,
              }}
            >
              Save note
            </Button>

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
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
              mb: 3,
            }}
          >
            Activity timeline
          </Typography>

          {[
            {
              title: "Incident submitted by reporter",
              time: "Jun 28 · 09:12",
              color: "#4CAF50",
            },
            {
              title: "AI analysis completed — Critical severity",
              time: "Jun 28 · 09:13",
              color: "#4CAF50",
            },
            {
              title: "Assigned to analyst — Investigation in progress",
              time: "Jun 28 · 09:45",
              color: "#2196F3",
            },
            {
              title: "Resolution pending",
              time: "",
              color: "#757575",
            },
          ].map((item) => (

            <Box
              key={item.title}
              sx={{
                display: "flex",
                color:"#ffffff",
                mb: 4,
              }}
            >

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  mr: 2,
                }}
              >

                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    bgcolor: item.color,
                  }}
                />

                <Box
                  sx={{
                    width: 2,
                    flex: 1,
                    bgcolor: "#444",
                    mt: 1,
                  }}
                />

              </Box>

              <Box>

                <Typography
                  color="#FFFFFF"
                  fontWeight={600}
                >
                  {item.title}
                </Typography>

                <Typography color="#9CA3AF">
                  {item.time}
                </Typography>

              </Box>

            </Box>

          ))}

        </Paper>

      </Grid>

      {/* RIGHT */}

      <Grid size={{ xs: 12, md: 4 }}>

        {/* Quick Actions */}

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
            sx={{
              color: "#FFFFFF",
              mb: 3,
              fontWeight: 700,
            }}
          >
            Quick actions
          </Typography>

          {[
            "Mark resolved",
            "Escalate",
            "Request info",
          ].map((btn) => (

            <Button
              key={btn}
              fullWidth
              variant="outlined"
              sx={{
                mb: 2,
                color: "#FFFFFF",
                borderColor: "#555",
                textTransform: "none",
              }}
            >
              {btn}
            </Button>

          ))}

        </Paper>

        {/* Playbook */}

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
            sx={{
              color: "#FFFFFF",
              mb: 2,
              fontWeight: 700,
            }}
          >
            AI playbook
          </Typography>

          <Typography sx={{color:"#dedede",mb:2}}>
            Account Compromise v2.1
          </Typography>

          {[
            "Disable account",
            "Invalidate sessions",
            "Check audit logs",
            "Notify stakeholders",
            "Document findings",
          ].map((step, index) => (

            <Typography
              key={step}
              sx={{
                color: "#9CA3AF",
                mb: 1.5,
              }}
            >
              {index + 1}. {step}
            </Typography>

          ))}

        </Paper>

      </Grid>

    </Grid>

  );
}

export default InvestigationContent;