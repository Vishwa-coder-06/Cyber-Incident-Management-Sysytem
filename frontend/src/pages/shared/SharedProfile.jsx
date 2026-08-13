import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import ProfileContent from "../../components/reporter/ProfileContent";

// Per-role accent colors matching the topbar colors
const ROLE_ACCENTS = {
  reporter: "#166b37",   // green
  analyst: "#5B4CF5",    // purple
  manager: "#6C3CE9",    // purple-violet
  admin: "#C62828",      // red
};

function SharedProfile() {
  const location = useLocation();
  // Derive role from the URL path prefix
  const roleSegment = location.pathname.split("/")[1]?.toLowerCase() ?? "reporter";
  const accentColor = ROLE_ACCENTS[roleSegment] ?? "#1565C0";

  return (
    <Box>
      <Typography
        variant="h4"
        sx={{ color: "#FFFFFF", fontWeight: 700 }}
      >
        Your Profile
      </Typography>

      <Typography sx={{ color: "#9CA3AF", mb: 4 }}>
        Manage your account and preferences
      </Typography>

      <ProfileContent accentColor={accentColor} />
    </Box>
  );
}

export default SharedProfile;
