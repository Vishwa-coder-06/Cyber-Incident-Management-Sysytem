import { useState, useEffect } from "react";
import {
  Box, Grid, Paper, Typography, Chip, Stack, Button, CircularProgress,
  Dialog, DialogTitle, DialogContent, DialogActions, IconButton,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useLocation, useNavigate } from "react-router-dom";
import { getArticleById, getArticles, getPlaybooks } from "../../services/knowledgeService";

function ArticleViewContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const articleId = location.state?.articleId;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  // Playbook Dialog State
  const [playbookDialog, setPlaybookDialog] = useState({ open: false, playbook: null, loading: false });

  useEffect(() => {
    setLoading(true);
    if (articleId) {
      getArticleById(articleId)
        .then(setArticle)
        .catch(() => setArticle(null))
        .finally(() => setLoading(false));
    } else {
      // Fallback: fetch articles and load the first article if no state passed
      getArticles()
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setArticle(data[0]);
          } else {
            setArticle(null);
          }
        })
        .catch(() => setArticle(null))
        .finally(() => setLoading(false));
    }
  }, [articleId]);

  const handlePlaybookClick = async (playbookTitle) => {
    if (!playbookTitle) return;
    setPlaybookDialog({ open: true, playbook: null, loading: true });
    try {
      const all = await getPlaybooks();
      const found = Array.isArray(all)
        ? all.find((p) =>
            (p.name ?? p.title ?? "").toLowerCase() === playbookTitle.toLowerCase()
          ) ?? all.find((p) =>
            (p.name ?? p.title ?? "").toLowerCase().includes(playbookTitle.toLowerCase().split(" ")[0])
          )
        : null;
      setPlaybookDialog({ open: true, playbook: found ?? { title: playbookTitle }, loading: false });
    } catch {
      setPlaybookDialog({ open: true, playbook: { title: playbookTitle }, loading: false });
    }
  };

  const closePlaybookDialog = () => setPlaybookDialog({ open: false, playbook: null, loading: false });

  if (loading) {
    return <Box display="flex" justifyContent="center" py={6}><CircularProgress /></Box>;
  }

  if (!article) {
    return (
      <Box py={4} textAlign="center">
        <Typography sx={{ color: "#9CA3AF", mb: 2 }}>
          No article selected or available.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/analyst/knowledge-base")}
          sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
        >
          Go to Knowledge Base
        </Button>
      </Box>
    );
  }

  const steps = article.symptoms ?? article.steps ?? [];
  const tags = Array.isArray(article.tags)
    ? article.tags
    : article.tags
    ? [article.tags]
    : article.category
    ? [article.category]
    : [];

  const relatedPlaybookTitle = article.playbookTitle ?? article.references?.[0] ?? "General Incident Response Playbook";

  return (
    <>
      <Box mb={2}>
        <Button
          variant="text"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/analyst/knowledge-base")}
          sx={{ color: "#9CA3AF", textTransform: "none", "&:hover": { color: "#FFFFFF" } }}
        >
          Back to Knowledge Base
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* LEFT */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ bgcolor: "#2D2D2D", p: 3, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 2 }}>
              {article.title}
            </Typography>

            <Stack direction="row" spacing={1} mb={4}>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} sx={{ color: "#fff", bgcolor: "#1565C0" }} />
              ))}
            </Stack>

            {/* Overview */}
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700, mb: 1 }}>
              Overview
            </Typography>
            <Typography sx={{ color: "#CFCFCF", mb: 4, lineHeight: 1.7 }}>
              {article.description ?? article.summary ?? "No description available."}
            </Typography>

            {/* Solution / Content */}
            {(article.solution || article.content) && (
              <>
                <Typography variant="h6" sx={{ color: "#fff", mb: 1, fontWeight: 700 }}>
                  Solution Details
                </Typography>
                <Typography sx={{ color: "#CFCFCF", mb: 4, lineHeight: 1.7 }}>
                  {article.solution ?? article.content}
                </Typography>
              </>
            )}

            {/* Response Steps */}
            {steps.length > 0 && (
              <>
                <Typography variant="h6" sx={{ color: "#fff", mb: 3, fontWeight: 700 }}>
                  Response Steps
                </Typography>

                {steps.map((step, index) => (
                  <Box key={index} sx={{ display: "flex", mb: 3 }}>
                    <Box sx={{
                      width: 32, height: 32, borderRadius: "50%", bgcolor: "#1565C0",
                      color: "#fff", display: "flex", justifyContent: "center",
                      alignItems: "center", mr: 2, fontWeight: 700, flexShrink: 0,
                    }}>
                      {index + 1}
                    </Box>
                    <Box>
                      <Typography sx={{ color: "#fff", fontWeight: 600 }}>
                        {typeof step === "string" ? step : step.title}
                      </Typography>
                      {typeof step !== "string" && step.desc && (
                        <Typography sx={{ color: "#9CA3AF", mt: 0.5 }}>{step.desc}</Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </>
            )}
          </Paper>
        </Grid>

        {/* RIGHT */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ bgcolor: "#2D2D2D", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 3 }}>
              Article Details
            </Typography>

            {[
              { label: "Author", value: article.createdBy ?? article.author ?? "System" },
              { label: "Category", value: article.category ?? "General" },
              { label: "Severity", value: article.severity ?? "—" },
              { label: "Status", value: article.status ?? "PUBLISHED" },
              { label: "Views", value: article.viewCount ?? 0 },
            ].map(({ label, value }) => (
              <Box key={label} mb={2}>
                <Typography sx={{ color: "#888", fontSize: 13 }}>{label}</Typography>
                <Typography sx={{ color: "#fff", fontWeight: 600 }}>{value}</Typography>
              </Box>
            ))}
          </Paper>

          <Paper sx={{ bgcolor: "#2D2D2D", p: 3, borderRadius: 2 }}>
            <Typography variant="h6" fontWeight={700} mb={3} sx={{ color: "#fff" }}>
              Related Playbook
            </Typography>

            <Box
              onClick={() => handlePlaybookClick(relatedPlaybookTitle)}
              sx={{
                display: "flex", alignItems: "center", mb: 4, cursor: "pointer", p: 1, borderRadius: 1,
                "&:hover": { bgcolor: "rgba(78, 161, 255, 0.1)" },
                transition: "background 0.2s",
              }}
            >
              <DescriptionIcon sx={{ color: "#4EA1FF", mr: 1 }} />
              <Typography sx={{ color: "#4EA1FF", fontWeight: 600, textDecoration: "underline", textDecorationColor: "rgba(78, 161, 255, 0.4)" }}>
                {relatedPlaybookTitle}
              </Typography>
            </Box>

            <Button fullWidth variant="contained"
              startIcon={<EditIcon />}
              onClick={() => navigate("/analyst/knowledge-base")}
              sx={{ bgcolor: "#424242", textTransform: "none", "&:hover": { bgcolor: "#555" } }}
            >
              Back to KB List
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Playbook Details Dialog */}
      <Dialog
        open={playbookDialog.open}
        onClose={closePlaybookDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1F1F1F",
            color: "#FFFFFF",
            backgroundImage: "none",
          }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            bgcolor: "#1F1F1F",
            borderBottom: "1px solid #333",
            px: 3, py: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
            {playbookDialog.playbook?.name ?? playbookDialog.playbook?.title ?? "Playbook Details"}
          </Typography>
          <IconButton onClick={closePlaybookDialog}>
            <CloseIcon sx={{ color: "#9CA3AF" }} />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ bgcolor: "#1F1F1F", px: 3, py: 2.5 }}>
          {playbookDialog.loading ? (
            <Box display="flex" justifyContent="center" py={3}>
              <CircularProgress size={28} />
            </Box>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {playbookDialog.playbook?.category && (
                <Box>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>CATEGORY</Typography>
                  <Chip
                    label={playbookDialog.playbook.category}
                    size="small"
                    sx={{ bgcolor: "#2563EB", color: "#FFF" }}
                  />
                </Box>
              )}

              {playbookDialog.playbook?.description && (
                <Box>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 0.5 }}>DESCRIPTION</Typography>
                  <Typography sx={{ color: "#D1D5DB", lineHeight: 1.6 }}>
                    {playbookDialog.playbook.description}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12, fontWeight: 700, mb: 1 }}>CONTAINMENT STEPS</Typography>
                {Array.isArray(playbookDialog.playbook?.steps) && playbookDialog.playbook.steps.length > 0 ? (
                  playbookDialog.playbook.steps.map((step, idx) => (
                    <Box key={idx} display="flex" gap={1.5} mb={1}>
                      <Typography sx={{ color: "#42A5F5", fontWeight: 700, minWidth: 20 }}>{idx + 1}.</Typography>
                      <Typography sx={{ color: "#FFFFFF", lineHeight: 1.5 }}>
                        {typeof step === "string" ? step : step.name ?? step.title ?? JSON.stringify(step)}
                      </Typography>
                    </Box>
                  ))
                ) : typeof playbookDialog.playbook?.steps === "string" && playbookDialog.playbook.steps.trim() ? (
                  playbookDialog.playbook.steps.split("\n").filter(Boolean).map((step, idx) => (
                    <Box key={idx} display="flex" gap={1.5} mb={1}>
                      <Typography sx={{ color: "#42A5F5", fontWeight: 700, minWidth: 20 }}>{idx + 1}.</Typography>
                      <Typography sx={{ color: "#FFFFFF", lineHeight: 1.5 }}>{step}</Typography>
                    </Box>
                  ))
                ) : (
                  <Typography sx={{ color: "#9CA3AF" }}>
                    {playbookDialog.playbook?.name ?? playbookDialog.playbook?.title
                      ? "No containment steps defined."
                      : "Playbook details not available."}
                  </Typography>
                )}
              </Box>

              {playbookDialog.playbook?.updatedAt && (
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>
                  Last updated: {new Date(playbookDialog.playbook.updatedAt).toLocaleDateString()}
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, bgcolor: "#1F1F1F", borderTop: "1px solid #333" }}>
          <Button
            variant="outlined"
            onClick={closePlaybookDialog}
            sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ArticleViewContent;