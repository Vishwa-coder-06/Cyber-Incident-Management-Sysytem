import { Chip } from "@mui/material";

function StatusChip({ label, color }) {
  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: "transparent",
        color: color,
        border: `1px solid ${color}`,
        borderRadius: 1,
        minWidth: 70,
      }}
    />
  );
}

export default StatusChip;