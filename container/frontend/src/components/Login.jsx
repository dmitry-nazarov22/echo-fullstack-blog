import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios"
import AuthContext from "../context/AuthContext"
import { Box, Container, Typography, Button } from "@mui/material";

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
        <Container>
            <Typography variant="h4">Login</Typography>
            <form onSubmit={handleLogin}>
            <Box sx={{ margin:"10px" }}>
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
            </Box>
            <Box>
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
            </Box>
            <Button type="submit">Login</Button>
            </form>

            <NavLink to="/register">Not a user yet? Register</NavLink>
        </Container>
    );
}