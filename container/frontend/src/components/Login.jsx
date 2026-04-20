import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios"
import AuthContext from "../context/AuthContext"
import { Box, Container, Typography, Button, Snackbar, Alert } from "@mui/material";

export default function Login() {
    /** State for username in the login form. */
    const [username, setUsername] = useState("");
    /** State for password in the login form. */
    const [password, setPassword] = useState("");
    /** State for error message to display it in a snack bar. */
    const [errorMsg, setErrorMsg] = useState(null);
    /** State for success message to display it in a snack bar. */
    const [successMsg, setSuccessMsg] = useState(null);
    /** Login function from AuthContext. */
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
            setSuccessMsg(res.data.message);
            setTimeout(() => navigate("/"), 1000);
        } catch (err) {
            setErrorMsg(err.response?.data?.message) || err.message;
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
            {errorMsg && (
                <Snackbar
                    open={Boolean(errorMsg)}autoHideDuration={6000}
                    onClose={() => setErrorMsg(null)}
                >
                    <Alert
                        severity="error"
                        variant="filled"
                    >
                        {errorMsg}
                    </Alert>
                </Snackbar>
            )}
            {successMsg && (
                <Snackbar
                    open={Boolean(successMsg)}autoHideDuration={6000}
                    onClose={() => setSuccessMsg(null)}
                >
                    <Alert
                        severity="success"
                        variant="filled"
                    >
                        {successMsg}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
}