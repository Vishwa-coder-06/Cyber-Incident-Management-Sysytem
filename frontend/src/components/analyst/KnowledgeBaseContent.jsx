import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Chip,
} from "@mui/material";

import BookmarkIcon from "@mui/icons-material/Bookmark";

function KnowledgeBaseContent() {

  const articles = [
    {
      title: "Responding to unauthorized login attempts",
      info: "Auth & access • Created Jun 28 • 142 views",
      tag: "Auth",
      color: "#1565C0",
    },
    {
      title: "Phishing triage checklist for L1 analysts",
      info: "Phishing • Created Jun 25 • 89 views",
      tag: "Phishing",
      color: "#EF6C00",
    },
    {
      title: "Ransomware containment and recovery steps",
      info: "Malware • Created Jun 20 • 210 views",
      tag: "Malware",
      color: "#E53935",
    },
    {
      title: "Data exfiltration via cloud storage — detection",
      info: "Data loss • Created Jun 14 • 67 views",
      tag: "Data",
      color: "#C7923E",
    },
    {
      title: "VPN anomaly investigation guide",
      info: "Network • Created Jun 10 • 54 views",
      tag: "Network",
      color: "#2E7D32",
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
          placeholder="Search knowledge base..."
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",
              color: "#FFFFFF",

              "& fieldset": {
                borderColor: "#444",
              },

              "&:hover fieldset": {
                borderColor: "#6750F5",
              },

              "&.Mui-focused fieldset": {
                borderColor: "#6750F5",
              },
            },

            "& input::placeholder": {
              color: "#9CA3AF",
              opacity: 1,
            },
          }}
        />

        <TextField
          select
          defaultValue="All categories"
          sx={{
            width: 170,

            "& .MuiOutlinedInput-root": {
              bgcolor: "#2B2B2B",
              color: "#FFFFFF",

              "& fieldset": {
                borderColor: "#444",
              },
            },

            "& .MuiSvgIcon-root": {
              color: "#FFFFFF",
            },
          }}
        >
          <MenuItem value="All categories">
            All categories
          </MenuItem>

          <MenuItem value="Auth">
            Auth
          </MenuItem>

          <MenuItem value="Phishing">
            Phishing
          </MenuItem>

          <MenuItem value="Malware">
            Malware
          </MenuItem>

          <MenuItem value="Network">
            Network
          </MenuItem>

        </TextField>

      </Box>

      {/* Articles */}

      {articles.map((article) => (

        <Paper
          key={article.title}
          elevation={0}
          sx={{
            bgcolor: "#2B2B2B",
            p: 3,
            borderRadius: 2,
            mb: 2,

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",

            cursor: "pointer",

            transition: "0.2s",

            "&:hover": {
              bgcolor: "#343434",
            },
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
          >

            <BookmarkIcon
              sx={{
                color: "#1565C0",
                mr: 2,
              }}
            />

            <Box>

              <Typography
                sx={{
                  color: "#FFFFFF",
                  fontWeight: 700,
                }}
              >
                {article.title}
              </Typography>

              <Typography
                sx={{
                  color: "#9CA3AF",
                  fontSize: 13,
                }}
              >
                {article.info}
              </Typography>

            </Box>

          </Box>

          <Chip
            label={article.tag}
            size="small"
            sx={{
              bgcolor: article.color,
              color: "#FFFFFF",
              fontWeight: 600,
            }}
          />

        </Paper>

      ))}

    </>
  );
}

export default KnowledgeBaseContent;