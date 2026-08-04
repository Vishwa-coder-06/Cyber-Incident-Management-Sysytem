import { Box, Typography } from "@mui/material";
import PlaybooksContent from "../../components/admin/PlaybooksContent";

function Playbooks() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Playbook Management
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Create and manage incident response playbooks
      </Typography>

      <PlaybooksContent />

    </Box>
  );
}

export default Playbooks;