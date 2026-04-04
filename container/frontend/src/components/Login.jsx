import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios"
import AuthContext from "../context/AuthContext"

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    /**
     * Send login request to either get 401 unsauthorized or user id and username.
     * Log that to authcontext
     *
     * @param {Event} e event of changing value inside input field.
     */
    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(
                `${import.meta.env.VITE_API_URL}/users/login`,
                { username, password }
            );

            login(res.data.user.id);
            navigate("/");
        } catch (err) {
            return { error: err };
        }
    }

    return (
        <div className="container">
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
            <div>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    required
                />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value)
                    }}
                    required />
            </div>
            <button type="submit">Login</button>
            </form>

            <NavLink to="/register">Not a user yet? Register</NavLink>
        </div>
    );
}