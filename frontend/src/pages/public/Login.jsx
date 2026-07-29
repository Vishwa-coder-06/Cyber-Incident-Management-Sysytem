import { Box } from "@mui/material";
import LoginLeftPanel from "../../components/public/LoginLeftPanel";
import LoginRightPanel from "../../components/public/LoginRightPanel";

function Login() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
      }}
    >
      <LoginLeftPanel />
      <LoginRightPanel />
    </Box>
  );
}

export default Login;