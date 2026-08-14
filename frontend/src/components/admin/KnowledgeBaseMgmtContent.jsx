import { useState, useEffect } from "react";
import {
  Box, Grid, Paper, Typography, TextField, Button, Table, TableHead,
  TableRow, TableCell, TableBody, Chip, InputAdornment, CircularProgress,
  Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import {
  filterArticles, getTotalArticles, getPublishedArticles,
  getDraftArticles, deleteArticle, createArticle, updateArticle,
} from "../../services/knowledgeService";

const inputStyle = {
  "& .MuiOutlinedInput-root": { bgcolor: "#2B2B2B", borderRadius: 2, "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#C62828" }, "&.Mui-focused fieldset": { borderColor: "#C62828" } },
  "& input": { color: "#FFFFFF" },
  "& textarea": { color: "#FFFFFF" },
  "& .MuiSelect-select": { color: "#FFFFFF" },
  "& label": { color: "#9CA3AF" },
  "& .MuiSvgIcon-root": { color: "#9CA3AF" },
};

const STATUSES = ["DRAFT", "PUBLISHED"];
const EMPTY = { title: "", category: "", content: "", tags: "", status: "DRAFT" };

function KnowledgeBaseMgmtContent() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ total: "—", published: "—", drafts: "—" });
  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });
  const [dialog, setDialog] = useState({ open: false, mode: "create", article: null });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const [viewDialog, setViewDialog] = useState({ open: false, article: null });

  const loadArticles = (kw = "") => {
    setLoading(true);
    const params = kw ? { search: kw } : {};
    filterArticles(params)
      .then((data) => {
        let list = Array.isArray(data) ? data : [];
        if (kw) {
          const s = kw.toLowerCase();
          list = list.filter(
            (a) =>
              a.title?.toLowerCase().includes(s) ||
              a.content?.toLowerCase().includes(s) ||
              a.category?.toLowerCase().includes(s) ||
              a.createdBy?.toLowerCase().includes(s)
          );
        }
        setArticles(list);
      })
      .catch(() => {
        getArticles()
          .then((data) => {
            let list = Array.isArray(data) ? data : [];
            if (kw) {
              const s = kw.toLowerCase();
              list = list.filter(
                (a) =>
                  a.title?.toLowerCase().includes(s) ||
                  a.content?.toLowerCase().includes(s) ||
                  a.category?.toLowerCase().includes(s)
              );
            }
            setArticles(list);
          })
          .catch(() => setArticles([]));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
    Promise.all([getTotalArticles(), getPublishedArticles(), getDraftArticles()])
      .then(([total, published, drafts]) => setStats({ total, published, drafts }))
      .catch(() => {});
  }, []);

  const openView = (article) => setViewDialog({ open: true, article });
  const closeView = () => setViewDialog({ open: false, article: null });

  const openCreate = () => { setForm(EMPTY); setDialog({ open: true, mode: "create", article: null }); };
  const openEdit = (article) => {
    setForm({
      title: article.title ?? "",
      category: article.category ?? "",
      content: article.content ?? "",
      tags: Array.isArray(article.tags) ? article.tags.join(", ") : article.tags ?? "",
      status: article.status ?? "DRAFT",
    });
    setDialog({ open: true, mode: "edit", article });
  };
  const closeDialog = () => setDialog({ open: false, mode: "create", article: null });

  const handleSubmit = async () => {
    setSaving(true);
    const payload = {
      ...form,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (dialog.mode === "create") {
        await createArticle(payload);
        setSnack({ open: true, message: "Article created!", severity: "success" });
      } else {
        await updateArticle(dialog.article.id, payload);
        setSnack({ open: true, message: "Article updated!", severity: "success" });
      }
      closeDialog();
      loadArticles(search);
    } catch {
      setSnack({ open: true, message: "Failed to save article.", severity: "error" });
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
      await deleteArticle(deleteConfirm.id);
      setSnack({ open: true, message: "Article deleted successfully.", severity: "success" });
      loadArticles(search);
    } catch {
      setSnack({ open: true, message: "Failed to delete article.", severity: "error" });
    } finally {
      closeDeleteConfirm();
    }
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <>
      {/* Search + New */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth placeholder="Search articles..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); loadArticles(e.target.value); }}
          sx={inputStyle}
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: "#9CA3AF" }} /></InputAdornment> }}
        />
        <Button variant="outlined" startIcon={<AddIcon />} onClick={openCreate}
          sx={{ width: 160, color: "#FFFFFF", borderColor: "#555", textTransform: "none",
            "&:hover": { borderColor: "#C62828" } }}>
          New Article
        </Button>
      </Box>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { label: "Total articles", value: stats.total, color: "#3B82F6" },
          { label: "Published", value: stats.published, color: "#22C55E" },
          { label: "Drafts", value: stats.drafts, color: "#F59E0B" },
        ].map(({ label, value, color }) => (
          <Grid size={{ xs: 12, md: 4 }} key={label}>
            <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
              <Typography sx={{color:"#9CA3AF"}}>{label}</Typography>
              <Typography variant="h3" sx={{ color, fontWeight: 700, mt: 1 }}>{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Table */}
      <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, overflow: "hidden" }}>
        {loading ? (
          <Box display="flex" justifyContent="center" py={4}><CircularProgress size={28} /></Box>
        ) : articles.length === 0 ? (
          <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>No articles found.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Article Title</TableCell>
                <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Views</TableCell>
                <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Author</TableCell>
                <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article) => {
                const isPublished = (article.status ?? "").toUpperCase() === "PUBLISHED";
                return (
                  <TableRow
                    key={article.id ?? article.title}
                    hover
                    onClick={() => openView(article)}
                    sx={{ cursor: "pointer", "&:hover": { bgcolor: "#353535" } }}
                  >
                    <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>{article.title}</TableCell>
                    <TableCell>
                      <Chip label={article.status ?? "Draft"} size="small"
                        sx={{ bgcolor: isPublished ? "#16A34A" : "#D97706", color: "#FFFFFF", fontWeight: 600 }} />
                    </TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>{article.viewCount ?? 0}</TableCell>
                    <TableCell sx={{ color: "#9CA3AF" }}>{article.createdBy ?? article.author ?? "System"}</TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" onClick={() => openEdit(article)}>
                        <EditOutlinedIcon sx={{ color: "#9CA3AF", fontSize: 18 }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => requestDelete(article.id)}>
                        <DeleteOutlineIcon sx={{ color: "#EF4444", fontSize: 18 }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Paper>

      {/* View Article Details Dialog */}
      <Dialog open={viewDialog.open} onClose={closeView} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: "#2B2B2B", color: "#FFFFFF", p: 1 } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" ,bgcolor : "#1E1E1E" }}>
          <Box display="flex" alignItems="center" gap={1.5}>
            <Typography variant="h6" sx={{ fontWeight: 700 ,color:"#C62828" }}>
              {viewDialog.article?.title ?? "Article Details"}
            </Typography>
          </Box>
          <IconButton onClick={closeView}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#444", display: "flex", flexDirection: "column", gap: 2 , bgcolor : "#1E1E1E"}}>
          {viewDialog.article?.category && (
            <Box>
              <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>CATEGORY</Typography>
              <Chip label={viewDialog.article.category} size="small" sx={{ bgcolor: "#1565C0", color: "#FFF" }} />
            </Box>
          )}

          <Box>
            <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>CONTENT</Typography>
            <Typography sx={{ color: "#D1D5DB", lineHeight: 1.6, whitespace: "pre-wrap" }}>
              {viewDialog.article?.content ?? viewDialog.article?.description ?? "No content provided."}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between" pt={1}>
            <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>
              Author: <span style={{ color: "#FFF" }}>{viewDialog.article?.createdBy ?? viewDialog.article?.author ?? "System"}</span>
            </Typography>
            <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>
              Status: <span style={{ color: viewDialog.article?.status === "PUBLISHED" ? "#4ADE80" : "#F59E0B", fontWeight: 600 }}>{viewDialog.article?.status ?? "DRAFT"}</span>
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 ,bgcolor: "#1E1E1E"}}>
          <Button variant="outlined" onClick={closeView} sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}>
            Close
          </Button>
          <Button variant="contained" onClick={() => { const a = viewDialog.article; closeView(); openEdit(a); }}
            sx={{ bgcolor: "#C62828", textTransform: "none", "&:hover": { bgcolor: "#B71C1C" } }}>
            Edit Article
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create/Edit Dialog */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: "#2B2B2B", color: "#FFFFFF" } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" ,bgcolor : "#1E1E1E" , color : "#9CA3AF"}}>
          {dialog.mode === "create" ? "New Knowledge Base Article" : "Edit Article"}
          <IconButton onClick={closeDialog}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 , bgcolor : "#1E1E1E" }}>
          <TextField label="Title" value={form.title} onChange={set("title")}
            sx={inputStyle} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Category" value={form.category} onChange={set("category")}
            sx={inputStyle} InputLabelProps={{ shrink: true }} fullWidth
            placeholder="e.g. SQL Injection, Phishing" />
          <TextField label="Content" value={form.content} onChange={set("content")}
            multiline rows={5} sx={inputStyle} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField label="Tags (comma separated)" value={form.tags} onChange={set("tags")}
            sx={inputStyle} InputLabelProps={{ shrink: true }} fullWidth />
          <TextField select label="Status" value={form.status} onChange={set("status")}
            sx={inputStyle} InputLabelProps={{ shrink: true }} fullWidth>
            {STATUSES.map((s) => (
              <MenuItem key={s} value={s} sx={{bgcolor: "#fffdfd" }}>{s}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 ,bgcolor : "#1E1E1E"}}>
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
          Delete Knowledge Base Article?
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#D1D5DB", lineHeight: 1.6 }}>
            Are you sure you want to delete this knowledge base article? This action cannot be undone.
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

export default KnowledgeBaseMgmtContent;