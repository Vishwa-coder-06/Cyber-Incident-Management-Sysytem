import {
  Paper,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useRef, useState } from "react";

function EvidenceUpload() {
  const fileInputRef = useRef(null);
  const [files, setFiles] = useState([]);

  const handleFiles = (e) => {
    setFiles((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <Box>
      <Typography
        sx={{
          color: "#FFFFFF",
          fontSize: 15,
          fontWeight: 600,
          mb: 1,
        }}
      >
        Evidence (screenshots, logs)
      </Typography>

      {/* Upload Area */}

      <Paper
        onClick={() => fileInputRef.current.click()}
        variant="outlined"
        sx={{
          height: 180,
          bgcolor: "#1E1E1E",
          border: "2px dashed #555555",
          borderRadius: 2,

          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",

          cursor: "pointer",

          transition: "0.3s",

          "&:hover": {
            borderColor: "#1565C0",
            bgcolor: "#242424",
          },
        }}
      >
        <CloudUploadOutlinedIcon
          sx={{
            color: "#808080",
            fontSize: 42,
            mb: 1,
          }}
        />

        <Typography color="#808080">
          Drag files here or click to browse
        </Typography>
      </Paper>

      <input
        type="file"
        hidden
        multiple
        ref={fileInputRef}
        onChange={handleFiles}
      />

      {/* Uploaded Files */}

      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>

          {files.map((file, index) => (

            <Paper
              key={index}
              sx={{
                bgcolor: "#2D2D2D",
                p: 2,
                mb: 1,

                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",

                borderRadius: 2,
              }}
            >

              <Box>
                <Typography sx={{ color: '#ffffff' }}>
                  📄 {file.name}
                </Typography>

                <Typography
                  sx={{
                    color: "#9CA3AF",
                    fontSize: 13,
                  }}
                >
                  {(file.size / 1024).toFixed(1)} KB
                </Typography>
              </Box>

              <IconButton
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <CloseIcon sx={{ color: "#EF5350" }} />
              </IconButton>

            </Paper>

          ))}

        </Box>
      )}

    </Box>
  );
}

export default EvidenceUpload;