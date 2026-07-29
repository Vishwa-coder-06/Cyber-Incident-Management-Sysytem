import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  TextField,
  Typography,
} from "@mui/material";

function LoginForm() {
    const inputStyle={
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
  return (
    <Box>

      <TextField
        fullWidth
        label="Email"
        placeholder="name@company.com"
        margin="normal"
     
        sx={inputStyle}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        sx={inputStyle}
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
          control={<Checkbox defaultChecked 
          sx={{ color: '#ffffff', '&.Mui-checked': { color: '#1565C0' } }}/>}
          label="Remember me"
          sx={{ '& .MuiFormControlLabel-label': { fontSize: '14px' } }}
        />

        <Link
          href="/forgot-password"
          underline="hover"
        >
          Forgot password?
        </Link>
      </Box>

      <Button
        fullWidth
        variant="contained"
        size="large"
      >
        Sign In
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