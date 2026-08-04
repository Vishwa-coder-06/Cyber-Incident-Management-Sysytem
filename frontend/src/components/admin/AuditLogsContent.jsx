import {
  Box,
  Paper,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  InputAdornment,
  MenuItem,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DownloadIcon from "@mui/icons-material/Download";

function AuditLogsContent() {

  const logs = [
    {
      time: "Jun 28 · 10:31",
      action: "Incident #INC-042 assigned to Kiran T.",
      actor: "Admin",
      type: "Assign",
      color: "#2563EB",
    },
    {
      time: "Jun 28 · 09:55",
      action: "New user created: meena@company.com (Analyst)",
      actor: "Admin",
      type: "User",
      color: "#2563EB",
    },
    {
      time: "Jun 28 · 09:13",
      action: "Playbook updated: Account Compromise Response v2.1",
      actor: "Admin",
      type: "Playbook",
      color: "#D97706",
    },
    {
      time: "Jun 28 · 08:40",
      action: "System setting changed: MFA enforced org-wide",
      actor: "Admin",
      type: "Settings",
      color: "#DC2626",
    },
    {
      time: "Jun 27 · 16:22",
      action: "User role changed: J. Doe → Reporter",
      actor: "Admin",
      type: "User",
      color: "#16A34A",
    },
    {
      time: "Jun 27 · 14:05",
      action: "Incident #INC-035 resolved and closed",
      actor: "Priya S.",
      type: "Resolved",
      color: "#16A34A",
    },
  ];

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#2B2B2B",
      borderRadius: 2,

      "& fieldset": {
        borderColor: "#444",
      },

      "&:hover fieldset": {
        borderColor: "#C62828",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#C62828",
      },
    },

    "& input": {
      color: "#FFFFFF",
    },
  };

  return (
    <>

      {/* Search */}

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
        }}
      >

        <TextField
          fullWidth
          placeholder="Search logs..."
          sx={inputStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9CA3AF" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          defaultValue="All actions"
          sx={{
            width: 150,
            ...inputStyle,
          }}
        >
          <MenuItem value="All actions">
            All actions
          </MenuItem>

          <MenuItem value="User">
            User
          </MenuItem>

          <MenuItem value="Incident">
            Incident
          </MenuItem>

          <MenuItem value="Settings">
            Settings
          </MenuItem>

        </TextField>

        <TextField
          type="date"
          sx={{
            width: 170,
            ...inputStyle,
          }}
           InputLabelProps={{
           shrink: true,
        }}
      />

        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          sx={{
            color: "#FFFFFF",
            borderColor: "#555",
            textTransform: "none",

            "&:hover": {
              borderColor: "#C62828",
            },
          }}
        >
          Export
        </Button>

      </Box>

      {/* Table */}

      <Paper
        elevation={0}
        sx={{
          bgcolor: "#2B2B2B",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>
                Timestamp
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>
                Action
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>
                Actor
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>
                Type
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {logs.map((log) => (

              <TableRow
                key={log.time + log.action}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: "#353535",
                  },
                }}
              >

                <TableCell sx={{ color: "#9CA3AF" }}>
                  {log.time}
                </TableCell>

                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 500,
                  }}
                >
                  {log.action}
                </TableCell>

                <TableCell sx={{ color: "#9CA3AF" }}>
                  {log.actor}
                </TableCell>

                <TableCell>

                  <Chip
                    label={log.type}
                    size="small"
                    sx={{
                      bgcolor: log.color,
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  />

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>

    </>
  );
}

export default AuditLogsContent;