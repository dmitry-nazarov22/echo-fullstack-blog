import { useContext } from "react";
import { NavLink } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
    /** State for logged in user ID to use for posting */
    const { userId, logout } = useContext(AuthContext);

    const linkStyle = {
        color: '#000000',
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
            {userId === null ? (<>
                <NavLink
                    to="/login"
                    style={({ isActive }) => isActive ? { ...linkStyle, ...activeStyle } : linkStyle}
                >
                    Login
                </NavLink>
            </>) : (<>
                <button onClick={() => logout()}>Logout</button>
            </>)}
        </div>
        </nav>
    );
}
