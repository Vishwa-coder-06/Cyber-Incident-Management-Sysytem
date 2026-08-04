import {
  Paper,
  TextField,
  MenuItem,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

const incidents = [
  {
    id: "#INC-041",
    title: "Suspicious login from unknown IP",
    system: "Auth",
    severity: "Critical",
    status: "Open",
  },
  {
    id: "#INC-039",
    title: "Phishing email reported",
    system: "Email",
    severity: "High",
    status: "Assigned",
  },
  {
    id: "#INC-035",
    title: "Unusual data export from CRM",
    system: "CRM",
    severity: "Medium",
    status: "Resolved",
  },
  {
    id: "#INC-031",
    title: "Ransomware warning on endpoint",
    system: "Endpoint",
    severity: "Critical",
    status: "Resolved",
  },
  {
    id: "#INC-028",
    title: "Unauthorized USB device detected",
    system: "Endpoint",
    severity: "Low",
    status: "Resolved",
  },
];

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#2D2D2D",
    color: "#FFFFFF",

    "& fieldset": {
      borderColor: "#555555",
    },

    "&:hover fieldset": {
      borderColor: "#1565C0",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#1565C0",
    },
  },

  "& input": {
    color: "#FFFFFF",
  },

  "& .MuiSvgIcon-root": {
    color: "#FFFFFF",
  },
};

function severityChip(severity) {
  switch (severity) {
    case "Critical":
      return <Chip label={severity} color="error" size="small" />;

    case "High":
      return (
        <Chip
          label={severity}
          size="small"
          sx={{
            bgcolor: "#C79200",
            color: "#fff",
          }}
        />
      );

    case "Medium":
      return (
        <Chip
          label={severity}
          size="small"
          sx={{
            bgcolor: "#EF8F00",
            color: "#fff",
          }}
        />
      );

    default:
      return (
        <Chip
          label={severity}
          size="small"
          color="success"
        />
      );
  }
}

function statusChip(status) {
  switch (status) {
    case "Open":
      return (
        <Chip
          label={status}
          size="small"
          color="primary"
        />
      );

    case "Assigned":
      return (
        <Chip
          label={status}
          size="small"
          sx={{
            bgcolor: "#D9A441",
            color: "#fff",
          }}
        />
      );

    default:
      return (
        <Chip
          label={status}
          size="small"
          color="success"
        />
      );
  }
}

function MyIncidentsContent() {
  return (
    <Paper
      elevation={0}
      sx={{
        bgcolor: "#1E1E1E",
        p: 3,
        borderRadius: 2,
      }}
    >
      {/* Filters */}

      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search incidents..."
            sx={inputStyle}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            fullWidth
            select
            defaultValue="All Status"
            sx={inputStyle}
          >
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="Open">Open</MenuItem>
            <MenuItem value="Assigned">Assigned</MenuItem>
            <MenuItem value="Resolved">Resolved</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            fullWidth
            select
            defaultValue="All Severity"
            sx={inputStyle}
          >
            <MenuItem value="All Severity">All Severity</MenuItem>
            <MenuItem value="Critical">Critical</MenuItem>
            <MenuItem value="High">High</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Low">Low</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Table */}

      <Table>

        <TableHead>

          <TableRow>

            <TableCell sx={{ color: "#9CA3AF" }}>ID</TableCell>

            <TableCell sx={{ color: "#9CA3AF" }}>Title</TableCell>

            <TableCell sx={{ color: "#9CA3AF" }}>System</TableCell>

            <TableCell sx={{ color: "#9CA3AF" }}>Severity</TableCell>

            <TableCell sx={{ color: "#9CA3AF" }}>Status</TableCell>

          </TableRow>

        </TableHead>

        <TableBody>

          {incidents.map((incident) => (

            <TableRow
              key={incident.id}
              hover
              sx={{
                "&:hover": {
                  bgcolor: "#2A2A2A",
                },
              }}
            >
              <TableCell sx={{ color: "#9CA3AF" }}>
                {incident.id}
              </TableCell>

              <TableCell
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 600,
                }}
              >
                {incident.title}
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF" }}>
                {incident.system}
              </TableCell>

              <TableCell>
                {severityChip(incident.severity)}
              </TableCell>

              <TableCell>
                {statusChip(incident.status)}
              </TableCell>
            </TableRow>

          ))}

        </TableBody>

      </Table>
    </Paper>
  );
}

export default MyIncidentsContent;