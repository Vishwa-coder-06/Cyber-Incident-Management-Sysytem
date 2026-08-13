import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import DescriptionIcon from "@mui/icons-material/Description";

const drawerWidth = 260;

function ReporterSidebar({ open, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
  };

  const activeStyle = (path) => ({
    mx: 2,
    mt: 1,
    borderRadius: 2,
    bgcolor: location.pathname === path ? "#166b37" : "transparent",
    "&:hover": {
      bgcolor:
        location.pathname === path
          ? "#166b37"
          : "rgba(37, 146, 36, 0.35)",
    },
  });

  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          bgcolor: "#1E1E1E",
          color: "#FFFFFF",
          top: "64px",
          height: "calc(100% - 64px)",
        },
      }}
    >
      <Toolbar />

      <Typography
        sx={{
          px: 3,
          pb: 2,
          color: "#9CA3AF",
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        Reporter
      </Typography>

      <List>
        {/* Dashboard */}
        <ListItemButton
          sx={activeStyle("/reporter/dashboard")}
          onClick={() => {
            navigate("/reporter/dashboard");
            onClose();
          }}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* Report Incident */}
        <ListItemButton
          sx={activeStyle("/reporter/report-incident")}
          onClick={() => {
            navigate("/reporter/report-incident");
            onClose();
          }}
        >
          <ListItemIcon>
            <ReportProblemIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Report Incident" />
        </ListItemButton>

        {/* AI Analysis */}
        <ListItemButton
          sx={activeStyle("/reporter/ai-analysis")}
          onClick={() => {
            navigate("/reporter/ai-analysis");
            onClose();
          }}
        >
          <ListItemIcon>
            <SmartToyIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="AI Analysis" />
        </ListItemButton>

        {/* My Incidents */}
        <ListItemButton
          sx={activeStyle("/reporter/my-incidents")}
          onClick={() => {
            navigate("/reporter/my-incidents");
            onClose();
          }}
        >
          <ListItemIcon>
            <AssignmentIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="My Incidents" />
        </ListItemButton>

        {/* Incident Details */}
        <ListItemButton
          sx={activeStyle("/reporter/incident-details")}
          onClick={() => {
            navigate("/reporter/incident-details");
            onClose();
          }}
        >
          <ListItemIcon>
            <DescriptionIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Incident Details" />
        </ListItemButton>

        {/* Notifications */}
        <ListItemButton
          sx={activeStyle("/reporter/notifications")}
          onClick={() => {
            navigate("/reporter/notifications");
            onClose();
          }}
        >
          <ListItemIcon>
            <NotificationsIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItemButton>

        {/* Profile */}
        <ListItemButton
          sx={activeStyle("/reporter/profile")}
          onClick={() => {
            navigate("/reporter/profile");
            onClose();
          }}
        >
          <ListItemIcon>
            <PersonIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItemButton>

        {/* Logout */}
        <ListItemButton
          sx={{
            mx: 2,
            mt: 1,
            borderRadius: 2,
            "&:hover": {
              bgcolor: "rgba(255,255,255,0.08)",
            },
          }}
          onClick={handleLogout}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: "#EF5350" }} />
          </ListItemIcon>
          <ListItemText
            primary="Logout"
            sx={{ color: "#EF5350" }}
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
}

export default ReporterSidebar;