import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
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

function AnalystTopbar({
  onMenuClick,
  username = "Analyst",
  role = "Security Analyst",
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
      elevation={1}
      sx={{
        bgcolor: "#5B4CF5",
        color: "#111827",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <Toolbar sx={{ minHeight: 64, height: 64 }}>

        <IconButton color="inherit" edge="start" onClick={onMenuClick}>
          <MenuIcon />
        </IconButton>

        <SecurityIcon sx={{ color: "#42A5F5", mx: 1 }} />

        <Typography variant="h6" sx={{ fontWeight: "bold", color: "#fff" }}>
          SecureOps
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <IconButton color="inherit" onClick={() => navigate("/analyst/assigned-incidents")}>
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
          onClick={() => navigate("/analyst/profile")}
        >
          <UserAvatar user={user} size={36} sx={{ bgcolor: "rgba(255,255,255,0.25)" }} />
          <Box sx={{ ml: 1 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#fff", lineHeight: 1.2 }}>
              {displayName}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
              {user?.role ?? role}
            </Typography>
          </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default AnalystTopbar;