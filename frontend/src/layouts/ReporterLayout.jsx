import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Topbar from "../components/layout/ReporterTopbar";
import Sidebar from "../components/layout/ReporterSidebar";
import { useAuth } from "../contexts/AuthContext";

function ReporterLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar
        onMenuClick={() => setOpen(true)}
        username={user?.username ?? "Reporter"}
        role={user?.role ?? "Reporter"}
      />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default ReporterLayout;