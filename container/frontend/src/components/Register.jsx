import { useState } from "react";

export default function Register({ createUser }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

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
            </div>
            <button type="submit">Register</button>
            </form>
            <a href="/login">Already a user? Login</a>
        </div>
    );
}
