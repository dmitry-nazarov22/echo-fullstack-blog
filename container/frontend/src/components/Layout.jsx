import { Box } from "@mui/material";
import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <Navbar />
            <Box>
                <Outlet />
            </Box>
        </>
    );
}
