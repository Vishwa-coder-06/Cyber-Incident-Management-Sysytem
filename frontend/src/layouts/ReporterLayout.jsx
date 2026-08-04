import { useState } from "react";

import { Box, Toolbar } from "@mui/material";
import { Outlet } from "react-router-dom";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";

function ReporterLayout({ children }) {
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

          <Outlet/>

      </Box>

    </Box>
  );
}

export default ReporterLayout;