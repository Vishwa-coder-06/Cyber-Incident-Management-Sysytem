import {
  Paper,
  Box,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from "@mui/material";

function AssignedIncidentsContent() {

  const incidents = [
    {
      id: "#INC-041",
      title: "Suspicious login from unknown IP",
      system: "Auth",
      severity: "Critical",
      assigned: "2h ago",
      color: "#E53935",
    },
    {
      id: "#INC-039",
      title: "Phishing email reported",
      system: "Email",
      severity: "High",
      assigned: "4h ago",
      color: "#EF6C00",
    },
    {
      id: "#INC-036",
      title: "VPN anomaly detected",
      system: "Network",
      severity: "Medium",
      assigned: "1d ago",
      color: "#F9A825",
    },
    {
      id: "#INC-033",
      title: "Unusual admin account activity",
      system: "AD",
      severity: "High",
      assigned: "2d ago",
      color: "#EF6C00",
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
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",
              color: "#FFFFFF",

              "& fieldset": {
                borderColor: "#444",
              },

              "&:hover fieldset": {
                borderColor: "#6750F5",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#6750F5",
              },
            },

            "& input::placeholder": {
              color: "#9CA3AF",
              opacity: 1,
            },
          }}
        />

        <TextField
          select
          defaultValue="All priority"
          sx={{
            width: 180,

            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",
              color: "#FFFFFF",

              "& fieldset": {
                borderColor: "#444",
              },
            },

            "& .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          }}
        >
          <MenuItem value="All priority">
            All priority
          </MenuItem>

          <MenuItem value="Critical">
            Critical
          </MenuItem>

          <MenuItem value="High">
            High
          </MenuItem>

          <MenuItem value="Medium">
            Medium
          </MenuItem>

        </TextField>

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

              <TableCell sx={{ color: "#9CA3AF" }}>
                ID
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF" }}>
                Title
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF" }}>
                System
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF" }}>
                Severity
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF" }}>
                Assigned
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {incidents.map((incident) => (

              <TableRow
                key={incident.id}
                hover
                sx={{
                  cursor: "pointer",

                  "&:hover": {
                    bgcolor: "#333333",
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

                  <Chip
                    label={incident.severity}
                    size="small"
                    sx={{
                      bgcolor: incident.color,
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  />

                </TableCell>

                <TableCell sx={{ color: "#9CA3AF" }}>
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

export default AssignedIncidentsContent;