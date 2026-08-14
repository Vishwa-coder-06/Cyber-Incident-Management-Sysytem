import { useState, useEffect } from "react";
import {
  Paper, Box, TextField, MenuItem,
  Table, TableHead, TableBody, TableRow, TableCell,
  Chip, CircularProgress, Typography, Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { getAnalystIncidents } from "../../services/incidentService";

function severityChip(severity) {
  const s = (severity || "").toUpperCase();
  const colorMap = {
    CRITICAL: "#E53935",
    HIGH: "#EF6C00",
    MEDIUM: "#F9A825",
    LOW: "#22C55E",
  };
  return (
    <Chip
      label={severity}
      size="small"
      sx={{ bgcolor: colorMap[s] ?? "#555", color: "#FFFFFF", fontWeight: 600 }}
    />
  );
}

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function statusChip(status) {
  const s = (status || "ASSIGNED").toUpperCase();
  let bg = "#D97706";
  if (s === "RESOLVED" || s === "CLOSED" || s === "READY_TO_CLOSE") bg = "#16A34A";
  else if (s === "IN_PROGRESS" || s === "INVESTIGATING") bg = "#2563EB";

  return (
    <Chip
      label={status || "ASSIGNED"}
      size="small"
      sx={{ bgcolor: bg, color: "#FFFFFF", fontWeight: 600 }}
    />
  );
}

function AssignedIncidentsContent() {
  const navigate = useNavigate();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All priority");

  useEffect(() => {
    const params = {};
    if (search) params.search = search;
    if (severityFilter !== "All priority") params.severity = severityFilter;

    setLoading(true);
    getAnalystIncidents(params)
      .then((data) => setIncidents(Array.isArray(data) ? data : []))
      .catch(() => setIncidents([]))
      .finally(() => setLoading(false));
  }, [search, severityFilter]);

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#2B2B2B",
      color: "#FFFFFF",
      "& fieldset": { borderColor: "#444" },
      "&:hover fieldset": { borderColor: "#6750F5" },
      "&.Mui-focused fieldset": { borderColor: "#6750F5" },
    },
    "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
    "& .MuiSvgIcon-root": { color: "#FFFFFF" },
  };

  const openIncident = (incident) => {
    const id = incident.incidentId ?? incident.id;
    navigate("/analyst/investigation", { state: { incidentId: id, incidentTitle: incident.title } });
  };

  return (
    <>
      {/* Search & Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search incidents..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={fieldStyle}
        />

        <TextField
          select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          sx={{ width: 180, ...fieldStyle }}
        >
          <MenuItem value="All priority">All priority</MenuItem>
          <MenuItem value="CRITICAL">Critical</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="LOW">Low</MenuItem>
        </TextField>
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress size={28} />
          </Box>
        ) : incidents.length === 0 ? (
          <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>
            No assigned incidents found.
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
                <TableCell sx={{ color: "#9CA3AF" }}>Assigned</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {incidents.map((incident) => {
                const statusStr = (incident.status || "ASSIGNED").toUpperCase();
                const isResolved = ["RESOLVED", "CLOSED", "READY_TO_CLOSE"].includes(statusStr);

                return (
                  <TableRow
                    key={incident.incidentId ?? incident.id}
                    hover
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#333333" } }}
                    onClick={() => openIncident(incident)}
                  >
                    <TableCell sx={{ color: "#9CA3AF" }}>
                      #INC-{incident.incidentId ?? incident.id}
                    </TableCell>
                    <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                      {incident.title}
                    </TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>
                      {incident.affectedSystem ?? incident.category ?? "—"}
                    </TableCell>
                    <TableCell>{severityChip(incident.severity)}</TableCell>
                    <TableCell>{statusChip(incident.status)}</TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>
                      {timeAgo(incident.assignedAt ?? incident.createdAt)}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Box display="flex" gap={1}>
                        <Button
                          size="small" variant="outlined"
                          onClick={() => openIncident(incident)}
                          sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none",
                            "&:hover": { borderColor: "#6750F5" } }}
                        >
                          Investigate
                        </Button>
                        {!isResolved && (
                          <Button
                            size="small" variant="outlined"
                            onClick={() => navigate("/analyst/resolution", {
                              state: { incidentId: incident.incidentId ?? incident.id, incidentTitle: incident.title }
                            })}
                            sx={{ color: "#4ADE80", borderColor: "#4ADE80", textTransform: "none",
                              "&:hover": { borderColor: "#22C55E" } }}
                          >
                            Resolve
                          </Button>
                        )}
                      </Box>
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

export default AssignedIncidentsContent;