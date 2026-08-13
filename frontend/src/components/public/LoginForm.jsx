import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

function LoginForm() {

  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      bgcolor: "#1A1A1A",

      "& fieldset": {
        borderColor: "#CCCCCC",
      },

      "&:hover fieldset": {
        borderColor: "#1565C0",
      },

      "&.Mui-focused fieldset": {
        borderColor: "#1565C0",
        borderWidth: 2,
      },
    },

    "& .MuiInputBase-input": {
      color: "#ffffff",
    },

    "& input": {
      color: "#ffffff",
    },

    "& .MuiInputLabel-root": {
      color: "#ffffff",
    },

    "& .MuiInputLabel-root.Mui-focused": {
      color: "#ffffff",
    },
  };

  const handleSubmit = async (event) => {

    event.preventDefault();

    console.log("LOGIN BUTTON CLICKED");
    console.log("Email:", email);

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {

      setLoading(true);

      console.log("Calling backend...");

      const data = await login(email, password);

      console.log("LOGIN RESPONSE:", data);

      switch (data.role) {

        case "ADMIN":
          navigate("/admin/dashboard");
          break;

        case "MANAGER":
          navigate("/manager/dashboard");
          break;

        case "ANALYST":
          navigate("/analyst/dashboard");
          break;

        case "REPORTER":
          navigate("/reporter/dashboard");
          break;

        default:
          setError("Unknown user role: " + data.role);
      }

    } catch (err) {

      console.error("LOGIN ERROR:", err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please check your email and password.");
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
    >

      {/* EMAIL */}

     <TextField
  fullWidth
  label="Email"
  placeholder="name@company.com"
  margin="normal"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  autoComplete="email"
  sx={inputStyle}
/>

      {/* PASSWORD */}

      <TextField
  fullWidth
  label="Password"
  type={showPassword ? "text" : "password"}
  margin="normal"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  autoComplete="current-password"
  sx={inputStyle}
  slotProps={{
    input: {
      endAdornment: (
        <InputAdornment position="end">
          <IconButton
            onClick={() => setShowPassword(!showPassword)}
            edge="end"
            sx={{ color: "#ffffff" }}
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      ),
    },
  }}
/>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mt: 1,
          mb: 3,
        }}
      >

        <FormControlLabel
          control={
            <Checkbox
              defaultChecked
              sx={{
                color: "#ffffff",
                "&.Mui-checked": {
                  color: "#1565C0",
                },
              }}
            />
          }
          label="Remember me"
          sx={{
            "& .MuiFormControlLabel-label": {
              fontSize: "14px",
            },
          }}
        />

        <Link
          href="/forgot-password"
          underline="hover"
        >
          Forgot password?
        </Link>

      </Box>

      {/* ERROR */}

      {error && (
        <Typography
          sx={{
            color: "#ff5252",
            mb: 2,
            textAlign: "center",
          }}
        >
          {error}
        </Typography>
      )}

      {/* LOGIN */}

      <Button
  fullWidth
  type="submit"
  variant="contained"
  size="large"
  disabled={loading}
  onClick={() => console.log("BUTTON CLICKED")}
>
  {loading ? "Signing in..." : "Sign In"}
</Button>

      <Typography
        align="center"
        sx={{
          mt: 4,
          color: "#808080",
          fontSize: 14,
        }}
      >
        🔒 Protected by multi-factor authentication
      </Typography>

    </Box>
  );
}

export default LoginForm;