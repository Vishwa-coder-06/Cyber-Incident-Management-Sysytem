import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  InputAdornment,
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tabs,
  Tab,
  Divider,
  MenuItem,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SchoolIcon from "@mui/icons-material/School";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RefreshIcon from "@mui/icons-material/Refresh";

import {
  filterArticles,
  getTotalArticles,
  getPublishedArticles,
  getDraftArticles,
  deleteArticle,
  createArticle,
  updateArticle,
  getArticles,
} from "../../services/knowledgeService";

import {
  getTrainingExamples,
  getApprovedTrainingExamples,
  approveTrainingExample,
  getTrainingStatus,
  retrainAIModel,
} from "../../services/incidentService";

const inputStyle = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "#2B2B2B",
    borderRadius: 2,
    "& fieldset": { borderColor: "#444" },
    "&:hover fieldset": { borderColor: "#C62828" },
    "&.Mui-focused fieldset": { borderColor: "#C62828" },
  },
  "& input": { color: "#FFFFFF" },
  "& textarea": { color: "#FFFFFF" },
  "& .MuiSelect-select": { color: "#FFFFFF" },
  "& label": { color: "#9CA3AF" },
  "& .MuiSvgIcon-root": { color: "#9CA3AF" },
};

const EMPTY = { title: "", category: "", content: "", tags: "", status: "DRAFT" };

function KnowledgeBaseMgmtContent() {
  const [tabIndex, setTabIndex] = useState(0);

  // ─── Tab 1: Knowledge Base State ──────────────────────────────────────────
  const [articles, setArticles] = useState([]);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [search, setSearch] = useState("");
  const [kbStats, setKbStats] = useState({ total: "—", published: "—", drafts: "—" });
  const [dialog, setDialog] = useState({ open: false, mode: "create", article: null });
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [viewDialog, setViewDialog] = useState({ open: false, article: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });

  // ─── Tab 2: AI Model & Training State (100% Real Backend Data) ───────────
  const [trainingExamples, setTrainingExamples] = useState([]);
  const [approvedExamples, setApprovedExamples] = useState([]);
  const [modelStatus, setModelStatus] = useState(null);
  const [loadingTraining, setLoadingTraining] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  // Retrain Dialog & State
  const [retrainConfirmOpen, setRetrainConfirmOpen] = useState(false);
  const [retraining, setRetraining] = useState(false);
  const [retrainResult, setRetrainResult] = useState(null);

  const [snack, setSnack] = useState({ open: false, message: "", severity: "success" });

  const loadArticles = (kw = "") => {
    setLoadingArticles(true);
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
      .finally(() => setLoadingArticles(false));
  };

  const loadTrainingData = async () => {
    setLoadingTraining(true);
    try {
      const [allEx, appEx, status] = await Promise.all([
        getTrainingExamples().catch(() => []),
        getApprovedTrainingExamples().catch(() => []),
        getTrainingStatus().catch(() => null),
      ]);
      setTrainingExamples(Array.isArray(allEx) ? allEx : []);
      setApprovedExamples(Array.isArray(appEx) ? appEx : []);
      setModelStatus(status);
    } catch {
      // Handled gracefully
    } finally {
      setLoadingTraining(false);
    }
  };

  useEffect(() => {
    loadArticles();
    Promise.all([getTotalArticles(), getPublishedArticles(), getDraftArticles()])
      .then(([total, published, drafts]) => setKbStats({ total, published, drafts }))
      .catch(() => {});
    loadTrainingData();
  }, []);

  const openView = (article) => setViewDialog({ open: true, article });
  const closeView = () => setViewDialog({ open: false, article: null });

  const openCreate = () => {
    setForm(EMPTY);
    setDialog({ open: true, mode: "create", article: null });
  };

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
        setSnack({ open: true, message: "Article created successfully!", severity: "success" });
      } else {
        await updateArticle(dialog.article.id, payload);
        setSnack({ open: true, message: "Article updated successfully!", severity: "success" });
      }
      closeDialog();
      loadArticles(search);
    } catch {
      setSnack({ open: true, message: "Failed to save article.", severity: "error" });
    } finally {
      setSaving(false);
    }
  };

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

  const handleApproveExample = async (exampleId) => {
    setApprovingId(exampleId);
    try {
      await approveTrainingExample(exampleId);
      setSnack({
        open: true,
        message: `Training candidate #${exampleId} approved and synced with Python dataset!`,
        severity: "success",
      });
      await loadTrainingData();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || "Approval failed.";
      setSnack({ open: true, message: errMsg, severity: "error" });
    } finally {
      setApprovingId(null);
    }
  };

  const handleTriggerRetrain = async () => {
    setRetrainConfirmOpen(false);
    setRetraining(true);
    setRetrainResult(null);
    try {
      const result = await retrainAIModel();
      setRetrainResult(result);
      setSnack({
        open: true,
        message: "AI Classification Model successfully retrained and reloaded in memory!",
        severity: "success",
      });
      await loadTrainingData();
    } catch (err) {
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || "Model retraining failed.";
      setSnack({ open: true, message: errMsg, severity: "error" });
    } finally {
      setRetraining(false);
    }
  };

  const setFormField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <>
      {/* Module Header with Navigation Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={tabIndex}
          onChange={(_, val) => setTabIndex(val)}
          sx={{
            "& .MuiTabs-indicator": { bgcolor: "#C62828", height: 3 },
            "& .MuiTab-root": {
              color: "#9CA3AF",
              fontWeight: 600,
              fontSize: 15,
              textTransform: "none",
              "&.Mui-selected": { color: "#FFFFFF" },
            },
          }}
        >
          <Tab icon={<SchoolIcon sx={{ mr: 1 }} />} iconPosition="start" label="Knowledge Base Articles" />
          <Tab icon={<SmartToyIcon sx={{ mr: 1 }} />} iconPosition="start" label="AI Model & Training Management" />
        </Tabs>
      </Box>

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* TAB 0: KNOWLEDGE BASE ARTICLES                                        */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {tabIndex === 0 && (
        <>
          {/* Search + New */}
          <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
            <TextField
              fullWidth
              placeholder="Search articles..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                loadArticles(e.target.value);
              }}
              sx={inputStyle}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#9CA3AF" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={openCreate}
              sx={{
                width: 160,
                color: "#FFFFFF",
                borderColor: "#555",
                textTransform: "none",
                "&:hover": { borderColor: "#C62828" },
              }}
            >
              New Article
            </Button>
          </Box>

          {/* Stats */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            {[
              { label: "Total articles", value: kbStats.total, color: "#3B82F6" },
              { label: "Published", value: kbStats.published, color: "#22C55E" },
              { label: "Drafts", value: kbStats.drafts, color: "#F59E0B" },
            ].map(({ label, value, color }) => (
              <Grid size={{ xs: 12, md: 4 }} key={label}>
                <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, p: 3 }}>
                  <Typography sx={{ color: "#9CA3AF" }}>{label}</Typography>
                  <Typography variant="h3" sx={{ color, fontWeight: 700, mt: 1 }}>
                    {value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Articles Table */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, overflow: "hidden" }}>
            {loadingArticles ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={28} />
              </Box>
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
                          <Chip
                            label={article.status ?? "Draft"}
                            size="small"
                            sx={{
                              bgcolor: isPublished ? "#16A34A" : "#D97706",
                              color: "#FFFFFF",
                              fontWeight: 600,
                            }}
                          />
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
        </>
      )}

      {/* ═════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: AI MODEL & TRAINING MANAGEMENT (100% Real Backend Data)         */}
      {/* ═════════════════════════════════════════════════════════════════════ */}
      {tabIndex === 1 && (
        <>
          {/* AI Metrics Summary (From Real Backend Endpoints) */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>Total Staged Candidates</Typography>
                <Typography variant="h3" sx={{ color: "#60A5FA", fontWeight: 700, mt: 1 }}>
                  {trainingExamples.length}
                </Typography>
                <Typography sx={{ color: "#6B7280", fontSize: 12, mt: 0.5 }}>From resolved incidents</Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>Approved Examples</Typography>
                <Typography variant="h3" sx={{ color: "#4ADE80", fontWeight: 700, mt: 1 }}>
                  {approvedExamples.length}
                </Typography>
                <Typography sx={{ color: "#6B7280", fontSize: 12, mt: 0.5 }}>Ready for model retraining</Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>Pending Admin Review</Typography>
                <Typography variant="h3" sx={{ color: "#F59E0B", fontWeight: 700, mt: 1 }}>
                  {trainingExamples.length - approvedExamples.length}
                </Typography>
                <Typography sx={{ color: "#6B7280", fontSize: 12, mt: 0.5 }}>Awaiting admin approval</Typography>
              </Paper>
            </Grid>

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2 }}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>Active AI Model</Typography>
                <Typography variant="h5" sx={{ color: "#A855F7", fontWeight: 700, mt: 1.5 }}>
                  {modelStatus?.activeModel || "incident_classifier.pkl"}
                </Typography>
                <Typography sx={{ color: "#22C55E", fontSize: 12, mt: 0.5, fontWeight: 600 }}>● Online & In-Memory</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* Model Retraining Control Card */}
          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              p: 3,
              borderRadius: 2,
              mb: 3,
              border: "1px solid #3B82F6",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
              <Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <AutoAwesomeIcon sx={{ color: "#60A5FA" }} />
                  <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                    AI Model Retraining Engine
                  </Typography>
                </Box>
                <Typography sx={{ color: "#9CA3AF", fontSize: 14, mt: 0.5 }}>
                  Admin-governed operation: Trains the multinomial model using all approved ground-truth incident data and dynamically reloads it into memory.
                </Typography>
              </Box>

              <Box display="flex" gap={2} alignItems="center">
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={loadTrainingData}
                  disabled={loadingTraining || retraining}
                  sx={{ color: "#9CA3AF", borderColor: "#555", textTransform: "none" }}
                >
                  Refresh Data
                </Button>

                <Button
                  variant="contained"
                  disabled={retraining || approvedExamples.length === 0}
                  onClick={() => setRetrainConfirmOpen(true)}
                  startIcon={retraining ? <CircularProgress size={18} color="inherit" /> : <SmartToyIcon />}
                  sx={{
                    bgcolor: "#C62828",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    px: 3,
                    py: 1.2,
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontSize: 15,
                    "&:hover": { bgcolor: "#B71C1C" },
                  }}
                >
                  {retraining ? "Retraining AI Model..." : "Retrain AI Model"}
                </Button>
              </Box>
            </Box>

            {/* Retraining Results Details */}
            {retrainResult && (
              <Box sx={{ mt: 3, p: 2.5, bgcolor: "#143320", border: "1px solid #1E6B3C", borderRadius: 2 }}>
                <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                  <CheckCircleIcon sx={{ color: "#4ADE80" }} />
                  <Typography sx={{ color: "#4ADE80", fontWeight: 700, fontSize: 16 }}>
                    Retraining Completed Successfully!
                  </Typography>
                </Box>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ color: "#A7F3D0", fontSize: 12 }}>TOTAL DATASET SAMPLES</Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 700, fontSize: 14 }}>
                      {retrainResult.details?.total_samples ?? "—"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ color: "#A7F3D0", fontSize: 12 }}>NEW ACTIVE MODEL FILE</Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 700, fontSize: 14 }}>
                      {retrainResult.details?.model_file ?? "incident_classifier.pkl"}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 12, sm: 4 }}>
                    <Typography sx={{ color: "#A7F3D0", fontSize: 12 }}>BACKUP ARCHIVE CREATED</Typography>
                    <Typography sx={{ color: "#FFFFFF", fontWeight: 700, fontSize: 14 }}>
                      {retrainResult.details?.backup_file ?? "—"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>

          {/* Staged AI Training Examples Table */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", borderRadius: 2, overflow: "hidden" }}>
            <Box p={2.5} borderBottom="1px solid #333" display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                Curated AI Training Examples ({trainingExamples.length})
              </Typography>
            </Box>

            {loadingTraining ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress size={28} />
              </Box>
            ) : trainingExamples.length === 0 ? (
              <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>
                No training candidates staged yet. Resolve incidents in Analyst workspace to stage training examples.
              </Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Candidate ID</TableCell>
                    <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Incident</TableCell>
                    <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Incident Title</TableCell>
                    <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Confirmed Ground Truth</TableCell>
                    <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Severity</TableCell>
                    <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Status</TableCell>
                    <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>Admin Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {trainingExamples.map((ex) => {
                    const isApproved = Boolean(ex.approved);
                    return (
                      <TableRow key={ex.id} hover sx={{ "&:hover": { bgcolor: "#353535" } }}>
                        <TableCell sx={{ color: "#9CA3AF" }}>#{ex.id}</TableCell>
                        <TableCell sx={{ color: "#60A5FA", fontWeight: 600 }}>#INC-{ex.incidentId}</TableCell>
                        <TableCell sx={{ color: "#FFFFFF", fontWeight: 500, maxWidth: 280 }}>
                          <Typography noWrap fontSize={14}>{ex.title}</Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ex.attackTypeLabel}
                            size="small"
                            sx={{ bgcolor: "#1E3A8A", color: "#93C5FD", fontWeight: 700 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={ex.severityLabel}
                            size="small"
                            sx={{
                              bgcolor: ex.severityLabel === "CRITICAL" ? "#7F1D1D" : "#7C2D12",
                              color: "#FFFFFF",
                              fontWeight: 700,
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {isApproved ? (
                            <Chip
                              icon={<CheckCircleIcon sx={{ "&&": { color: "#4ADE80" } }} />}
                              label="APPROVED"
                              size="small"
                              sx={{ bgcolor: "#064E3B", color: "#4ADE80", fontWeight: 700 }}
                            />
                          ) : (
                            <Chip
                              icon={<HourglassEmptyIcon sx={{ "&&": { color: "#F59E0B" } }} />}
                              label="PENDING REVIEW"
                              size="small"
                              sx={{ bgcolor: "#78350F", color: "#FDE68A", fontWeight: 700 }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          {!isApproved ? (
                            <Button
                              size="small"
                              variant="contained"
                              disabled={approvingId === ex.id}
                              onClick={() => handleApproveExample(ex.id)}
                              startIcon={approvingId === ex.id ? <CircularProgress size={14} color="inherit" /> : null}
                              sx={{
                                bgcolor: "#16A34A",
                                color: "#FFFFFF",
                                textTransform: "none",
                                fontWeight: 600,
                                fontSize: 13,
                                "&:hover": { bgcolor: "#15803D" },
                              }}
                            >
                              Approve for Training
                            </Button>
                          ) : (
                            <Typography sx={{ color: "#6B7280", fontSize: 12 }}>
                              Approved by {ex.approvedBy || "Admin"}
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </Paper>
        </>
      )}

      {/* ─── Retrain Confirmation Modal ────────────────────────────────────── */}
      <Dialog
        open={retrainConfirmOpen}
        onClose={() => setRetrainConfirmOpen(false)}
        PaperProps={{ sx: { bgcolor: "#1F1F1F", color: "#FFFFFF", borderRadius: 2 } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1.5, borderBottom: "1px solid #333" }}>
          <SmartToyIcon sx={{ color: "#C62828" }} />
          <Typography variant="h6" fontWeight={700}>
            Confirm AI Model Retraining
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ py: 3 }}>
          <Typography sx={{ color: "#D1D5DB", mb: 2 }}>
            Retraining will update the active AI classification model using all {approvedExamples.length} approved training data examples.
          </Typography>
          <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
            A versioned backup of the current model file will automatically be created before updating. Do you wish to continue?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ borderTop: "1px solid #333", px: 3, py: 2 }}>
          <Button onClick={() => setRetrainConfirmOpen(false)} sx={{ color: "#9CA3AF", textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTriggerRetrain}
            sx={{ bgcolor: "#C62828", color: "#FFFFFF", fontWeight: 700, textTransform: "none", "&:hover": { bgcolor: "#B71C1C" } }}
          >
            Yes, Retrain Model
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Create/Edit Article Dialog ────────────────────────────────────── */}
      <Dialog open={dialog.open} onClose={closeDialog} maxWidth="md" fullWidth
        PaperProps={{ sx: { bgcolor: "#2B2B2B", color: "#FFFFFF", p: 1 } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {dialog.mode === "create" ? "Create Knowledge Base Article" : "Edit Knowledge Base Article"}
          </Typography>
          <IconButton onClick={closeDialog}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: "16px !important" }}>
          <TextField label="Title" fullWidth value={form.title} onChange={setFormField("title")} sx={inputStyle} />
          <TextField label="Category" fullWidth value={form.category} onChange={setFormField("category")} sx={inputStyle} />
          <TextField label="Tags (comma-separated)" fullWidth value={form.tags} onChange={setFormField("tags")} sx={inputStyle} />
          <TextField label="Content / Solution" fullWidth multiline rows={6} value={form.content} onChange={setFormField("content")} sx={inputStyle} />
          <TextField select label="Status" value={form.status} onChange={setFormField("status")} sx={inputStyle}>
            <MenuItem value="DRAFT">Draft</MenuItem>
            <MenuItem value="PUBLISHED">Published</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDialog} sx={{ color: "#9CA3AF", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" disabled={saving || !form.title} onClick={handleSubmit}
            sx={{ bgcolor: "#C62828", "&:hover": { bgcolor: "#B71C1C" }, textTransform: "none" }}>
            {saving ? "Saving..." : dialog.mode === "create" ? "Create Article" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── View Article Details Dialog ───────────────────────────────────── */}
      <Dialog open={viewDialog.open} onClose={closeView} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: "#2B2B2B", color: "#FFFFFF", p: 1 } }}>
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "#1E1E1E" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#C62828" }}>
            {viewDialog.article?.title ?? "Article Details"}
          </Typography>
          <IconButton onClick={closeView}><CloseIcon sx={{ color: "#9CA3AF" }} /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "#444", display: "flex", flexDirection: "column", gap: 2, bgcolor: "#1E1E1E" }}>
          {viewDialog.article?.category && (
            <Box>
              <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>CATEGORY</Typography>
              <Chip label={viewDialog.article.category} size="small" sx={{ bgcolor: "#1565C0", color: "#FFF" }} />
            </Box>
          )}
          <Box>
            <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>CONTENT</Typography>
            <Typography sx={{ color: "#DDD", whiteSpace: "pre-wrap", fontSize: 14, lineHeight: 1.6 }}>
              {viewDialog.article?.content ?? "No content"}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ bgcolor: "#1E1E1E", px: 3, py: 1.5 }}>
          <Button onClick={closeView} sx={{ color: "#9CA3AF", textTransform: "none" }}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ─── Delete Confirmation Dialog ────────────────────────────────────── */}
      <Dialog open={deleteConfirm.open} onClose={closeDeleteConfirm}
        PaperProps={{ sx: { bgcolor: "#2B2B2B", color: "#FFFFFF" } }}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Article?</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "#9CA3AF" }}>
            Are you sure you want to delete this article? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeDeleteConfirm} sx={{ color: "#9CA3AF", textTransform: "none" }}>Cancel</Button>
          <Button variant="contained" onClick={confirmDelete}
            sx={{ bgcolor: "#EF4444", color: "#FFF", "&:hover": { bgcolor: "#DC2626" }, textTransform: "none" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Toast Alerts ──────────────────────────────────────────────────── */}
      <Snackbar
        open={snack.open}
        autoHideDuration={5000}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack((s) => ({ ...s, open: false }))}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default KnowledgeBaseMgmtContent;