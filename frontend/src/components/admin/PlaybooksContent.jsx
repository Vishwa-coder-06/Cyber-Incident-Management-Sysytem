import { useState, useEffect } from "react";
import {
  Paper, Box, TextField, Button, Table, TableHead, TableBody,
  TableRow, TableCell, Chip, IconButton, CircularProgress, Typography,
  Dialog, DialogTitle, DialogContent, DialogActions, MenuItem, Snackbar, Alert,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { getPlaybooks, searchPlaybooks, createPlaybook, updatePlaybook, deletePlaybook } from "../../services/knowledgeService";

const CATEGORIES = ["AUTH", "MALWARE", "PHISHING", "NETWORK", "DATA", "DDOS", "OTHER"];
const CAT_COLORS = {
  AUTH: "#2563EB", MALWARE: "#B91C1C", PHISHING: "#D97706",
  NETWORK: "#16A34A", DATA: "#7E22CE", DDOS: "#0891B2",
};

const inputStyle = {
  "& .MuiOutlinedInput-root": { bgcolor: "#2B2B2B", "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#C62828" }, "&.Mui-focused fieldset": { borderColor: "#C62828" } },
  "& input": { color: "#FFFFFF" },
  "& .MuiSelect-select": { color: "#FFFFFF" },
  "& .MuiSvgIcon-root": { color: "#9CA3AF" },
  "& label": { color: "#9CA3AF" },
};

const EMPTY = { name: "", category: "MALWARE", description: "", steps: "" };

function PlaybooksContent() {
  const [playbooks, setPlaybooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [dialog, setDialog] = useState({ open: false, mode: "create", pb: null });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const loadPlaybooks = (kw = "") => {
    setLoading(true);
    const call = kw ? searchPlaybooks(kw) : getPlaybooks();
    call.then((data) => setPlaybooks(Array.isArray(data) ? data : []))
      .catch(() => setPlaybooks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPlaybooks(); }, []);

  const openCreate = () => { setForm(EMPTY); setDialog({ open: true, mode: "create", pb: null }); };
  const openEdit = (pb) => {
    setForm({
      name: pb.name ?? pb.title ?? "",
      category: pb.category ?? "MALWARE",
      description: pb.description ?? "",
      steps: Array.isArray(pb.steps) ? pb.steps.join("\n") : pb.steps ?? "",
    });
    setDialog({ open: true, mode: "edit", pb });
  };
  const closeDialog = () => setDialog({ open: false, mode: "create", pb: null });

  const handleSubmit = async () => {
    setSaving(true);
    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      steps: form.steps.split("\n").map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (dialog.mode === "create") {
        await createPlaybook(payload);
        setSnack({ open: true, message: "Playbook created!", severity: "success" });
      } else {
        await updatePlaybook(dialog.pb.id, payload);
        setSnack({ open: true, message: "Playbook updated!", severity: "success" });
      }
      closeDialog();
      loadPlaybooks(search);
    } catch {
      setSnack({ open: true, message: "Failed to save playbook.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  const requestDelete = (id) => setDeleteConfirm({ open: true, id });
  const closeDeleteConfirm = () => setDeleteConfirm({ open: false, id: null });

  const confirmDelete = async () => {
    if (!deleteConfirm.id) return;
    try {
      await deletePlaybook(deleteConfirm.id);
      setSnack({ open: true, message: "Playbook deleted successfully.", severity: "success" });
      loadPlaybooks(search);
    } catch {
      setSnack({ open: true, message: "Failed to delete playbook.", severity: "error" });
    } finally {
      closeDeleteConfirm();
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const [viewDialog, setViewDialog] = useState({ open: false, pb: null });

  const openView = (pb) => { setViewDialog({ open: true, pb }); };
  const closeView = () => setViewDialog({ open: false, pb: null });

  return (
    <>
      {/* Search + New */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth placeholder="Search playbooks..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); loadPlaybooks(e.target.value); }}
          sx={inputStyle}
          InputProps={{ endAdornment: <SearchIcon sx={{ color: "#888888" }} /> }}
        />
        <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}
          sx={{ borderColor: "#666", color: "#FFFFFF", textTransform: "none", px: 3,
            "&:hover": { borderColor: "#C62828" } }}>
          New Playbook
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ bgcolor: "#2B2B2B", borderRadius: 2 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress size={28} /></Box>
        ) : playbooks.length === 0 ? (
          <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>No playbooks found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#9CA3AF" }}>Playbook Name</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Steps</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Category</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Last Updated</TableCell>
                <TableCell sx={{ color: "#9CA3AF" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {playbooks.map((pb) => {
                const cat = (pb.category ?? "").toUpperCase();
                const stepCount = Array.isArray(pb.steps) ? pb.steps.length : pb.stepCount ?? "—";
                return (
                  <TableRow
                    key={pb.id ?? pb.name}
                    hover
                    onClick={() => openView(pb)}
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#333333" } }}
                  >
                    <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>{pb.name ?? pb.title}</TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>
                      {stepCount !== "—" ? `${stepCount} steps` : "—"}
                    </TableCell>
                    <TableCell>
                      <Chip label={pb.category ?? "—"} size="small"
                        sx={{ bgcolor: CAT_COLORS[cat] ?? "#555", color: "#FFFFFF" }} />
                    </TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>
                      {pb.updatedAt ? new Date(pb.updatedAt).toLocaleDateString() : "Active"}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={() => openEdit(pb)}>
                        <EditOutlinedIcon sx={{ color: "#9CA3AF" }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => requestDelete(pb.id)}>
                        <DeleteOutlineOutlinedIcon sx={{ color: "#EF4444" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* View Details Dialog */}
      <Dialog open={viewDialog.open} onClose={closeView} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: "#2B2B2B", color: "#FFFFFF", p: 1 } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" ,bgcolor : "#1E1E1E" }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
              {viewDialog.pb?.name ?? viewDialog.pb?.title ?? "Playbook Details"}
            </Typography>
            {viewDialog.pb?.category && (
              <Chip label={viewDialog.pb.category} size="small"
                sx={{ bgcolor: CAT_COLORS[(viewDialog.pb.category).toUpperCase()] ?? "#555", color: "#FFF" }} />
            )}
          </Box>
          <IconButton onClick={closeView}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#444", display: "flex", flexDirection: "column", gap: 2 ,bgcolor:"#1E1E1E"}}>
          {viewDialog.pb?.description && (
            <Box>
              <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>DESCRIPTION</Typography>
              <Typography sx={{ color: "#D1D5DB", lineHeight: 1.6 }}>{viewDialog.pb.description}</Typography>
            </Box>
          )}

          <Box>
            <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 1 }}>CONTAINMENT STEPS</Typography>
            {Array.isArray(viewDialog.pb?.steps) && viewDialog.pb.steps.length > 0 ? (
              viewDialog.pb.steps.map((step, idx) => (
                <Box key={idx} display="flex" gap={1.5} mb={1}>
                  <Typography sx={{ color: "#EF4444", fontWeight: 700, minWidth: 20 }}>{idx + 1}.</Typography>
                  <Typography sx={{ color: "#FFFFFF", lineHeight: 1.5 }}>
                    {typeof step === "string" ? step : step.name ?? step.title ?? JSON.stringify(step)}
                  </Typography>
                </Box>
              ))
            ) : typeof viewDialog.pb?.steps === "string" && viewDialog.pb.steps.trim() ? (
              viewDialog.pb.steps.split("\n").filter(Boolean).map((step, idx) => (
                <Box key={idx} display="flex" gap={1.5} mb={1}>
                  <Typography sx={{ color: "#EF4444", fontWeight: 700, minWidth: 20 }}>{idx + 1}.</Typography>
                  <Typography sx={{ color: "#FFFFFF", lineHeight: 1.5 }}>{step}</Typography>
                </Box>
              ))
            ) : (
              <Typography sx={{ color: "#9CA3AF" }}>No steps recorded for this playbook.</Typography>
            )}
          </Box>

          <Box display="flex" justifyContent="space-between" pt={1}>
            <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>
              Status: <span style={{ color: "#4ADE80", fontWeight: 600 }}>Active</span>
            </Typography>
            {viewDialog.pb?.updatedAt && (
              <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>
                Updated: {new Date(viewDialog.pb.updatedAt).toLocaleDateString()}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 , bgcolor : "#1E1E1E" }}>
          <Button variant="outlined" onClick={closeView} sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}>
            Close
          </Button>
          <Button variant="contained" onClick={() => { const pb = viewDialog.pb; closeView(); openEdit(pb); }}
            sx={{ bgcolor: "#C62828", textTransform: "none", "&:hover": { bgcolor: "#B71C1C" } }}>
            Edit Playbook
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: "#2B2B2B", color: "#FFFFFF" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center",bgcolor:"#1E1E1E",color:"#B71C1C" }}>
          {dialog.mode === "create" ? "New Playbook" : "Edit Playbook"}
          <IconButton onClick={closeDialog}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2,bgcolor:"#1E1E1E",color:"#FFFFFF" }}>
          <TextField label="Playbook Name" value={form.name} onChange={set("name")}
            sx={inputStyle} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField select label="Category" value={form.category} onChange={set("category")}
            sx={inputStyle} InputLabelProps={{ shrink: true }} fullWidth>
            {CATEGORIES.map((c) => (
              <MenuItem key={c} value={c} sx={{ color: "#FFF", bgcolor: "#1E1E1E" }}>{c}</MenuItem>
            ))}
          </TextField>
          <TextField label="Description" value={form.description} onChange={set("description")}
            multiline rows={2} sx={inputStyle} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Steps (one per line)" value={form.steps} onChange={set("steps")}
            multiline rows={5} sx={inputStyle} InputLabelProps={{ shrink: true }} fullWidth
            placeholder="Step 1&#10;Step 2&#10;Step 3" />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2,bgcolor:"#1e1e1e" }}>
          <Button onClick={closeDialog} sx={{ color: "#9CA3AF", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={saving}
            sx={{ bgcolor: "#C62828", textTransform: "none", "&:hover": { bgcolor: "#B71C1C" } }}>
            {saving ? <CircularProgress size={18} color="inherit" /> : dialog.mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirm.open}
        onClose={closeDeleteConfirm}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { bgcolor: "#1F1F1F", color: "#FFFFFF" } }}
      >
        <DialogTitle sx={{ color: "#EF4444", fontWeight: 700, pb: 1 }}>
          Delete Playbook?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#D1D5DB", lineHeight: 1.6 }}>
            Are you sure you want to delete this playbook? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={closeDeleteConfirm} sx={{ color: "#9CA3AF", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={confirmDelete}
            sx={{ bgcolor: "#C62828", textTransform: "none", fontWeight: 600, "&:hover": { bgcolor: "#B71C1C" } }}
          >
            Delete
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

export default PlaybooksContent;