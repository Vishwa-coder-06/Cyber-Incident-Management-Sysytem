import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: colors.primary,
    },

    background: {
      default: colors.background,
      paper: colors.surface,
    },
  },
});

export default theme;