import { useState, useEffect } from "react";
import {
  Paper, Box, TextField, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, CircularProgress, Typography, InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { getAuditLogs, searchAuditLogs } from "../../services/reportService";

const TYPE_COLORS = {
  LOGIN: "#3B82F6", LOGOUT: "#6B7280", CREATE: "#22C55E",
  UPDATE: "#F59E0B", DELETE: "#EF4444", ASSIGN: "#A855F7",
};

function typeColor(type) {
  return TYPE_COLORS[(type || "").toUpperCase()] ?? "#6B7280";
}

function AuditLogsContent() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLogs = (kw) => {
    setLoading(true);
    const call = kw ? searchAuditLogs(kw) : getAuditLogs();
    call.then((data) => setLogs(Array.isArray(data) ? data : []))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLogs(""); }, []);

  const fieldStyle = {
    "& .MuiOutlinedInput-root": { bgcolor: "#2B2B2B", "& fieldset": { borderColor: "#444" } },
    input: { color: "#FFFFFF" },
  };

  return (
    <>
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth placeholder="Search audit logs..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value.length === 0 || e.target.value.length >= 2) fetchLogs(e.target.value);
          }}
          sx={fieldStyle}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#9CA3AF" }} /></InputAdornment> }}
        />
        <Button
          variant="outlined"
          onClick={() => fetchLogs("")}
          sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
        >
          Refresh
        </Button>
      </Box>

      <Paper sx={{ bgcolor: "#2B2B2B", borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress size={28} /></Box>
        ) : logs.length === 0 ? (
          <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>No audit logs found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#9CA3AF" }}>Time</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>User ID</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Action</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Description</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, i) => (
                <TableRow key={log.id ?? i} hover sx={{ "&:hover": { bgcolor: "#333" } }}>
                  <TableCell sx={{ color: "#9CA3AF", fontSize: 13 }}>
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : "—"}
                  </TableCell>
                  <TableCell sx={{ color: "#9CA3AF" }}>{log.userId ?? "—"}</TableCell>
                  <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>{log.action ?? "—"}</TableCell>
                  <TableCell sx={{ color: "#9CA3AF" }}>{log.description ?? "—"}</TableCell>
                  <TableCell>
                    <Chip
                      label={log.type ?? log.action ?? "—"}
                      size="small"
                      sx={{ bgcolor: typeColor(log.type ?? log.action), color: "#FFFFFF", fontWeight: 600 }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </>
  );
}

export default AuditLogsContent;