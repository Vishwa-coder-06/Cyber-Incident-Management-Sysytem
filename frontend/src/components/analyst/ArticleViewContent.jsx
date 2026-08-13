import { useState, useEffect } from "react";
import {
  Box, Grid, Paper, Typography, Chip, Button, CircularProgress,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";
import { getArticleById, getArticles } from "../../services/knowledgeService";

function ArticleViewContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const articleId = location.state?.articleId;

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

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

            <Box display="flex" alignItems="center" mb={4}>
              <DescriptionIcon sx={{ color: "#4EA1FF", mr: 1 }} />
              <Typography sx={{ color: "#4EA1FF", fontWeight: 600 }}>
                {article.playbookTitle ?? article.references?.[0] ?? "General Incident Response Playbook"}
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
    </>
  );
}

export default ArticleViewContent;