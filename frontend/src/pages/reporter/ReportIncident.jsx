import { Box } from "@mui/material";
import ReportIncidentForm from "../../components/reporter/reportincident/ReportIncidentForm";
import ReportIncidentHeader from "../../components/reporter/reportincident/ReportIncidentHeader";


function ReportIncident() {
 return (
    <Box>
      <ReportIncidentHeader />
      <ReportIncidentForm />
     
    </Box>
  );
}

export default ReportIncident;