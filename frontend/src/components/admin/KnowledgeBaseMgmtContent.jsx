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
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

function KnowledgeBaseMgmtContent() {

  const articles = [
    {
      title: "Responding to unauthorized login attempts",
      status: "Published",
      statusColor: "#16A34A",
      views: 142,
      author: "Priya S.",
    },
    {
      title: "Phishing triage checklist for L1 analysts",
      status: "Published",
      statusColor: "#16A34A",
      views: 89,
      author: "Arun K.",
    },
    {
      title: "SQL injection detection and mitigation",
      status: "Draft",
      statusColor: "#D97706",
      views: "--",
      author: "Kiran T.",
    },
  ];

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#2B2B2B",
      borderRadius: 2,

      "& fieldset": {
        borderColor: "#444",
      },

      "&:hover fieldset": {
        borderColor: "#C62828",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#C62828",
      },
    },

    "& input": {
      color: "#FFFFFF",
    },
  };

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
          placeholder="Search articles..."
          sx={inputStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9CA3AF" }} />
              </InputAdornment>
            ),
          }}
        />

        <TextField
          placeholder="Filter"
          sx={{
            width: 120,
            ...inputStyle,
          }}
        />

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{
            width: 150,
            color: "#FFFFFF",
            borderColor: "#555",
            textTransform: "none",

            "&:hover": {
              borderColor: "#C62828",
            },
          }}
        >
          New Article
        </Button>

      </Box>

      {/* Summary Cards */}

      <Grid container spacing={3} sx={{ mb: 3 }}>

        <Grid size={{ xs: 12, md: 4 }}>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography color="#9CA3AF">
              Total articles
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#3B82F6",
                fontWeight: 700,
                mt: 1,
              }}
            >
              91
            </Typography>

          </Paper>

        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography color="#9CA3AF">
              Published
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#22C55E",
                fontWeight: 700,
                mt: 1,
              }}
            >
              84
            </Typography>

          </Paper>

        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>

          <Paper
            elevation={0}
            sx={{
              bgcolor: "#2B2B2B",
              borderRadius: 2,
              p: 3,
            }}
          >
            <Typography color="#9CA3AF">
              Drafts
            </Typography>

            <Typography
              variant="h3"
              sx={{
                color: "#F59E0B",
                fontWeight: 700,
                mt: 1,
              }}
            >
              7
            </Typography>

          </Paper>

        </Grid>

      </Grid>

      {/* Table */}

      <Paper
        elevation={0}
        sx={{
          bgcolor: "#2B2B2B",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >

        <Table>

          <TableHead>

            <TableRow>

              <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>
                Article Title
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>
                Status
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>
                Views
              </TableCell>

              <TableCell sx={{ color: "#9CA3AF", fontWeight: 600 }}>
                Author
              </TableCell>

            </TableRow>

          </TableHead>

          <TableBody>

            {articles.map((article) => (

              <TableRow
                key={article.title}
                hover
                sx={{
                  "&:hover": {
                    bgcolor: "#353535",
                  },
                }}
              >

                <TableCell
                  sx={{
                    color: "#FFFFFF",
                    fontWeight: 600,
                  }}
                >
                  {article.title}
                </TableCell>

                <TableCell>

                  <Chip
                    label={article.status}
                    size="small"
                    sx={{
                      bgcolor: article.statusColor,
                      color: "#FFFFFF",
                      fontWeight: 600,
                    }}
                  />

                </TableCell>

                <TableCell sx={{ color: "#9CA3AF" }}>
                  {article.views}
                </TableCell>

                <TableCell sx={{ color: "#9CA3AF" }}>
                  {article.author}
                </TableCell>

              </TableRow>

            ))}

          </TableBody>

        </Table>

      </Paper>

    </>
  );
}

export default KnowledgeBaseMgmtContent;