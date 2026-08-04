import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SearchIcon from "@mui/icons-material/Search";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import DescriptionIcon from "@mui/icons-material/Description";

const drawerWidth = 260;

function AnalystSidebar({ open, onClose }) {
  const navigate = useNavigate();

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
          onClick={() => {
            navigate("/analyst/dashboard");
            onClose();
          }}
          sx={{
            mx: 2,
            borderRadius: 2,
            bgcolor: "#5B4CF5",

            "&:hover": {
              bgcolor: "#6A5AF9",
            },
          }}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>

          <ListItemText primary="Dashboard" />
        </ListItemButton>

        {/* Assigned Incidents */}

        <ListItemButton
          onClick={() => {
            navigate("/analyst/assigned-incidents");
            onClose();
          }}
          sx={{ mx: 2, mt: 1 }}
        >
          <ListItemIcon>
            <AssignmentIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>

          <ListItemText primary="Assigned Incidents" />
        </ListItemButton>

        {/* Investigation */}

        <ListItemButton
          onClick={() => {
            navigate("/analyst/investigation");
            onClose();
          }}
          sx={{ mx: 2 }}
        >
          <ListItemIcon>
            <SearchIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>

          <ListItemText primary="Investigation" />
        </ListItemButton>

        {/* Resolution */}

        <ListItemButton
          onClick={() => {
            navigate("/analyst/resolution");
            onClose();
          }}
          sx={{ mx: 2 }}
        >
          <ListItemIcon>
            <TaskAltIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>

          <ListItemText primary="Resolution" />
        </ListItemButton>

        {/* Knowledge Base */}

        <ListItemButton
          onClick={() => {
            navigate("/analyst/knowledge-base");
            onClose();
          }}
          sx={{ mx: 2 }}
        >
          <ListItemIcon>
            <MenuBookIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>

          <ListItemText primary="Knowledge Base" />
        </ListItemButton>

        {/* Article View */}

        <ListItemButton
          onClick={() => {
            navigate("/analyst/article-view");
            onClose();
          }}
          sx={{ mx: 2 }}
        >
          <ListItemIcon>
            <DescriptionIcon sx={{ color: "#FFFFFF" }} />
          </ListItemIcon>

          <ListItemText primary="Article View" />
        </ListItemButton>

      </List>
    </Drawer>
  );
}

export default AnalystSidebar;