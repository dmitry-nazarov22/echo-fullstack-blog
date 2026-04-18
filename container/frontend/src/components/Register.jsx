import { Button, Container, Typography, Box, Snackbar, Alert } from "@mui/material";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import api from "../api/axios"

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    /**
     * Send createUser functional call with username and password values to
     * create new user to the database.
     *
     * @param {Event} e event of changing value inside input field.
     */
    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post(`/users/register`, {
                username: username,
                password: password
            });

            setSuccessMsg("Registration successful!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setErrorMsg(err.response?.data || err.message);
        }
    }

    return (
        <Container>
            <Typography variant="h4">Register</Typography>
            <form onSubmit={handleRegister}>
            <Box sx={{ margin:"10px" }}>
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value)}
                    }
                    required
                />
                <Typography sx={{ fontSize:"x-small", color:"#9c9c9c" }}>Must be at least 4 characters</Typography>
            </Box>
            <Box>
                <label htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    required
                />
                <Typography sx={{ fontSize:"x-small", color:"#9c9c9c" }}>Must be at least 8 characters and contain at least one big letter, one small letter and number</Typography>
            </Box>
            <Button type="submit">Register</Button>
            </form>
            <NavLink to="/login">Already a user? Login</NavLink>
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
