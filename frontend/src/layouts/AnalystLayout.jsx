import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Topbar from "../components/layout/AnalystTopbar";
import Sidebar from "../components/layout/AnalystSidebar";
import { useAuth } from "../contexts/AuthContext";

function AnalystLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar
        onMenuClick={() => setOpen(true)}
        username={user?.username ?? "Analyst"}
        role={user?.role ?? "Security Analyst"}
      />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default AnalystLayout;