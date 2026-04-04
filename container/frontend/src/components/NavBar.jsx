import { NavLink } from "react-router-dom";

export default function Navbar() {
    const linkStyle = {
        color: '#000000',
        fontWeight: 'bold',
        margin: '10px',
        textDecoration: 'none',
        paddingBottom: '2px',
    };

    const activeStyle = {
        color: '#4d4d4d',
        borderBottom: '2px solid #4d4d4d',
    };

    return (
        <nav style={{ background: '#ffffff', padding: '10px', minWidth: '100vw'}}>
        <div className="main-links">
            <NavLink
                to="/"
                style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}
            >
                Home
            </NavLink>
            <NavLink
                to="/profile"
                style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}
            >
                Profile
            </NavLink>
        </div>
        <div className="login-links">
            <NavLink
                to="/login"
                style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}
            >
                Login
            </NavLink>
        </div>
        </nav>
    );
}
