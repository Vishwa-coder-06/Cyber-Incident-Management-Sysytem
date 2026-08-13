import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import ManagerTopbar from "../components/layout/ManagerTopbar";
import ManagerSidebar from "../components/layout/ManagerSidebar";
import { useAuth } from "../contexts/AuthContext";

function ManagerLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      <ManagerTopbar
        onMenuClick={() => setOpen(true)}
        username={user?.username ?? "Manager"}
        role={user?.role ?? "Incident Manager"}
      />
      <ManagerSidebar open={open} onClose={() => setOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default ManagerLayout;