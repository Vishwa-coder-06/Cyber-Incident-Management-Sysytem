import { Box, Typography } from "@mui/material";
import AuditLogsContent from "../../components/admin/AuditLogsContent";

function AuditLogs() {
  return (
    <Box>

      <Typography
        variant="h4"
        sx={{
          color: "#FFFFFF",
          fontWeight: 700,
        }}
      >
        Audit Logs
      </Typography>

      <Typography
        sx={{
          color: "#9CA3AF",
          mb: 4,
        }}
      >
        Complete history of all system actions
      </Typography>

      <AuditLogsContent />

    </Box>
  );
}

export default AuditLogs;