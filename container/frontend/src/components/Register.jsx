import { Button, Container, Typography, Box } from "@mui/material";
import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";

export default function Register({ createUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    /**
     * Send createUser functional call with username and password values to
     * create new user to the database.
     *
     * @param {Event} e event of changing value inside input field.
     */
    const handleRegister = (e) => {
        e.preventDefault();

        const newUser = {
            username: username,
            password: password,
        };

        createUser(newUser);
        navigate("/login");
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
        </Container>
    );
}
