import { useState, useEffect } from "react";
import {
  Box, Paper, Typography, TextField, MenuItem,
  Chip, CircularProgress,
} from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { filterArticles, getArticles } from "../../services/knowledgeService";
import { useNavigate } from "react-router-dom";

const TAG_COLORS = {
  AUTH: "#1565C0",
  PHISHING: "#EF6C00",
  MALWARE: "#E53935",
  DATA: "#C7923E",
  NETWORK: "#2E7D32",
};

function KnowledgeBaseContent() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All categories");

  useEffect(() => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (category !== "All categories") params.category = category;

    filterArticles(params)
      .then((data) => {
        let list = Array.isArray(data) ? data : [];
        // Apply client-side filter fallback to guarantee exact matching
        if (search) {
          const s = search.toLowerCase();
          list = list.filter(
            (a) =>
              a.title?.toLowerCase().includes(s) ||
              a.description?.toLowerCase().includes(s) ||
              a.content?.toLowerCase().includes(s) ||
              a.category?.toLowerCase().includes(s)
          );
        }
        if (category !== "All categories") {
          const cat = category.toLowerCase();
          list = list.filter((a) => a.category?.toLowerCase() === cat);
        }
        setArticles(list);
      })
      .catch(() => {
        // Fallback to getArticles if filter fails
        getArticles()
          .then((data) => {
            let list = Array.isArray(data) ? data : [];
            if (search) {
              const s = search.toLowerCase();
              list = list.filter(
                (a) =>
                  a.title?.toLowerCase().includes(s) ||
                  a.description?.toLowerCase().includes(s) ||
                  a.content?.toLowerCase().includes(s) ||
                  a.category?.toLowerCase().includes(s)
              );
            }
            if (category !== "All categories") {
              const cat = category.toLowerCase();
              list = list.filter((a) => a.category?.toLowerCase() === cat);
            }
            setArticles(list);
          })
          .catch(() => setArticles([]));
      })
      .finally(() => setLoading(false));
  }, [search, category]);

  const fieldStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#2B2B2B", color: "#FFFFFF",
      "& fieldset": { borderColor: "#444" },
      "&:hover fieldset": { borderColor: "#6750F5" },
      "&.Mui-focused fieldset": { borderColor: "#6750F5" },
    },
    "& input::placeholder": { color: "#9CA3AF", opacity: 1 },
    "& .MuiSvgIcon-root": { color: "#FFFFFF" },
  };

  return (
    <>
      {/* Search & Filter */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search knowledge base..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={fieldStyle}
        />

        <TextField
          select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ width: 170, ...fieldStyle }}
        >
          {["All categories", "Auth", "Phishing", "Malware", "Network", "Data"].map((c) => (
            <MenuItem key={c} value={c}>{c}</MenuItem>
          ))}
        </TextField>
      </Box>

      {/* Articles */}
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}><CircularProgress size={28} /></Box>
      ) : articles.length === 0 ? (
        <Typography sx={{ color: "#9CA3AF", textAlign: "center", py: 4 }}>
          No articles found.
        </Typography>
      ) : (
        articles.map((article) => {
          const id = article.id ?? article.articleId;
          const tag = (article.category ?? article.tag ?? "").toUpperCase();
          const tagColor = TAG_COLORS[tag] ?? "#555";
          return (
            <Paper
              key={id}
              elevation={0}
              onClick={() => navigate("/analyst/article-view", { state: { articleId: id } })}
              sx={{
                bgcolor: "#2B2B2B", p: 3, borderRadius: 2, mb: 2,
                display: "flex", justifyContent: "space-between", alignItems: "center",
                cursor: "pointer", transition: "0.2s",
                "&:hover": { bgcolor: "#343434" },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <BookmarkIcon sx={{ color: "#1565C0", mr: 2 }} />
                <Box>
                  <Typography sx={{ color: "#FFFFFF", fontWeight: 700 }}>
                    {article.title}
                  </Typography>
                  <Typography sx={{ color: "#9CA3AF", fontSize: 13 }}>
                    {article.category ?? ""}
                    {article.viewCount != null ? ` · ${article.viewCount} views` : ""}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={article.category ?? tag}
                size="small"
                sx={{ bgcolor: tagColor, color: "#FFFFFF", fontWeight: 600 }}
              />
            </Paper>
          );
        })
      )}
    </>
  );
}

export default KnowledgeBaseContent;