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
import GroupIcon from "@mui/icons-material/Group";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SchoolIcon from "@mui/icons-material/School";
import AssessmentIcon from "@mui/icons-material/Assessment";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonIcon from "@mui/icons-material/Person";

const drawerWidth = 260;

function AdminSidebar({ open, onClose }) {
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

    bgcolor:
      location.pathname === path ? "#C62828" : "transparent",

    "&:hover": {
      bgcolor:
        location.pathname === path
          ? "#D32F2F"
          : "rgba(241, 21, 21, 0.38)",
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
        Administrator
      </Typography>

      <List>

        {/* Dashboard */}

        <ListItemButton
          sx={activeStyle("/admin/dashboard")}
          onClick={() => {
            navigate("/admin/dashboard");
            onClose();
          }}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* User Management */}

        <ListItemButton
          sx={activeStyle("/admin/user-management")}
          onClick={() => {
            navigate("/admin/user-management");
            onClose();
          }}
        >
          <ListItemIcon>
            <GroupIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="User Management" />
        </ListItemButton>

        {/* Playbooks */}

        <ListItemButton
          sx={activeStyle("/admin/playbooks")}
          onClick={() => {
            navigate("/admin/playbooks");
            onClose();
          }}
        >
          <ListItemIcon>
            <MenuBookIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Playbooks" />
        </ListItemButton>

        {/* Knowledge Base */}

        <ListItemButton
          sx={activeStyle("/admin/knowledge-base-mgmt")}
          onClick={() => {
            navigate("/admin/knowledge-base-mgmt");
            onClose();
          }}
        >
          <ListItemIcon>
            <SchoolIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Knowledge Base" />
        </ListItemButton>

        {/* Reports */}

        <ListItemButton
          sx={activeStyle("/admin/reports")}
          onClick={() => {
            navigate("/admin/reports");
            onClose();
          }}
        >
          <ListItemIcon>
            <AssessmentIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Reports" />
        </ListItemButton>

        {/* Audit Logs */}

        <ListItemButton
          sx={activeStyle("/admin/audit-logs")}
          onClick={() => {
            navigate("/admin/audit-logs");
            onClose();
          }}
        >
          <ListItemIcon>
            <ReceiptLongIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>
          <ListItemText primary="Audit Logs" />
        </ListItemButton>

        {/* System Settings — UNDER DEVELOPMENT: hidden from nav, code preserved */}

        {/* Profile */}

        <ListItemButton
          sx={activeStyle("/admin/profile")}
          onClick={() => {
            navigate("/admin/profile");
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
          <ListItemText primary="Logout" sx={{ color: "#EF5350" }} />
        </ListItemButton>

      </List>
    </Drawer>
  );
}

export default AdminSidebar;