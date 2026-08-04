import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Badge,
  Box,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";

function ManagerTopbar({
  onMenuClick,
  username = "Vishwa",
  role = "Incident Manager",
}) {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: "#6C3CE9",
      }}
    >
      <Toolbar>

        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

        <SecurityIcon
          sx={{
            ml: 2,
            mr: 1,
          }}
        />

        <Typography
          variant="h5"
          fontWeight={700}
        >
          SecureOps
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit">
          <Badge
            badgeContent={4}
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <Avatar
          sx={{
            bgcolor: "#8E6FF7",
            ml: 2,
          }}
        >
          V
        </Avatar>

        <Box ml={2}>
          <Typography color="white">
            {username}
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#D1D5DB",
            }}
          >
            {role}
          </Typography>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default ManagerTopbar;