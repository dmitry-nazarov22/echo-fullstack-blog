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
        <div className="container">
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
            <div>
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
                <p className="direction">Must be at least 4 characters</p>
            </div>
            <div>
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
                <p className="direction">Must be at least 8 characters and contain at least one big letter, one small letter and number</p>
            </div>
            <button type="submit">Register</button>
            </form>
            <NavLink to="/login">Already a user? Login</NavLink>
        </div>
    );
}
