import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";

const incidents = [
  {
    id: "INC-041",
    title: "Suspicious login from unknown IP",
    category: "Unauthorized Access",
    severity: "Critical",
    rootCause:
      "Credential compromise likely from phishing or brute-force. Login IP flagged in threat intelligence databases (Eastern Europe region).",
    advice:
      "Disable account, invalidate all sessions, force MFA re-enrollment immediately.",
    playbook: "Account Compromise Response v2.1",
  },
  {
    id: "INC-039",
    title: "Phishing email reported by employee",
    category: "Phishing",
    severity: "High",
    rootCause:
      "A suspicious email containing a malicious link was reported by an employee.",
    advice:
      "Block the sender, remove the email from affected mailboxes and reset credentials if required.",
    playbook: "Phishing Response v1.4",
  },
  {
    id: "INC-035",
    title: "Unusual data export from CRM",
    category: "Data Exfiltration",
    severity: "Medium",
    rootCause:
      "An unusually large volume of CRM data was exported outside normal business activity.",
    advice:
      "Review account activity, verify authorization and temporarily restrict export permissions.",
    playbook: "Data Exfiltration Response v2.0",
  },
];

function AIAnalysisContent() {
  const [selectedIncident, setSelectedIncident] = useState(null);

  // =========================
  // INCIDENT LIST
  // =========================

  if (!selectedIncident) {
    return (
      <Box sx={{ maxWidth: 950, mx: "auto", py: 5 }}>

        <Typography
          variant="h4"
          sx={{
            color: "#FFFFFF",
            fontWeight: 700,
          }}
        >
          AI Analysis
        </Typography>

        <Typography
          sx={{
            color: "#9CA3AF",
            mt: 0.5,
            mb: 4,
          }}
        >
          Select an incident to view its AI analysis.
        </Typography>

        {incidents.map((incident) => (
          <Paper
            key={incident.id}
            elevation={0}
            sx={{
              bgcolor: "#292929",
              border: "1px solid #444",
              borderRadius: 2,
              p: 2.5,
              mb: 2,

              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",

              "&:hover": {
                borderColor: "#5FBD85",
              },
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                #{incident.id}
              </Typography>

              <Typography
                sx={{
                  color: "#D1D5DB",
                  mt: 0.5,
                }}
              >
                {incident.title}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Chip
                label={incident.severity}
                size="small"
                sx={{
                  color:
                    incident.severity === "Critical"
                      ? "#FF5252"
                      : incident.severity === "High"
                      ? "#FF9800"
                      : "#FFC107",

                  border: "1px solid",
                  borderColor:
                    incident.severity === "Critical"
                      ? "#B71C1C"
                      : incident.severity === "High"
                      ? "#E65100"
                      : "#F9A825",

                  bgcolor: "transparent",
                }}
              />

              <Button
                variant="outlined"
                onClick={() => setSelectedIncident(incident)}
                sx={{
                  color: "#FFFFFF",
                  borderColor: "#666",

                  textTransform: "none",

                  "&:hover": {
                    borderColor: "#5FBD85",
                    bgcolor: "#5FBD8515",
                  },
                }}
              >
                View analysis
              </Button>
            </Box>
          </Paper>
        ))}
      </Box>
    );
  }

  // =========================
  // AI RESULT
  // =========================

  return (
    <Box
      sx={{
        maxWidth: 950,
        mx: "auto",
        py: 5,
      }}
    >
      {/* Heading */}

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        AI analysis result
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mt: 0.5,
          mb: 3,
        }}
      >
        #{selectedIncident.id} — {selectedIncident.title}
      </Typography>

      {/* AI Badge */}

      <Box
        sx={{
          display: "inline-block",
          bgcolor: "#382267",
          color: "#C4A7FF",
          border: "1px solid #6545A3",
          px: 3,
          py: 1.2,
          borderRadius: 1,
          mb: 3,
        }}
      >
        Analyzed by SecureOps AI
      </Box>

      {/* Category + Severity */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2.5,
          mb: 2.5,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#292929",
            border: "1px solid #444",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <Typography
            sx={{
              color: "#777",
              fontSize: 12,
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            CATEGORY
          </Typography>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {selectedIncident.category}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#351D1D",
            border: "1px solid #7F2929",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <Typography
            sx={{
              color: "#777",
              fontSize: 12,
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            SEVERITY
          </Typography>

          <Typography
            sx={{
              color: "#FF5252",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {selectedIncident.severity}
          </Typography>
        </Paper>
      </Box>

      {/* Root Cause */}

      <Paper
        elevation={0}
        sx={{
          bgcolor: "#292929",
          border: "1px solid #444",
          borderRadius: 2,
          p: 2.5,
          mb: 2.5,
        }}
      >
        <Typography
          sx={{
            color: "#777",
            fontSize: 12,
            fontWeight: 700,
            mb: 1.5,
          }}
        >
          PROBABLE ROOT CAUSE
        </Typography>

        <Typography
          sx={{
            color: "#FFFFFF",
            lineHeight: 1.6,
          }}
        >
          {selectedIncident.rootCause}
        </Typography>
      </Paper>

      {/* Advice + Playbook */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2.5,
          mb: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#292929",
            border: "1px solid #444",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <Typography
            sx={{
              color: "#777",
              fontSize: 12,
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            IMMEDIATE ADVICE
          </Typography>

          <Typography
            sx={{
              color: "#FFFFFF",
              lineHeight: 1.6,
            }}
          >
            {selectedIncident.advice}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#292929",
            border: "1px solid #444",
            borderRadius: 2,
            p: 2.5,
          }}
        >
          <Typography
            sx={{
              color: "#777",
              fontSize: 12,
              fontWeight: 700,
              mb: 1.5,
            }}
          >
            RECOMMENDED PLAYBOOK
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ArticleOutlinedIcon
              sx={{
                color: "#2196F3",
                fontSize: 19,
              }}
            />

            <Typography
              sx={{
                color: "#2196F3",
              }}
            >
              {selectedIncident.playbook}
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Buttons */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "1fr 1fr",
          },
          gap: 2.5,
        }}
      >
        <Button
          variant="outlined"
          sx={{
            color: "#FFFFFF",
            borderColor: "#666",
            py: 1.3,
            textTransform: "none",
            fontWeight: 600,

            "&:hover": {
              borderColor: "#FFFFFF",
            },
          }}
        >
          Confirm and submit to manager
        </Button>

        <Button
          variant="outlined"
          onClick={() => setSelectedIncident(null)}
          sx={{
            color: "#FFFFFF",
            borderColor: "#666",
            py: 1.3,
            textTransform: "none",
            fontWeight: 600,

            "&:hover": {
              borderColor: "#FFFFFF",
            },
          }}
        >
          Back to incidents
        </Button>
      </Box>
    </Box>
  );
}

export default AIAnalysisContent;