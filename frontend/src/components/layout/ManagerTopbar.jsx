import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Avatar,
  Badge,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SecurityIcon from "@mui/icons-material/Security";

import { useState, useEffect } from "react";
import { getUnreadCount } from "../../services/notificationService";

import { useAuth } from "../../contexts/AuthContext";
import UserAvatar from "../common/UserAvatar";

function ManagerTopbar({
  onMenuClick,
  username = "Manager",
  role = "Incident Manager",
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const displayName = user?.firstName
    ? `${user.firstName} ${user.lastName ?? ""}`.trim()
    : user?.username ?? username;

  useEffect(() => {
    getUnreadCount()
      .then((count) => setUnreadCount(typeof count === "number" ? count : 0))
      .catch(() => setUnreadCount(0));
  }, []);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{ bgcolor: "#6C3CE9" }}
    >
      <Toolbar>

        <IconButton color="inherit" edge="start" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>

        <SecurityIcon sx={{ ml: 2, mr: 1 }} />

        <Typography variant="h5" fontWeight={700}>
          SecureOps
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit" onClick={() => navigate("/manager/incident-queue")}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* Clickable avatar + name → profile */}
        <Box
          sx={{
            display: "flex", alignItems: "center", cursor: "pointer", ml: 1,
            borderRadius: 2, px: 1, py: 0.5,
            "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
            transition: "background 0.2s",
          }}
          onClick={() => navigate("/manager/profile")}
        >
          <UserAvatar user={user} size={36} sx={{ bgcolor: "#8E6FF7" }} />
          <Box ml={1}>
            <Typography color="white" sx={{ lineHeight: 1.2, fontWeight: 600, fontSize: 14 }}>
              {displayName}
            </Typography>
            <Typography variant="body2" sx={{ color: "#D1D5DB", fontSize: 12 }}>
              {user?.role ?? role}
            </Typography>
          </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default ManagerTopbar;