import { Grid } from "@mui/material";
import SummaryCard from "./SummaryCard";

function SummaryCards() {

  const cards = [
    {
      title: "Total submitted",
      value: 12,
      color: "#42A5F5",
    },
    {
      title: "Under review",
      value: 3,
      color: "#FFB74D",
    },
    {
      title: "Resolved",
      value: 8,
      color: "#4ADE80",
    },
    {
      title: "Critical open",
      value: 1,
      color: "#EF5350",
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 5 }}>
      {cards.map((card) => (
        <Grid
          key={card.title}
          size={{ xs: 12, sm: 6, md: 3 }}
        >
          <SummaryCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}

export default SummaryCards;