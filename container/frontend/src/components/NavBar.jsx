import { NavLink } from "react-router-dom";

export default function Navbar() {

    return (
        <nav style={{ background: '#ffffff', padding: '10px', minWidth: '100vw'}}>
        <NavLink
            to="/"
        >
            Home
        </NavLink>
        <NavLink
            to="/profile"
        >
            Profile
        </NavLink>
        </nav>
    );
}
