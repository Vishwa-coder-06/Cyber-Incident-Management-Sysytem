import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Box,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";
import { colors } from "../../theme/colors";
function AnalystTopbar({
  onMenuClick,
  username = "Vishwa",
  role = "Security Analyst",
}) {
  return (
   <AppBar
      position="fixed"
      elevation={1}
      sx={{
        bgcolor: "#5B4CF5",
        color: "#111827",
       borderBottom: "1px solid #e5e7eb",
     }}
    >
      <Toolbar  sx={{
    minHeight: 64,
    height: 64,
  }}>

        {/* Menu Button */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <SecurityIcon
          sx={{
            color: "#42A5F5",
            mx: 1,
          }}
        />

        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
          }}
        >
          SecureOps
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {/* Notification */}
        <IconButton color="inherit">
          <Badge badgeContent={4} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Avatar */}
        <Avatar
          sx={{
            ml: 2,
            bgcolor: "primary.main",
          }}
        >
          {username.charAt(0)}
        </Avatar>

        <Box sx={{ ml: 1 }}>
          <Typography variant="body2" fontWeight="bold">
            {username}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: "grey.400",
            }}
          >
            {role}
          </Typography>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default AnalystTopbar;