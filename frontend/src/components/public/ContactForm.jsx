import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

function ContactForm() {
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
    <Box
      sx={{
        bgcolor: "#2F2F2F",
        minHeight: "100vh",
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Typography
          variant="h3"
          align="center"
          fontWeight="bold"
          sx={{
            color: "#f8fbff",
            
          }}
        >
          Get in touch
        </Typography>

        <Typography
          align="center"
          sx={{
            color: "#f8fbff",
            mt: 2,
            mb: 5,
          }}
        >
          Questions or support? We're here to help.
        </Typography>

        <Paper
          elevation={0}
          sx={{
            bgcolor: "#2A2A2A",
            p: 4,
            borderRadius: 2,
          }}
        >
          <TextField
            fullWidth
            label="Your name"
            margin="normal"
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Email address"
            margin="normal"
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Subject"
            margin="normal"
            sx={inputStyle}
          />

          <TextField
            fullWidth
            label="Message"
            multiline
            rows={6}
            margin="normal"
            sx={inputStyle}
          />

          <Button
            fullWidth
            variant="outlined"
            sx={{
              mt: 3,
              height: 50,
              color: "#FFFFFF",
              borderColor: "#555555",
              textTransform: "none",

              "&:hover": {
                bgcolor: "#1565C0",
                borderColor: "#1565C0",
              },
            }}
          >
            Send message
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}

export default ContactForm;