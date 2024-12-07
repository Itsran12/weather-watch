import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "./authContext"

const PrivateRoute = ({ children }) => {
    const { isLoggedIn } = useAuth() 

    return isLoggedIn ? children : <Navigate to="/login" replace />
}

export default PrivateRoute
