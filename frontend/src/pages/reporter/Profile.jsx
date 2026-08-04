import { Box, Typography } from "@mui/material";
import ProfileContent from "../../components/reporter/ProfileContent";

function Profile() {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Your Profile
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Manage your account and preferences
      </Typography>

      <ProfileContent />
    </Box>
  );
}

export default Profile;