import {
  Grid,
  Paper,
  Typography,
  Box,
  Divider,
} from "@mui/material";

function AdminDashboardContent() {

  const cards = [
    {
      title: "Total users",
      value: "48",
      color: "#3B82F6",
    },
    {
      title: "Active playbooks",
      value: "23",
      color: "#22C55E",
    },
    {
      title: "KB articles",
      value: "91",
      color: "#A855F7",
    },
    {
      title: "Audit events today",
      value: "127",
      color: "#FACC15",
    },
  ];

  const chart = [
    { day: "Mon", value: 55 },
    { day: "Tue", value: 70 },
    { day: "Wed", value: 65 },
    { day: "Thu", value: 80 },
    { day: "Fri", value: 75 },
    { day: "Sat", value: 85 },
    { day: "Sun", value: 60 },
  ];

  const audits = [
    {
      time: "10:31 · Jun 28",
      event: "Admin assigned #INC-042 to Kiran T.",
    },
    {
      time: "09:55 · Jun 28",
      event: "New user created: meena@company.com",
    },
    {
      time: "09:13 · Jun 28",
      event: "Playbook updated: Account Compromise v2.1",
    },
    {
      time: "08:40 · Jun 28",
      event: "System settings changed: MFA enforced",
    },
  ];

  return (
    <Grid container spacing={3}>

      {cards.map((card) => (

        <Grid size={{ xs: 12, md: 3 }} key={card.title}>

          <Paper
            sx={{
              bgcolor: "#2B2B2B",
              p: 3,
              borderRadius: 2,
            }}
          >
            <Typography sx={{color:"#9CA3AF"}}>
              {card.title}
            </Typography>

            <Typography
              variant="h3"
              fontWeight={700}
              sx={{
                color: card.color,
                mt: 1,
              }}
            >
              {card.value}
            </Typography>

          </Paper>

        </Grid>

      ))}

      {/* Incident Trend */}

      <Grid size={{ xs: 12, md: 6 }}>

        <Paper
          sx={{
            bgcolor: "#2B2B2B",
            borderRadius: 2,
            p: 3,
            height: "100%",
          }}
        >

          <Typography
            variant="h6"
            color="white"
            fontWeight={700}
            mb={4}
            sx={{color:"#fff"}}
          >
            Incident Trend (Last 7 Days)
          </Typography>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              height: 220,
            }}
          >

            {chart.map((item) => (

              <Box
                key={item.day}
                textAlign="center"
              >

                <Box
                  sx={{
                    width: 22,
                    height: item.value * 1.5,
                    bgcolor: "#3B82F6",
                    borderRadius: 1,
                    mb: 1,
                  }}
                />

                <Typography
                  fontSize={12}
                  sx={{color:"#9CA3AF"}}
                >
                  {item.day}
                </Typography>

              </Box>

            ))}

          </Box>

        </Paper>

      </Grid>

      {/* Audit Events */}

      <Grid size={{ xs: 12, md: 6 }}>

        <Paper
          sx={{
            bgcolor: "#2B2B2B",
            borderRadius: 2,
            p: 3,
            height: "100%",
          }}
        >

          <Typography
            variant="h6"
            fontWeight={700}
            mb={3}
            sx={{color: "#fff"}}
          >
            Recent Audit Events
          </Typography>

          {audits.map((audit) => (

            <Box
              key={audit.event}
              mb={2}
            >

              <Typography
                fontSize={12}
                sx={{color: "#9CA3AF"}}
              >
                {audit.time}
              </Typography>

              <Typography
                sx={{color: "#DDDDDD"}}
                mt={1}
              >
                {audit.event}
              </Typography>

              <Divider sx={{ mt: 2 }} />

            </Box>

          ))}

        </Paper>

      </Grid>

    </Grid>
  );
}

export default AdminDashboardContent;