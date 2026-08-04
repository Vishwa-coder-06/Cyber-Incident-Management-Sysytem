import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Stack,
  Button,
} from "@mui/material";

import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";

function ArticleViewContent() {
  const steps = [
    {
      title: "Immediately disable the affected account",
      desc: "Use the IAM portal or AD console",
    },
    {
      title: "Invalidate all active sessions",
      desc: "Force token expiry across all services",
    },
    {
      title: "Review auth logs for lateral movement",
      desc: "Check SIEM for 72-hour window around the event",
    },
    {
      title: "Reset credentials and enforce MFA",
      desc: "",
    },
  ];

  return (
    <Grid container spacing={3}>

      {/* LEFT */}

      <Grid size={{ xs: 12, md: 8 }}>

        <Paper
          sx={{
            bgcolor: "#2D2D2D",
            p: 3,
            borderRadius: 2,
          }}
        >

          <Stack direction="row" spacing={1} mb={4} mx={4} >
            <Chip label="auth" sx={{color:"#fff",bgcolor:"#211"}} />
            <Chip label="unauthorized-access" sx={{color:"#fff",bgcolor:"#211"}}/>
            <Chip label="credential" sx={{color:"#fff",bgcolor:"#211"}} />
            <Chip label="mfa"sx={{color:"#fff",bgcolor:"#211"}} />
          </Stack>

          <Typography
            variant="h5"
            color="white"
            fontWeight={700}
            mb={2}
            sx={{color:"#ffffff"}}
          >
            Overview
          </Typography>

          <Typography sx={{color:"#CFCFCF",mb:5}}>
            This article covers the standard response procedure when an
            unauthorized login is detected. It is auto-generated from
            incident #INC-041 (Jun 28, 2026).
          </Typography>

          <Typography sx={{
            color:"#fff",
            mb:3
          }}
          variant="h5"
          fontWeight={700}
          >
            Response Steps
          </Typography>

          {steps.map((step, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                mb: 4,
              }}
            >
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  bgcolor: "#2962FF",
                  color: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  mr: 3,
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </Box>

              <Box>

                <Typography
                  sx={{color:"#fff",
                  fontWeight:700
                  }}>
                  {step.title}
                </Typography>

                <Typography sx={{color:"#9CA3AF"}}>
                  {step.desc}
                </Typography>

              </Box>
            </Box>
          ))}

        </Paper>

      </Grid>

      {/* RIGHT */}

      <Grid size={{ xs: 12, md: 4 }}>

        <Paper
          sx={{
            bgcolor: "#2D2D2D",
            p: 3,
            borderRadius: 2,
            mb: 3,
          }}
        >

          <Typography sx={{
            variant:"h6",
            color:"#fff",
            fontWeight:700,
            mb:3
          }}
          >
            Article Details
          </Typography>

          <Typography sx={{color:"#888"}}>
            Created from
          </Typography>

          <Typography sx={{color:"#fff",mb:2}}>
            #INC-041
          </Typography>

          <Typography sx={{color:"#888"}}>
            Author
          </Typography>

          <Typography sx={{color:"#fff",mb:2}}>
            Priya S.
          </Typography>

          <Typography sx={{color:"#888"}}>
            Date
          </Typography>

          <Typography sx={{color:"#fff",mb:2}}>
            Jun 28, 2026
          </Typography>

          <Typography sx={{color:"#888"}}>
            Views
          </Typography>

          <Typography sx={{color:"#fff",mb:2}}>
            142
          </Typography>

          <Typography sx={{color:"#888"}}>
            Helpful votes
          </Typography>

          <Typography sx={{color:"#fff",mb:2}}>
            38
          </Typography>

        </Paper>

        <Paper
          sx={{
            bgcolor: "#2D2D2D",
            p: 3,
            borderRadius: 2,
          }}
        >

          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
            sx={{color:"#fff"}}
          >
            Related Playbook
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            mb={4}
          >
            <DescriptionIcon
              sx={{
                color: "#4EA1FF",
                mr: 1,
              }}
            />

            <Typography sx={{color:"#4EA1FF"}}>
              Account Compromise Response v2.1
            </Typography>
          </Box>

          <Stack direction="row" spacing={2}>

            <Button
              fullWidth
              variant="contained"
              startIcon={<EditIcon />}
              sx={{
                bgcolor: "#424242",
                textTransform: "none",
              }}
            >
              Edit
            </Button>

            <Button
              fullWidth
              variant="contained"
              startIcon={<ShareIcon />}
              sx={{
                bgcolor: "#424242",
                textTransform: "none",
              }}
            >
              Share
            </Button>

          </Stack>

        </Paper>

      </Grid>

    </Grid>
  );
}

export default ArticleViewContent;