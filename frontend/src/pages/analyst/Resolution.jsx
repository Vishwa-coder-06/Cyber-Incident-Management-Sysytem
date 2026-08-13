import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import ResolutionContent from "../../components/analyst/ResolutionContent";

function Resolution() {
  const location = useLocation();
  const incidentId = location.state?.incidentId;
  const incidentTitle = location.state?.incidentTitle ?? "Finalize and close incident";

  return (
    <Box>
      <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
        Resolution
      </Typography>
      <Typography sx={{ color: "#9CA3AF", mb: 4 }}>
        {incidentId ? `#INC-${incidentId} · ` : ""}{incidentTitle}
      </Typography>
      <ResolutionContent />
    </Box>
  );
}

export default Resolution;