import { useState, useEffect } from "react";
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
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getMyIncidents } from "../../services/incidentService";

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#2D2D2D",
    color: "#FFFFFF",
    "& fieldset": { borderColor: "#555555" },
    "&:hover fieldset": { borderColor: "#1565C0" },
    "&.Mui-focused fieldset": { borderColor: "#1565C0" },
  },
  "& input": { color: "#FFFFFF" },
  "& .MuiSvgIcon-root": { color: "#FFFFFF" },
};

function severityChip(severity) {
  const s = (severity || "").toUpperCase();
  switch (s) {
    case "CRITICAL":
      return <Chip label={severity} color="error" size="small" />;
    case "HIGH":
      return <Chip label={severity} size="small" sx={{ bgcolor: "#C79200", color: "#fff" }} />;
    case "MEDIUM":
      return <Chip label={severity} size="small" sx={{ bgcolor: "#EF8F00", color: "#fff" }} />;
    default:
      return <Chip label={severity || "Low"} size="small" color="success" />;
  }
}

function statusChip(status) {
  const s = (status || "").toUpperCase().replace(/ /g, "_");
  switch (s) {
    case "OPEN":
      return <Chip label={status} size="small" color="primary" />;
    case "ASSIGNED":
    case "IN_PROGRESS":
      return <Chip label={status} size="small" sx={{ bgcolor: "#D9A441", color: "#fff" }} />;
    case "RESOLVED":
    case "CLOSED":
      return <Chip label={status} size="small" color="success" />;
    default:
      return <Chip label={status || "—"} size="small" />;
  }
}

function MyIncidentsContent() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [severityFilter, setSeverityFilter] = useState("All Severity");

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (statusFilter !== "All Status") params.status = statusFilter;
    if (severityFilter !== "All Severity") params.severity = severityFilter;

    setLoading(true);
    getMyIncidents(params)
      .then((data) => setIncidents(Array.isArray(data) ? data : []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, [search, statusFilter, severityFilter]);

  const handleRowClick = (incident) => {
    const id = incident.incidentId ?? incident.id;
    if (id) {
      navigate("/reporter/incident-details", { state: { incidentId: id } });
    }
  };

  return (
    <Paper elevation={0} sx={{ bgcolor: "#1E1E1E", p: 3, borderRadius: 2 }}>
      {/* Filters */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <TextField
            fullWidth
            placeholder="Search incidents..."
            sx={inputStyle}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            fullWidth
            select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            sx={inputStyle}
          >
            <MenuItem value="All Status">All Status</MenuItem>
            <MenuItem value="OPEN">Open</MenuItem>
            <MenuItem value="ASSIGNED">Assigned</MenuItem>
            <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
            <MenuItem value="RESOLVED">Resolved</MenuItem>
          </TextField>
        </Grid>

        <Grid size={{ xs: 12, md: 2 }}>
          <TextField
            fullWidth
            select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            sx={inputStyle}
          >
            <MenuItem value="All Severity">All Severity</MenuItem>
            <MenuItem value="CRITICAL">Critical</MenuItem>
            <MenuItem value="HIGH">High</MenuItem>
            <MenuItem value="MEDIUM">Medium</MenuItem>
            <MenuItem value="LOW">Low</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Table */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress size={28} />
        </Box>
      ) : incidents.length === 0 ? (
        <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>
          No incidents found.
        </Typography>
      ) : (
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
            {incidents.map((incident) => {
              const id = incident.incidentId ?? incident.id;
              return (
                <TableRow
                  key={id}
                  hover
                  onClick={() => handleRowClick(incident)}
                  sx={{ cursor: "pointer", "&:hover": { bgcolor: "#2A2A2A" } }}
                >
                  <TableCell sx={{ color: "#9CA3AF" }}>
                    #INC-{id}
                  </TableCell>

                  <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                    {incident.title}
                  </TableCell>

                  <TableCell sx={{ color: "#9CA3AF" }}>
                    {incident.affectedSystem ?? incident.category ?? "—"}
                  </TableCell>

                  <TableCell>{severityChip(incident.severity)}</TableCell>

                  <TableCell>{statusChip(incident.status)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}

export default MyIncidentsContent;