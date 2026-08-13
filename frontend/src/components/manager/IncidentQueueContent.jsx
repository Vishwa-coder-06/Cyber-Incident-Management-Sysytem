import { useState, useEffect } from "react";
import {
  Box, Button, Chip, MenuItem, Paper,
  Table, TableBody, TableCell, TableHead, TableRow,
  TextField, CircularProgress, Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { getManagerQueue } from "../../services/incidentService";

const SEV_COLORS = {
  CRITICAL: "#DC2626",
  HIGH: "#F97316",
  MEDIUM: "#D97706",
  LOW: "#22C55E",
};

const fieldStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#2B2B2B",
    "& fieldset": { borderColor: "#444444" },
    "&:hover fieldset": { borderColor: "#6C3CE9" },
    "&.Mui-focused fieldset": { borderColor: "#6C3CE9" },
  },
  input: { color: "#FFFFFF" },
  "& .MuiSelect-select": { color: "#FFFFFF" },
  "& .MuiSvgIcon-root": { color: "#FFFFFF" },
};

function IncidentQueueContent() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("severity");
  const [status, setStatus] = useState("status");

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (severity !== "severity") params.severity = severity;
    if (status !== "status") params.status = status;

    setLoading(true);
    getManagerQueue(params)
      .then((data) => {
        let list = Array.isArray(data) ? data : [];
        if (search) {
          const s = search.toLowerCase();
          list = list.filter(
            (i) =>
              i.title?.toLowerCase().includes(s) ||
              i.description?.toLowerCase().includes(s) ||
              i.reportedBy?.toString().toLowerCase().includes(s) ||
              i.assignedTo?.toString().toLowerCase().includes(s)
          );
        }
        if (severity !== "severity") {
          list = list.filter((i) => (i.severity || "").toUpperCase() === severity);
        }
        if (status !== "status") {
          list = list.filter((i) => (i.status || "").toUpperCase() === status);
        }
        setIncidents(list);
      })
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, [search, severity, status]);

  return (
    <>
      {/* Search & Filters */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth placeholder="Search queue..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{ endAdornment: <SearchIcon sx={{ color: "#888888" }} /> }}
          sx={fieldStyle}
        />

        <TextField select value={severity} onChange={(e) => setSeverity(e.target.value)}
          sx={{ width: 160, ...fieldStyle }}>
          <MenuItem value="severity">All Severity</MenuItem>
          <MenuItem value="CRITICAL">Critical</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="LOW">Low</MenuItem>
        </TextField>

        <TextField select value={status} onChange={(e) => setStatus(e.target.value)}
          sx={{ width: 160, ...fieldStyle }}>
          <MenuItem value="status">All Status</MenuItem>
          <MenuItem value="OPEN">Open</MenuItem>
          <MenuItem value="ASSIGNED">Assigned</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
        </TextField>
      </Box>

      {/* Table */}
      <Paper sx={{ bgcolor: "#2B2B2B", borderRadius: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress size={28} /></Box>
        ) : incidents.length === 0 ? (
          <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>
            No incidents in queue.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#9CA3AF" }}>ID</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Title</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Reporter</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Severity</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Assigned To</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {incidents.map((incident) => {
                const id = incident.incidentId ?? incident.id;
                const sev = (incident.severity || "").toUpperCase();
                const isUnassigned = !incident.assignedTo;
                return (
                  <TableRow key={id}>
                    <TableCell sx={{ color: "#9CA3AF" }}>#INC-{id}</TableCell>
                    <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>{incident.title}</TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>
                      {incident.reportedByName ?? incident.reportedBy ?? "—"}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={incident.severity}
                        size="small"
                        sx={{ bgcolor: SEV_COLORS[sev] ?? "#555", color: "#FFFFFF" }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: isUnassigned ? "#F59E0B" : "#FFFFFF" }}>
                      {isUnassigned ? "Unassigned" : (incident.assignedToName ?? incident.assignedTo)}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="small" variant="outlined"
                        onClick={() => navigate(`/manager/assign-incident/${id}`, { state: { incidentId: id } })}
                        sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none",
                          "&:hover": { borderColor: "#6C3CE9" } }}
                      >
                        Assign
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>
    </>
  );
}

export default IncidentQueueContent;