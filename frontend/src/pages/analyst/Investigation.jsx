import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router-dom";
import InvestigationContent from "../../components/analyst/InvestigationContent";

function Investigation() {
  const location = useLocation();
  const incidentId = location.state?.incidentId;
  const incidentTitle = location.state?.incidentTitle ?? "Incident Investigation";

  return (
    <Box>
      <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
        Investigation workspace
      </Typography>
      <Typography sx={{ color: "#9CA3AF", mb: 4 }}>
        {incidentId ? `#INC-${incidentId} · ` : ""}{incidentTitle}
      </Typography>
      <InvestigationContent />
    </Box>
  );
}

export default Investigation;