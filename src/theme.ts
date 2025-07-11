import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#31839d",
    },
    secondary: {
      main: "#ffd3c8",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: "#fff",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
  },
});
