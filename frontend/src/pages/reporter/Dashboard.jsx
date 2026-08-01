import { Box } from "@mui/material";
import DashboardHeader from "../../components/reporter/dashboard/DashboardHeader";
import SummaryCards from "../../components/reporter/dashboard/SummaryCards";
import RecentIncidents from "../../components/reporter/dashboard/RecentIncidents";

function Dashboard() {
  return (
    <Box>
      <DashboardHeader />
      <SummaryCards />
      <RecentIncidents />
    </Box>
  );
}

export default Dashboard;