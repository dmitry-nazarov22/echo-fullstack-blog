import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#293325"
        },
        secondary: {
            main: "#48872B"
        }
    },

    typography: {
        h4: {
            fontSize: "2rem",
            fontWeight: "bold"
        },
        h5: {
            fontSize: "1.5rem",
        },
        h6: {
            fontSize: "1rem",
            fontWeight: "bold"
        }
    }
})

export default theme;