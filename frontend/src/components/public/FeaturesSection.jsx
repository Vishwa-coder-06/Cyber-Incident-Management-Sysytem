import { Box, Card, CardContent, Container, Typography } from "@mui/material";

import Grid from "@mui/material/Grid";
import SettingsIcon from "@mui/icons-material/Settings";
import GroupsIcon from "@mui/icons-material/Groups";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const features = [
  {
    title: "AI-powered analysis",
    description:
      "Instant severity prediction, root cause and playbook recommendations.",
    icon: <SettingsIcon />,
    color: "#1565C0",
  },
  {
    title: "Team collaboration",
    description:
      "Reporters, analysts and managers on one platform.",
    icon: <GroupsIcon />,
    color: "#00C853",
  },
  {
    title: "Knowledge base",
    description:
      "Auto-generated articles from every resolved incident.",
    icon: <MenuBookIcon />,
    color: "#9C27B0",
  },
];

function FeaturesSection() {
  return (
    <Box
      sx={{
        bgcolor: "#2E2E2E",
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {features.map((feature) => (
            <Grid size={{xs:12,sm:6,md:4}} key={feature.title}>
              <Card
                 sx={{
                 bgcolor: "#1E1E1E",
                 color: "white",
                 borderRadius: 3,
                 height: "100%",
                 display: "flex",
                 flexDirection: "column",
                }}
               >
                <CardContent sx={{ p: 4 }}>
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      bgcolor: feature.color,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 3,
                    }}
                  >
                    {feature.icon}
                  </Box>

                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {feature.title}
                  </Typography>

                  <Typography color="grey.400">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default FeaturesSection;