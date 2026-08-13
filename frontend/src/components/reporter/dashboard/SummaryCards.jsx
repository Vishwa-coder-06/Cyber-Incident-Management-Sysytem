import { useState, useEffect } from "react";
import { Grid } from "@mui/material";
import SummaryCard from "./SummaryCard";
import { getReporterDashboard } from "../../../services/dashboardService";
import { useAuth } from "../../../contexts/AuthContext";

import { getMe } from "../../../services/userService";

function SummaryCards() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      let uid = user?.userId ?? user?.id;
      if (!uid) {
        try {
          const me = await getMe();
          uid = me?.userId ?? me?.id;
        } catch {
          // ignore
        }
      }
      if (!uid) return;
      try {
        const res = await getReporterDashboard(uid);
        if (isMounted) setStats(res);
      } catch {
        if (isMounted) setStats(null);
      }
    };
    fetchStats();
    return () => {
      isMounted = false;
    };
  }, [user]);

  const cards = [
    {
      title: "Total submitted",
      value: stats?.totalSubmitted ?? "—",
      color: "#42A5F5",
    },
    {
      title: "Under review",
      value: stats?.underReview ?? "—",
      color: "#FFB74D",
    },
    {
      title: "Resolved",
      value: stats?.resolved ?? "—",
      color: "#4ADE80",
    },
    {
      title: "Critical open",
      value: stats?.criticalOpen ?? "—",
      color: "#EF5350",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 5 }}>
      {cards.map((card) => (
        <Grid key={card.title} size={{ xs: 12, sm: 6, md: 3 }}>
          <SummaryCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}

export default SummaryCards;