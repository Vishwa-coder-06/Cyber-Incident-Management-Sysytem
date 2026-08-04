import { useState } from "react";

import { Box, Toolbar } from "@mui/material";

import { Outlet } from "react-router-dom";

import ManagerTopbar from "../components/layout/ManagerTopbar";
import ManagerSidebar from "../components/layout/ManagerSidebar";

function ManagerLayout() {

  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>

      <ManagerTopbar
        onMenuClick={() => setOpen(true)}
      />

      <ManagerSidebar
        open={open}
        onClose={() => setOpen(false)}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
        }}
      >
        <Toolbar />

        <Outlet />

      </Box>

    </Box>
  );
}

export default ManagerLayout;