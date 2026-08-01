import { Box, Paper, Typography } from "@mui/material";
import StatusChip from "./StatusChip";

function IncidentCard({
  id,
  title,
  source,
  severity,
  status,
  severityColor,
  statusColor,
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#3A3A3A",
        p: 2.5,
        mb: 2,
        borderRadius: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography sx={{ color: "#FFFFFF" }}>
            {id}
          </Typography>

         <Typography
              sx={{
              color: "#FFFFFF",
              fontWeight: 600,
             }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
            color: "#FFFFFF",
            fontSize: 14,
            }}
          >
            {source}
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1,
          }}
        >
          <StatusChip
            label={severity}
            color={severityColor}
          />

          <StatusChip
            label={status}
            color={statusColor}
          />
        </Box>
      </Box>
    </Paper>
  );
}

export default IncidentCard;