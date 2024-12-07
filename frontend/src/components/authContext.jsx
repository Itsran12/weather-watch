import React, { createContext, useContext, useState } from "react"

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"))
    const [userId, setUserId] = useState(localStorage.getItem("userId"))

    const login = (token, userId) => {
        localStorage.setItem("token", token)
        localStorage.setItem("userId", userId) 
        setIsLoggedIn(true)
        setUserId(userId) 
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("userId")
        setIsLoggedIn(false)
        setUserId(null) 
    }

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
