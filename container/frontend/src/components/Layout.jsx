import Navbar from "./NavBar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <Navbar />
            <div>
                <Outlet />
            </div>
        </>
    );
}
