import { createContext, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [userId, setUserId] = useState(null);

    const login = (id) => {
        setUserId(id);
    }

    const logout = async () => {
        const res = await api.delete('/users/logout');
        console.log(res);
        setUserId(null);
    }

    return (
        <AuthContext.Provider
        value={{ userId, setUserId, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;