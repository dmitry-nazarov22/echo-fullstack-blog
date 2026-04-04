import { createContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userId, setUserId] = useState(null);

    const login = (id) => {
        setUserId(id);
    }

    const logout = () => {
        setUserId(null);
    }

    return (
        <AuthContext.Provider
        value={{ userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;