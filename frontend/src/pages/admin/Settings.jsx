import { Box, Typography } from "@mui/material";
import SettingsContent from "../../components/admin/SettingsContent";

function Settings() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        System Settings
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Configure platform-wide security and behavior
      </Typography>

      <SettingsContent />

    </Box>
  );
}

export default Settings;