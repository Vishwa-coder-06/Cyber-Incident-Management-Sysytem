import {
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import AssignmentIcon from "@mui/icons-material/Assignment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 260;

function Sidebar({ open, onClose }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      variant="temporary"
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,

          bgcolor: "#1E1E1E",
          color: "white",
          top:"64px",
          height:"card(100%-64px)",
        },
      }}
    >
      <Toolbar />

      <List>

        <ListItemButton>
          <ListItemIcon>
            <DashboardIcon sx={{ color: "white" }} />
          </ListItemIcon>

          <ListItemText primary="Dashboard" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <ReportProblemIcon sx={{ color: "white" }} />
          </ListItemIcon>

          <ListItemText primary="Report Incident" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <SmartToyIcon sx={{ color: "white" }} />
          </ListItemIcon>

          <ListItemText primary="AI Analysis" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <AssignmentIcon sx={{ color: "white" }} />
          </ListItemIcon>

          <ListItemText primary="My Incidents" />
        </ListItemButton>

        <Divider sx={{ bgcolor: "#333" }} />

        <ListItemButton>
          <ListItemIcon>
            <NotificationsIcon sx={{ color: "white" }} />
          </ListItemIcon>

          <ListItemText primary="Notifications" />
        </ListItemButton>

        <ListItemButton>
          <ListItemIcon>
            <PersonIcon sx={{ color: "white" }} />
          </ListItemIcon>

          <ListItemText primary="Profile" />
        </ListItemButton>

        <Divider sx={{ bgcolor: "#333" }} />

        <ListItemButton>
          <ListItemIcon>
            <LogoutIcon sx={{ color: "#EF5350" }} />
          </ListItemIcon>

          <ListItemText primary="Logout" />
        </ListItemButton>

      </List>

    </Drawer>
  );
}

export default Sidebar;