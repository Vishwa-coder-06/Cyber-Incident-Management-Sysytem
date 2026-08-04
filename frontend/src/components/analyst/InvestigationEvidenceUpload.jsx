import {
  Button,
  Box,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";

function InvestigationEvidenceUpload() {

  const inputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFiles = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Box>

      <Button
        variant="outlined"
        startIcon={<UploadFileIcon />}
        onClick={() => inputRef.current.click()}
        sx={{
          color: "white",
          borderColor: "#555",
          textTransform: "none",
        }}
      >
        Upload evidence
      </Button>

      <input
        hidden
        multiple
        type="file"
        ref={inputRef}
        onChange={handleFiles}
      />

      {files.map((file, index) => (

        <Paper
          key={index}
          sx={{
            mt: 2,
            p: 2,
            bgcolor: "#1E1E1E",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >

          <Box>

            <Typography sx={{color:"#ffffff"}}>
              {file.name}
            </Typography>

            <Typography
              sx={{color:"#ffffff", 
                fontSize:13,
              }}
            >
              {(file.size / 1024).toFixed(1)} KB
            </Typography>

          </Box>

          <IconButton onClick={() => removeFile(index)}>
            <CloseIcon sx={{ color: "#EF5350" }} />
          </IconButton>

        </Paper>

      ))}

    </Box>
  );
}

export default InvestigationEvidenceUpload;