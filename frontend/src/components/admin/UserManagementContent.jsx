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
  Avatar,
  Chip,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

function UserManagementContent() {

  const users = [
    {
      initials: "JD",
      color: "#3B82F6",
      name: "John Doe",
      email: "john@company.com",
      role: "Reporter",
      roleColor: "#2563EB",
      status: "Active",
      statusColor: "#22C55E",
    },
    {
      initials: "PS",
      color: "#16A34A",
      name: "Priya S.",
      email: "priya@company.com",
      role: "Analyst",
      roleColor: "#16A34A",
      status: "Active",
      statusColor: "#22C55E",
    },
    {
      initials: "IM",
      color: "#9333EA",
      name: "Incident Mgr",
      email: "mgr@company.com",
      role: "Manager",
      roleColor: "#7E22CE",
      status: "Active",
      statusColor: "#22C55E",
    },
    {
      initials: "AD",
      color: "#DC2626",
      name: "Admin User",
      email: "admin@company.com",
      role: "Admin",
      roleColor: "#B91C1C",
      status: "Active",
      statusColor: "#22C55E",
    },
    {
      initials: "MR",
      color: "#64748B",
      name: "Meena R.",
      email: "meena@company.com",
      role: "Analyst",
      roleColor: "#16A34A",
      status: "New",
      statusColor: "#F59E0B",
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
          placeholder="Search users..."
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",

              "& fieldset": {
                borderColor: "#444",
              },
            },

            input: {
              color: "white",
            },
          }}
          InputProps={{
            endAdornment: <SearchIcon sx={{ color: "#888" }} />,
          }}
        />

        <TextField
          sx={{
            width: 150,

            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",

              "& fieldset": {
                borderColor: "#444",
              },
            },
          }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: "#C62828",
            px: 3,
            textTransform: "none",

            "&:hover": {
              bgcolor: "#B71C1C",
            },
          }}
        >
          Add User
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

              <TableCell sx={{ color: "#9CA3AF" }}>Name</TableCell>
              <TableCell sx={{ color: "#9CA3AF" }}>Email</TableCell>
              <TableCell sx={{ color: "#9CA3AF" }}>Role</TableCell>
              <TableCell sx={{ color: "#9CA3AF" }}>Status</TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {users.map((user) => (

              <TableRow
                key={user.email}
              >

                <TableCell>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                    }}
                  >

                    <Avatar
                      sx={{
                        bgcolor: user.color,
                        width: 30,
                        height: 30,
                        fontSize: 13,
                      }}
                    >
                      {user.initials}
                    </Avatar>

                    <Box
                      sx={{
                        color: "#FFFFFF",
                        fontWeight: 600,
                      }}
                    >
                      {user.name}
                    </Box>

                  </Box>

                </TableCell>

                <TableCell sx={{ color: "#9CA3AF" }}>
                  {user.email}
                </TableCell>

                <TableCell>

                  <Chip
                    label={user.role}
                    size="small"
                    sx={{
                      bgcolor: user.roleColor,
                      color: "#FFFFFF",
                    }}
                  />

                </TableCell>

                <TableCell>

                  <Box
                    sx={{
                      color: user.statusColor,
                      fontWeight: 600,
                    }}
                  >
                    {user.status}
                  </Box>

                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>

    </>
  );
}

export default UserManagementContent;