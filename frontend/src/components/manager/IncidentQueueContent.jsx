import {
  Box,
  Button,
  Chip,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

function IncidentQueueContent() {

  const incidents = [
    {
      id: "#INC-042",
      title: "SQL injection attempt on API",
      reporter: "K. Rajan",
      severity: "Critical",
      color: "#DC2626",
      assigned: "Unassigned",
      assignedColor: "#F59E0B",
    },
    {
      id: "#INC-041",
      title: "Suspicious login from unknown IP",
      reporter: "J. Doe",
      severity: "Critical",
      color: "#DC2626",
      assigned: "Priya S.",
      assignedColor: "#FFFFFF",
    },
    {
      id: "#INC-040",
      title: "VPN access from blocked region",
      reporter: "M. Raj",
      severity: "High",
      color: "#F97316",
      assigned: "Unassigned",
      assignedColor: "#F59E0B",
    },
    {
      id: "#INC-039",
      title: "Phishing email reported",
      reporter: "A. Kumar",
      severity: "High",
      color: "#F97316",
      assigned: "Arun K.",
      assignedColor: "#FFFFFF",
    },
    {
      id: "#INC-038",
      title: "File exfiltration alert via USB",
      reporter: "T. Sharma",
      severity: "Medium",
      color: "#D97706",
      assigned: "Unassigned",
      assignedColor: "#F59E0B",
    },
  ];

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
          placeholder="Search..."
          InputProps={{
            endAdornment: (
              <SearchIcon sx={{ color: "#888888" }} />
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",

              "& fieldset": {
                borderColor: "#444444",
              },

              "&:hover fieldset": {
                borderColor: "#6C3CE9",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#6C3CE9",
              },
            },

            input: {
              color: "#FFFFFF",
            },
          }}
        />

        <TextField
          select
          defaultValue="severity"
          sx={{
            width: 160,

            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",

              "& fieldset": {
                borderColor: "#444444",
              },
            },

            "& .MuiSelect-select": {
              color: "#FFFFFF",
            },
          }}
        >
          <MenuItem value="severity">All Severity</MenuItem>
        </TextField>

        <TextField
          select
          defaultValue="status"
          sx={{
            width: 160,

            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",

              "& fieldset": {
                borderColor: "#444444",
              },
            },

            "& .MuiSelect-select": {
              color: "#FFFFFF",
            },
          }}
        >
          <MenuItem value="status">All Status</MenuItem>
        </TextField>

      </Box>

      {/* Table */}

      <Paper
        sx={{
          bgcolor: "#2B2B2B",
          borderRadius: 2,
        }}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell sx={{ color: "#9CA3AF" }}>ID</TableCell>
              <TableCell sx={{ color: "#9CA3AF" }}>Title</TableCell>
              <TableCell sx={{ color: "#9CA3AF" }}>Reporter</TableCell>
              <TableCell sx={{ color: "#9CA3AF" }}>Severity</TableCell>
              <TableCell sx={{ color: "#9CA3AF" }}>Assigned To</TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {incidents.map((incident) => (

              <TableRow key={incident.id}>

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
                  {incident.reporter}
                </TableCell>

                <TableCell>

                  <Chip
                    label={incident.severity}
                    size="small"
                    sx={{
                      bgcolor: incident.color,
                      color: "#FFFFFF",
                    }}
                  />

                </TableCell>

                <TableCell
                  sx={{
                    color: incident.assignedColor,
                  }}
                >
                  {incident.assigned}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>

    </>
  );
}

export default IncidentQueueContent;