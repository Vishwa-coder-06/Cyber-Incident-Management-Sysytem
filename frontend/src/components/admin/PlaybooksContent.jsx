import {
  Paper,
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  IconButton,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function PlaybooksContent() {

  const playbooks = [
    {
      name: "Account Compromise Response v2.1",
      steps: "8 steps",
      category: "Auth",
      color: "#2563EB",
      updated: "Jun 28",
    },
    {
      name: "Ransomware Containment Protocol",
      steps: "12 steps",
      category: "Malware",
      color: "#B91C1C",
      updated: "Jun 20",
    },
    {
      name: "Phishing Email Triage SOP",
      steps: "6 steps",
      category: "Phishing",
      color: "#D97706",
      updated: "Jun 15",
    },
    {
      name: "DDoS Response and Traffic Filtering",
      steps: "9 steps",
      category: "Network",
      color: "#16A34A",
      updated: "Jun 10",
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
          placeholder="Search playbooks..."
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",

              "& fieldset": {
                borderColor: "#444",
              },
            },

            input: {
              color: "#FFFFFF",
            },
          }}
          InputProps={{
            endAdornment: (
              <SearchIcon sx={{ color: "#888888" }} />
            ),
          }}
        />

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            borderColor: "#666",
            color: "#FFFFFF",
            textTransform: "none",
            px: 3,

            "&:hover": {
              borderColor: "#C62828",
            },
          }}
        >
          New Playbook
        </Button>

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

              <TableCell sx={{ color: "#9CA3AF" }}>
                Playbook Name
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF" }}>
                Steps
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF" }}>
                Category
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF" }}>
                Last Updated
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF" }}>
                Actions
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {playbooks.map((item) => (

              <TableRow key={item.name}>

                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                >
                  {item.name}
                </TableCell>

                <TableCell sx={{ color: "#9CA3AF" }}>
                  {item.steps}
                </TableCell>

                <TableCell>

                  <Chip
                    label={item.category}
                    size="small"
                    sx={{
                      bgcolor: item.color,
                      color: "#FFFFFF",
                    }}
                  />

                </TableCell>

                <TableCell sx={{ color: "#9CA3AF" }}>
                  {item.updated}
                </TableCell>

                <TableCell>

                  <IconButton>

                    <EditOutlinedIcon
                      sx={{
                        color: "#9CA3AF",
                      }}
                    />

                  </IconButton>

                  <IconButton>

                    <DeleteOutlineOutlinedIcon
                      sx={{
                        color: "#9CA3AF",
                      }}
                    />

                  </IconButton>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>

    </>
  );
}

export default PlaybooksContent;