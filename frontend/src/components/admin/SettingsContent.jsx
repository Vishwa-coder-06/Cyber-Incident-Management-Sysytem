import {
  Grid,
  Paper,
  Typography,
  Box,
  Switch,
  TextField,
  Divider,
} from "@mui/material";

function SettingsContent() {

  return (
    <Grid container spacing={3}>

      {/* Security */}

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
            Security Settings
          </Typography>

          {/* MFA */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >

            <Box>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                Enforce MFA for all users
              </Typography>

              <Typography
                sx={{
                  color: "#9CA3AF",
                  fontSize: 14,
                }}
              >
                Require multi-factor authentication
              </Typography>

            </Box>

            <Switch defaultChecked />

          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Timeout */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >

            <Box>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                Session timeout (minutes)
              </Typography>

              <Typography
                sx={{
                  color: "#9CA3AF",
                  fontSize: 14,
                }}
              >
                Auto logout after inactivity
              </Typography>

            </Box>

            <TextField
              defaultValue="30"
              size="small"
              sx={{
                width: 70,

                "& .MuiOutlinedInput-root": {
                  bgcolor: "#374151",

                  "& fieldset": {
                    borderColor: "#444",
                  },
                },

                "& input": {
                  color: "#FFFFFF",
                  textAlign: "center",
                },
              }}
            />

          </Box>

          <Divider sx={{ my: 2 }} />

          {/* IP */}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >

            <Box>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                IP allowlist enabled
              </Typography>

              <Typography
                sx={{
                  color: "#9CA3AF",
                  fontSize: 14,
                }}
              >
                Restrict access to approved IPs
              </Typography>

            </Box>

            <Switch />

          </Box>

        </Paper>

      </Grid>

      {/* Notifications */}

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
            Notification Settings
          </Typography>

          {[
            {
              title: "Email notifications",
              desc: "Send email on assignment and resolution",
              checked: true,
            },
            {
              title: "Critical incident alerts",
              desc: "Immediately notify managers",
              checked: true,
            },
            {
              title: "Daily digest email",
              desc: "Send daily summary",
              checked: false,
            },
          ].map((item) => (

            <Box key={item.title}>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 2,
                }}
              >

                <Box>

                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#9CA3AF",
                      fontSize: 14,
                    }}
                  >
                    {item.desc}
                  </Typography>

                </Box>

                <Switch defaultChecked={item.checked} />

              </Box>

              <Divider />

            </Box>

          ))}

        </Paper>

      </Grid>

      {/* AI */}

      <Grid size={{ xs: 12, md: 6 }}>

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
            AI Analysis Settings
          </Typography>

          {[
            {
              title: "Auto analyze on submission",
              desc: "Run AI automatically",
              checked: true,
            },
            {
              title: "Auto generate KB articles",
              desc: "Generate KB after resolution",
              checked: true,
            },
            {
              title: "AI severity override",
              desc: "Allow analysts to override severity",
              checked: false,
            },
          ].map((item) => (

            <Box key={item.title}>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 2,
                }}
              >

                <Box>

                  <Typography
                    sx={{
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#9CA3AF",
                      fontSize: 14,
                    }}
                  >
                    {item.desc}
                  </Typography>

                </Box>

                <Switch defaultChecked={item.checked} />

              </Box>

              <Divider />

            </Box>

          ))}

        </Paper>

      </Grid>

      {/* System Info */}

      <Grid size={{ xs: 12, md: 6 }}>

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
            System Information
          </Typography>

          {[
            ["Version", "SecureOps v1.4.2"],
            ["Last backup", "Jun 28 · 03:00 AM"],
            ["Database", "Healthy"],
            ["AI Service", "Online"],
          ].map(([label, value], index) => (

            <Box key={label}>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 2,
                }}
              >

                <Typography sx={{color:"#9CA3AF"}}>
                  {label}
                </Typography>

                <Typography
                  sx={{
                    color:
                      value === "Healthy" || value === "Online"
                        ? "#22C55E"
                        : "#FFFFFF",
                    fontWeight: 600,
                  }}
                >
                  {value}
                </Typography>

              </Box>

              {index !== 3 && <Divider />}

            </Box>

          ))}

        </Paper>

      </Grid>

    </Grid>
  );
}

export default SettingsContent;