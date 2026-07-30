import { Box, Typography, Button, Link, TextField  } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

function ForgotPasswordForm() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#0D5BD7",
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth:380,
          mx:2,
          bgcolor: "#2D2D2D",
          borderRadius: 4,
          p: 5,
          textAlign: "center",
          boxShadow: "0 25px 60px rgba(0,0,0,0.35)",
        }}
      >
        {/* Lock Icon */}
        <Box
          sx={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            bgcolor: "#1565C0",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            mx: "auto",
            mb: 4,
          }}
        >
          <LockOutlinedIcon sx={{ color: "#fff", fontSize: 32 }} />
        </Box>

        {/* Heading */}
        <Typography
          variant="h4"
          sx={{
            color: "#fff",
            fontWeight: 700,
            mb: 1,
          }}
        >
          Forgot your password?
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            color: "#A0A0A0",
            fontSize: 14,
            mb: 4,
          }}
        >
          Enter your email and we'll send a reset link.
        </Typography>

        <Typography
            sx={{
            textAlign: "left",
            color: "#FFFFFF",
            fontSize: 14,
            fontWeight: 600,
            mb: 1,
            }}
           >
            Email address
        </Typography>

        <TextField
  fullWidth
  placeholder="name@company.com"
  sx={{
    mb: 3,

    "& .MuiOutlinedInput-root": {
      bgcolor: "#3A3A3A",
      color: "#FFFFFF",
      borderRadius: 2,

      "& fieldset": {
        borderColor: "#555555",
      },

      "&:hover fieldset": {
        borderColor: "#FFFFFF",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1565C0",
        borderWidth: 2,
      },

      "& input": {
        color: "#FFFFFF",
      },
    },

    "& .MuiInputBase-input::placeholder": {
      color: "#BDBDBD",
      opacity: 1,
    },
  }}
/>

<Button
  fullWidth
  variant="outlined"
  sx={{
    height: 52,
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
    borderWidth: 2,
    borderRadius: 2,
    textTransform: "none",
    fontWeight: 600,
    transition:"0.3s",

    "&:hover": {
      bgcolor: "#FFFFFF",
      color: "#121212",
      borderColor: "#FFFFFF",
    },
  }}
>
  Send reset link
</Button>

<Link
  href="/login"
  underline="none"
  sx={{
    display: "block",
    mt: 3,
    color: "#1565C0",
    fontSize: 14,
    textAlign: "center",

    "&:hover": {
      textDecoration: "underline",
    },
  }}
>
  Back to login
</Link>
      </Box>
    </Box>
  );
}

export default ForgotPasswordForm;