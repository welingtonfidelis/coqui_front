import { createContext } from "react";

type AuthContextType = {}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }) {
    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}