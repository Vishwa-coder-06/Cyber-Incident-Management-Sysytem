import {
  Drawer,
  Toolbar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MailIcon from "@mui/icons-material/Mail";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 260;

function ManagerSidebar({ open, onClose }) {

  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      text: "Dashboard",
      icon: <DashboardIcon />,
      path: "/manager/dashboard",
    },
    {
      text: "Incident Queue",
      icon: <MailIcon />,
      path: "/manager/incident-queue",
    },
    {
      text: "Assign Incident",
      icon: <PersonAddAlt1Icon />,
      path: "/manager/assign-incident",
    },
    {
      text: "Workload",
      icon: <AssessmentIcon />,
      path: "/manager/workload",
    },
  ];

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
        Incident Manager
      </Typography>

      <List>

        {menuItems.map((item) => (

          <ListItemButton
            key={item.text}
            selected={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              onClose();
            }}
            sx={{
              mx: 2,
              mb: 1,
              borderRadius: 2,

              "&.Mui-selected": {
                bgcolor: "#6C3CE9",
              },

              "&.Mui-selected:hover": {
                bgcolor: "#6C3CE9",
              },

              "&:hover": {
                bgcolor: "#6d3ce98d",
              },
            }}
          >

            <ListItemIcon
              sx={{
                color: "#FFFFFF",
              }}
            >
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.text} />

          </ListItemButton>

        ))}

        <ListItemButton
          onClick={() => navigate("/login")}
          sx={{
            mx: 2,
            mt: 2,
            borderRadius: 2,

            "&:hover": {
              bgcolor: "#333333",
            },
          }}
        >

          <ListItemIcon>
            <LogoutIcon sx={{ color: "#EF5350" }} />
          </ListItemIcon>

          <ListItemText
            primary="Logout"
            sx={{
              color: "#EF5350",
            }}
          />

        </ListItemButton>

      </List>

    </Drawer>
  );
}

export default ManagerSidebar;