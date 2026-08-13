import { useState } from "react";
import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Topbar from "../components/layout/AdminTopbar";
import Sidebar from "../components/layout/AdminSidebar";
import { useAuth } from "../contexts/AuthContext";

function AdminLayout() {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <Box sx={{ display: "flex" }}>
      <Topbar
        onMenuClick={() => setOpen(true)}
        username={user?.username ?? "Admin"}
        role={user?.role ?? "Administrator"}
      />
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default AdminLayout;