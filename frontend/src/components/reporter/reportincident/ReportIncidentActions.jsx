import { Box, Button } from "@mui/material";

function ReportIncidentActions() {
  return (
    <Box
      sx={{
        mt: 4,
        display: "flex",
        gap: 2,
      }}
    >
      <Button
        variant="outlined"
        sx={{
          px: 4,
          py: 1.3,
          color: "#FFFFFF",
          borderColor: "#777777",
          textTransform: "none",
          fontWeight: 600,

          "&:hover": {
            borderColor: "#FFFFFF",
            bgcolor: "#2D2D2D",
          },
        }}
      >
        Save Draft
      </Button>

      <Button
        variant="contained"
        sx={{
          px: 4,
          py: 1.3,
          bgcolor: "#2E7D32",
          textTransform: "none",
          fontWeight: 600,

          "&:hover": {
            bgcolor: "#256628",
          },
        }}
      >
        Submit and Analyze
      </Button>
    </Box>
  );
}

export default ReportIncidentActions;