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
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DescriptionIcon from "@mui/icons-material/Description";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 260;

function AnalystSidebar({ open, onClose }) {
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
    bgcolor: location.pathname === path ? "#5B4CF5" : "transparent",
    "&:hover": {
      bgcolor:
        location.pathname === path
          ? "#6A5AF9"
          : "rgba(71, 53, 160, 0.43)",
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
        Security Analyst
      </Typography>

      <List>
        {/* Dashboard */}
        <ListItemButton
          sx={activeStyle("/analyst/dashboard")}
          onClick={() => {
            navigate("/analyst/dashboard");
            onClose();
          }}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* Assigned Incidents */}
        <ListItemButton
          sx={activeStyle("/analyst/assigned-incidents")}
          onClick={() => {
            navigate("/analyst/assigned-incidents");
            onClose();
          }}
        >
          <ListItemIcon>
            <AssignmentIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Assigned Incidents" />
        </ListItemButton>

        {/* Investigation */}
        <ListItemButton
          sx={activeStyle("/analyst/investigation")}
          onClick={() => {
            navigate("/analyst/investigation");
            onClose();
          }}
        >
          <ListItemIcon>
            <SearchIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Investigation" />
        </ListItemButton>

        {/* Resolution */}
        <ListItemButton
          sx={activeStyle("/analyst/resolution")}
          onClick={() => {
            navigate("/analyst/resolution");
            onClose();
          }}
        >
          <ListItemIcon>
            <TaskAltIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Resolution" />
        </ListItemButton>

        {/* Knowledge Base */}
        <ListItemButton
          sx={activeStyle("/analyst/knowledge-base")}
          onClick={() => {
            navigate("/analyst/knowledge-base");
            onClose();
          }}
        >
          <ListItemIcon>
            <MenuBookIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Knowledge Base" />
        </ListItemButton>

        {/* Article View */}
        <ListItemButton
          sx={activeStyle("/analyst/article-view")}
          onClick={() => {
            navigate("/analyst/article-view");
            onClose();
          }}
        >
          <ListItemIcon>
            <DescriptionIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Article View" />
        </ListItemButton>

        {/* Profile */}
        <ListItemButton
          sx={activeStyle("/analyst/profile")}
          onClick={() => {
            navigate("/analyst/profile");
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
            mt: 2,
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

export default AnalystSidebar;