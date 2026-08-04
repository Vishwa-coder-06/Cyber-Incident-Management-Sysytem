import {
  Paper,
  Typography,
  Box,
  Button,
  Divider,
  Avatar,
} from "@mui/material";

import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";

const notifications = [
  {
    icon: <WarningAmberRoundedIcon />,
    color: "#E0A96D",
    title: "#INC-041 assigned to analyst",
    description:
      "Your incident has been assigned to Priya S. for investigation.",
    time: "2m ago",
  },
  {
    icon: <InfoRoundedIcon />,
    color: "#4F8EF7",
    title: "AI analysis complete",
    description:
      "#INC-041 was analyzed — severity: Critical.",
    time: "18m ago",
  },
  {
    icon: <CheckRoundedIcon />,
    color: "#4CAF50",
    title: "#INC-035 resolved",
    description:
      "Your incident has been resolved. A KB article was created.",
    time: "2h ago",
  },
  {
    icon: <InfoRoundedIcon />,
    color: "#4F8EF7",
    title: "System maintenance scheduled",
    description:
      "Portal maintenance window: Jun 30, 02:00–04:00 AM.",
    time: "1d ago",
  },
];

function NotificationsContent() {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#2B2B2B",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography
          variant="h6"
         sx={{color: "#FFFFFF", fontWeight: 600}}
        >
          All notifications
        </Typography>

        <Button
          variant="outlined"
          sx={{
            color: "#FFFFFF",
            borderColor: "#555555",
            textTransform: "none",

            "&:hover": {
              borderColor: "#1565C0",
            },
          }}
        >
          Mark all read
        </Button>
      </Box>

      {notifications.map((item, index) => (

  <Box key={index}>

    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        py: 2,
      }}
    >

      {/* Left */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >

        <Avatar
          sx={{
            bgcolor: item.color,
            width: 34,
            height: 34,
          }}
        >
          {item.icon}
        </Avatar>

        <Box>

          <Typography
            sx={{
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: 16,
            }}
          >
            {item.title}
          </Typography>

          <Typography
            sx={{
              color: "#9CA3AF",
              fontSize: 14,
              mt: 0.5,
            }}
          >
            {item.description}
          </Typography>

        </Box>

      </Box>

      {/* Right */}

      <Typography
        sx={{
          color: "#808080",
          fontSize: 13,
          textAlign: "right",
          minWidth: 60,
        }}
      >
        {item.time}
      </Typography>

    </Box>

    {index !== notifications.length - 1 && (
      <Divider
        sx={{
          borderColor: "#3A3A3A",
        }}
      />
    )}

  </Box>

))}
    </Paper>
  );
}

export default NotificationsContent;