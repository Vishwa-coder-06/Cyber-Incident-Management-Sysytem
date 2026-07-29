import { Box, Typography } from "@mui/material";
import LoginForm from "./LoginForm";

function LoginRightPanel() {
  return (
    <Box
      sx={{
        flex: 1,
        bgcolor: "#1A1A1A",
        color: "#FFFFFF",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 6,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 420,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
        >
          Welcome back
        </Typography>

        <Typography
          sx={{
            color: "#B0B0B0",
            mb: 5,
          }}
        >
          Sign in to your account
        </Typography>

        <LoginForm />
      </Box>
    </Box>
  );
}

export default LoginRightPanel;