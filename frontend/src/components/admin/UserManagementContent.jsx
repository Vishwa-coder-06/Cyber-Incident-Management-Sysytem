import { useState, useEffect } from "react";
import {
  Paper, Box, TextField, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Avatar, Chip, CircularProgress, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem,
  IconButton, Snackbar, Alert, Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/EditOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { getAllUsers, searchUsers, createUser, updateUser } from "../../services/userService";

const ROLE_COLORS = {
  ADMIN: "#B91C1C", MANAGER: "#7E22CE", ANALYST: "#16A34A", REPORTER: "#2563EB",
};
const ROLES = ["ADMIN", "MANAGER", "ANALYST", "REPORTER"];

function roleColor(role) {
  return ROLE_COLORS[(role || "").toUpperCase()] ?? "#555";
}
function initials(u) {
  const fn = u.firstName ?? u.name?.split(" ")[0] ?? "";
  const ln = u.lastName ?? u.name?.split(" ")[1] ?? "";
  return `${fn[0] ?? ""}${ln[0] ?? ""}`.toUpperCase() || "U";
}

const EMPTY_FORM = { firstName: "", lastName: "", email: "", password: "", role: "ANALYST", department: "", phone: "" };

const fieldStyle = {
  "& .MuiOutlinedInput-root": { bgcolor: "#1E1E1E", "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#C62828" }, "&.Mui-focused fieldset": { borderColor: "#C62828" } },
  "& input": { color: "#FFFFFF" },
  "& .MuiSelect-select": { color: "#FFFFFF" },
  "& .MuiSvgIcon-root": { color: "#9CA3AF" },
  "& label": { color: "#9CA3AF" },
};

function UserManagementContent() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({ open: false, mode: "create", user: null });
  const [viewUser, setViewUser] = useState(null); // User Details Modal State
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const fetchUsers = (kw) => {
    setLoading(true);
    const call = kw ? searchUsers(kw) : getAllUsers();
    call.then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(""); }, []);

  const handleSearch = (e) => {
    const v = e.target.value;
    setSearch(v);
    if (v.length === 0 || v.length >= 2) fetchUsers(v);
  };

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setDialog({ open: true, mode: "create", user: null });
  };

  const openEdit = (user) => {
    const id = user.userId ?? user.id;
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      email: user.email ?? "",
      password: "",
      role: user.role ?? "ANALYST",
      department: user.department ?? "",
      phone: user.phone ?? "",
    });
    setDialog({ open: true, mode: "edit", user: { ...user, id } });
  };

  const closeDialog = () => setDialog({ open: false, mode: "create", user: null });

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (dialog.mode === "create") {
        await createUser(form);
        setSnack({ open: true, message: "User created successfully!", severity: "success" });
      } else {
        await updateUser(dialog.user.id, form);
        setSnack({ open: true, message: "User updated successfully!", severity: "success" });
      }
      closeDialog();
      fetchUsers(search);
    } catch {
      setSnack({ open: true, message: "Failed to save user.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <>
      {/* Search + Add */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth placeholder="Search users..."
          value={search} onChange={handleSearch}
          sx={{
            "& .MuiOutlinedInput-root": { bgcolor: "#2B2B2B", "& fieldset": { borderColor: "#444" } },
            input: { color: "white" },
          }}
          InputProps={{ endAdornment: <SearchIcon sx={{ color: "#888" }} /> }}
        />
        <Button
          variant="contained" startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ bgcolor: "#C62828", px: 3, textTransform: "none", "&:hover": { bgcolor: "#B71C1C" } }}
        >
          Add User
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ bgcolor: "#2B2B2B", borderRadius: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress size={28} /></Box>
        ) : users.length === 0 ? (
          <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>No users found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#9CA3AF" }}>Name</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Email</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Role</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Department</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => {
                const id = user.userId ?? user.id;
                const name = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "—";
                return (
                  <TableRow
                    key={id}
                    hover
                    onClick={() => setViewUser(user)}
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#333333" } }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar sx={{ bgcolor: roleColor(user.role), width: 32, height: 32, fontSize: 13, fontWeight: 700 }}>
                          {initials(user)}
                        </Avatar>
                        <Box sx={{ color: "#FFFFFF", fontWeight: 600 }}>{name}</Box>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>{user.email}</TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small"
                        sx={{ bgcolor: roleColor(user.role), color: "#FFFFFF", fontWeight: 600 }} />
                    </TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>{user.department ?? "—"}</TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>{user.phone ?? "—"}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* User Details Dialog */}
      <Dialog
        open={Boolean(viewUser)}
        onClose={() => setViewUser(null)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#1F1F1F", color: "#FFFFFF", borderRadius: 2 } }}
      >
        {viewUser && (
          <>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #333", py: 2 }}>
              <Typography variant="h6" fontWeight={700} color="#FFFFFF">
                User Details
              </Typography>
              <IconButton onClick={() => setViewUser(null)}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
            </DialogTitle>
            <DialogContent sx={{ py: 3 }}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                <Avatar sx={{ bgcolor: roleColor(viewUser.role), width: 64, height: 64, fontSize: 24, fontWeight: 700, mb: 1.5 }}>
                  {initials(viewUser)}
                </Avatar>
                <Typography variant="h6" fontWeight={700} color="#FFFFFF">
                  {`${viewUser.firstName ?? ""} ${viewUser.lastName ?? ""}`.trim() || viewUser.username}
                </Typography>
                <Chip label={viewUser.role} size="small" sx={{ bgcolor: roleColor(viewUser.role), color: "#FFF", mt: 0.5, fontWeight: 600 }} />
              </Box>

              <Divider sx={{ bgcolor: "#333", mb: 2.5 }} />

              {[
                { label: "Email", value: viewUser.email },
                { label: "Department", value: viewUser.department ?? "—" },
                { label: "Phone", value: viewUser.phone ?? "—" },
                { label: "Status", value: viewUser.status ?? "ACTIVE" },
              ].map(({ label, value }) => (
                <Box key={label} mb={1.8}>
                  <Typography sx={{ color: "#888888", fontSize: 12 }}>{label}</Typography>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 15 }}>{value}</Typography>
                </Box>
              ))}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, borderTop: "1px solid #333", pt: 2 }}>
              <Button onClick={() => setViewUser(null)} sx={{ color: "#9CA3AF", textTransform: "none" }}>
                Close
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => {
                  const target = viewUser;
                  setViewUser(null);
                  openEdit(target);
                }}
                sx={{ bgcolor: "#C62828", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#B71C1C" } }}
              >
                Edit User
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: "#2B2B2B", color: "#FFFFFF" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor:"#1E1E1E",color:"#B71C1C" }}>
          {dialog.mode === "create" ? "Create New User" : "Edit User"}
          <IconButton onClick={closeDialog}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1,bgcolor:"#1E1E1E" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 1 }}>
            <TextField label="First Name" value={form.firstName} onChange={set("firstName")} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
            <TextField label="Last Name" value={form.lastName} onChange={set("lastName")} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
          </Box>
          <TextField fullWidth label="Email" value={form.email} onChange={set("email")} sx={{ ...fieldStyle, mt: 2 }} InputLabelProps={{ shrink: true }} />
          {dialog.mode === "create" && (
            <TextField fullWidth label="Password" type="password" value={form.password} onChange={set("password")} sx={{ ...fieldStyle, mt: 2 }} InputLabelProps={{ shrink: true }} />
          )}
          <TextField select fullWidth label="Role" value={form.role} onChange={set("role")} sx={{ ...fieldStyle, mt: 2 }} InputLabelProps={{ shrink: true }}>
            {ROLES.map((r) => <MenuItem key={r} value={r} sx={{ color: "#FFF", bgcolor: "#1E1E1E" }}>{r}</MenuItem>)}
          </TextField>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 2 }}>
            <TextField label="Department" value={form.department} onChange={set("department")} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
            <TextField label="Phone" value={form.phone} onChange={set("phone")} sx={fieldStyle} InputLabelProps={{ shrink: true }} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 ,bgcolor:"#1E1E1E"}}>
          <Button onClick={closeDialog} sx={{ color: "#9CA3AF", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}
            sx={{ bgcolor: "#C62828", textTransform: "none", "&:hover": { bgcolor: "#B71C1C" } }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : dialog.mode === "create" ? "Create User" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default UserManagementContent;