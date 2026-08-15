import { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Chip,
  Stack,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { getArticleById, getArticles, getPlaybooks } from "../../services/knowledgeService";

function ArticleViewContent() {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const articleId = params.articleId || location.state?.articleId;

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
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10} gap={2}>
        <CircularProgress size={32} sx={{ color: "#2563EB" }} />
        <Typography sx={{ color: "#9CA3AF" }}>Loading knowledge base article...</Typography>
      </Box>
    );
  }

  if (!article) {
    return (
      <Box py={6} textAlign="center" maxWidth={600} mx="auto">
        <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 4, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: "#FFFFFF", mb: 2 }}>
            Article Not Found
          </Typography>
          <Typography sx={{ color: "#9CA3AF", mb: 3 }}>
            The requested knowledge base article is not available.
          </Typography>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/analyst/knowledge-base")}
            sx={{ color: "#FFFFFF", borderColor: "#555", textTransform: "none" }}
          >
            Go to Knowledge Base
          </Button>
        </Paper>
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

  const specificPlaybook = article.playbookTitle || (Array.isArray(article.references) && article.references.length > 0 ? article.references[0] : null);

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
        {/* LEFT COLUMN: Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3.5, borderRadius: 2 }}>
            <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 2 }}>
              {article.title}
            </Typography>

            <Stack direction="row" spacing={1} mb={3} flexWrap="wrap" gap={1}>
              {tags.map((tag) => (
                <Chip key={tag} label={tag} sx={{ color: "#fff", bgcolor: "#1565C0", fontWeight: 600 }} />
              ))}
            </Stack>

            <Divider sx={{ borderColor: "#444", mb: 3 }} />

            {/* Overview / Description */}
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 700, mb: 1 }}>
              Incident Overview & Root Cause
            </Typography>
            <Typography sx={{ color: "#E5E7EB", mb: 3.5, lineHeight: 1.7, fontSize: 15, whiteSpace: "pre-wrap" }}>
              {article.description ?? article.summary ?? "No description available."}
            </Typography>

            {/* Solution Details / Ordered Steps */}
            {(article.solution || article.content) && (
              <>
                <Typography variant="h6" sx={{ color: "#fff", mb: 1.5, fontWeight: 700 }}>
                  Remediation & Solution Steps
                </Typography>
                <Paper elevation={0} sx={{ bgcolor: "#1E1E1E", p: 2.5, borderRadius: 2, mb: 3.5, border: "1px solid #333" }}>
                  <Typography sx={{ color: "#D1D5DB", lineHeight: 1.8, fontSize: 14, whiteSpace: "pre-wrap" }}>
                    {article.solution ?? article.content}
                  </Typography>
                </Paper>
              </>
            )}

            {/* Prevention & Lessons Learned */}
            {article.prevention && (
              <>
                <Typography variant="h6" sx={{ color: "#fff", mb: 1, fontWeight: 700 }}>
                  Prevention & Lessons Learned
                </Typography>
                <Typography sx={{ color: "#E5E7EB", mb: 3.5, lineHeight: 1.7, fontSize: 15, whiteSpace: "pre-wrap" }}>
                  {article.prevention}
                </Typography>
              </>
            )}

            {/* Legacy Structured Steps if present */}
            {steps.length > 0 && !article.solution && (
              <>
                <Typography variant="h6" sx={{ color: "#fff", mb: 2, fontWeight: 700 }}>
                  Response Steps
                </Typography>
                {steps.map((step, index) => (
                  <Box key={index} sx={{ display: "flex", mb: 2, alignItems: "flex-start", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        bgcolor: "#1565C0",
                        color: "#fff",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: 700,
                        fontSize: 13,
                        flexShrink: 0,
                      }}
                    >
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

        {/* RIGHT COLUMN: Metadata & Related Playbook */}
        <Grid size={{ xs: 12, md: 4 }}>
          {/* Article Details Card */}
          <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#fff", fontWeight: 700, mb: 2.5 }}>
              Article Information
            </Typography>

            {[
              { label: "Author / Analyst", value: article.createdBy ?? article.author ?? "Security Analyst" },
              { label: "Category", value: article.category ?? "General Security" },
              { label: "Severity", value: article.severity ?? "—" },
              { label: "Status", value: article.status ?? "PUBLISHED" },
              { label: "Views", value: article.viewCount ?? 0 },
              { label: "Published Date", value: article.createdAt ? new Date(article.createdAt).toLocaleDateString() : "Recent" },
            ].map(({ label, value }) => (
              <Box key={label} mb={1.8}>
                <Typography sx={{ color: "#9CA3AF", fontSize: 12 }}>{label}</Typography>
                <Typography sx={{ color: "#FFFFFF", fontWeight: 600, fontSize: 14, mt: 0.2 }}>{value}</Typography>
              </Box>
            ))}
          </Paper>

          {/* Related Playbook — Render only if known */}
          {specificPlaybook && (
            <Paper elevation={0} sx={{ bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 3, border: "1px solid #3B82F6" }}>
              <Typography variant="h6" fontWeight={700} mb={1.5} sx={{ color: "#fff" }}>
                Related Playbook
              </Typography>
              <Typography sx={{ color: "#9CA3AF", fontSize: 13, mb: 2 }}>
                Associated standard procedure recommended during incident response.
              </Typography>

              <Box
                onClick={() => handlePlaybookClick(specificPlaybook)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                  cursor: "pointer",
                  p: 1.5,
                  borderRadius: 1.5,
                  bgcolor: "#1E1E1E",
                  border: "1px solid #444",
                  "&:hover": { borderColor: "#60A5FA", bgcolor: "#252525" },
                  transition: "all 0.2s",
                }}
              >
                <DescriptionIcon sx={{ color: "#60A5FA", mr: 1.5 }} />
                <Typography sx={{ color: "#60A5FA", fontWeight: 600, fontSize: 14 }}>
                  {specificPlaybook}
                </Typography>
              </Box>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Playbook Details Modal */}
      <Dialog
        open={playbookDialog.open}
        onClose={closePlaybookDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#1F1F1F",
            color: "#FFFFFF",
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #333",
            px: 3,
            py: 2,
          }}
        >
          <Box display="flex" alignItems="center" gap={1.5}>
            <DescriptionIcon sx={{ color: "#60A5FA" }} />
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF" }}>
              {playbookDialog.playbook?.name ?? playbookDialog.playbook?.title ?? "Playbook Details"}
            </Typography>
          </Box>
          <IconButton onClick={closePlaybookDialog} sx={{ color: "#9CA3AF" }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {playbookDialog.loading ? (
            <Box display="flex" justifyContent="center" py={4}>
              <CircularProgress size={30} sx={{ color: "#60A5FA" }} />
            </Box>
          ) : (
            <Box>
              <Typography sx={{ color: "#9CA3AF", mb: 3, fontSize: 14 }}>
                {playbookDialog.playbook?.description ?? "Standard response playbook procedure."}
              </Typography>

              {Array.isArray(playbookDialog.playbook?.steps) && playbookDialog.playbook.steps.length > 0 ? (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: "#FFFFFF", fontWeight: 700, mb: 2 }}>
                    Playbook Execution Steps:
                  </Typography>
                  {playbookDialog.playbook.steps.map((step, idx) => (
                    <Box key={idx} sx={{ display: "flex", gap: 1.5, mb: 1.5, p: 1.5, bgcolor: "#2B2B2B", borderRadius: 1.5 }}>
                      <Chip label={idx + 1} size="small" sx={{ bgcolor: "#3B82F6", color: "#FFFFFF", fontWeight: 700, minWidth: 28 }} />
                      <Typography sx={{ color: "#E5E7EB", fontSize: 14, alignSelf: "center" }}>
                        {typeof step === "string" ? step : (step.name || step.description || step.title)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              ) : null}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ borderTop: "1px solid #333", px: 3, py: 2 }}>
          <Button onClick={closePlaybookDialog} sx={{ color: "#9CA3AF", textTransform: "none" }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ArticleViewContent;