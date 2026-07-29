import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import { useNavigate } from "react-router-dom";
import {colors} from "../../theme/colors";
function PublicNavbar() {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: "#1565C0",
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Toolbar  sx={{
    minHeight: 64,
    height: 64,
  }}>

        {/* Logo */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap:1,
            cursor: "pointer",
          }}
          onClick={() => navigate("/")}
        >
          <SecurityIcon
            sx={{
              color: colors.textPrimary,
              fontSize:32,
            }}
          />

          <Typography
            variant="h5"
           sx={{
             fontWeight: 700,
             color: "#ffffff",
            }}
          >
            SecureOps
          </Typography>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Menu */}

        <Button
          sx={{ color: colors.textPrimary }}
          onClick={() => navigate("/")}
        >
          Home
        </Button>

        <Button
          sx={{ color: colors.textPrimary }}
          onClick={() => navigate("/about")}
        >
          About
        </Button>

        <Button
          sx={{ color: colors.textPrimary }}
          onClick={() => navigate("/contact")}
        >
          Contact
        </Button>

        <Button
          variant="contained"
          sx={{
            ml: 2,
            borderRadius: 3,
          }}
          onClick={() => navigate("/login")}
        >
          Login
        </Button>

      </Toolbar>
    </AppBar>
  );
}

export default PublicNavbar;