import { useState } from "react";

import { Box, Toolbar } from "@mui/material";

import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";

function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  return (
    <Box sx={{ display: "flex" }}>

      <Topbar
        onMenuClick={() => setOpen(true)}
      />

      <Sidebar
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

        {children}

      </Box>

    </Box>
  );
}

export default DashboardLayout;