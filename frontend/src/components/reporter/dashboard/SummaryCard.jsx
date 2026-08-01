import { Paper, Typography } from "@mui/material";

function SummaryCard({ title, value, color }) {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#2D2D2D",
        border: "1px solid #3A3A3A",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography
        sx={{
          color: "#9CA3AF",
          fontSize: 14,
          mb: 1,
        }}
      >
        {title}
      </Typography>

      <Typography
        variant="h3"
        sx={{
          color: color,
          fontWeight: 700,
        }}
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default SummaryCard;