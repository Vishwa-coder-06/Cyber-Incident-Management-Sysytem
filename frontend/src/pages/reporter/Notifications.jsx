import { Box, Typography } from "@mui/material";
import NotificationsContent from "../../components/reporter/NotificationsContent";

function Notifications() {
  return (
    <Box>
      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Notifications
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Updates on your incidents and assignments
      </Typography>

      <NotificationsContent />
    </Box>
  );
}

export default Notifications;