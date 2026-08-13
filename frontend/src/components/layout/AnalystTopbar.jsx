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

function AnalystTopbar({
  onMenuClick,
  username = "Analyst",
  role = "Security Analyst",
}) {
  const navigate = useNavigate();

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

        <IconButton color="inherit">
          <Badge badgeContent={0} color="error">
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
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.25)", color: "#fff", width: 36, height: 36, fontSize: 15, fontWeight: 700 }}>
            {username.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)}
          </Avatar>
          <Box sx={{ ml: 1 }}>
            <Typography variant="body2" fontWeight="bold" sx={{ color: "#fff", lineHeight: 1.2 }}>
              {username}
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.7)" }}>
              {role}
            </Typography>
          </Box>
        </Box>

      </Toolbar>
    </AppBar>
  );
}

export default AnalystTopbar;