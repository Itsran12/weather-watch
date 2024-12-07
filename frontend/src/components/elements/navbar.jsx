import { Link, useNavigate } from "react-router-dom"
import { CloudSun } from "lucide-react"
import React, { useState } from "react"
import { useAuth } from "../authContext"
import CardAlert from "../alert"

const Navbar = () => {
    const { isLoggedIn, userId, logout } = useAuth()
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("") 

    const handleLogout = async () => {
        const token = localStorage.getItem("token")

        if (!token) {
            alert("Token not found. Please log in again.")
            return
        }

        try {
            const response = await fetch(`http://localhost:4000/api/logout/${userId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.ok) {
                localStorage.removeItem("token")  
                localStorage.removeItem("userId") 
                logout()  
                setSuccessMessage("Logout successful")
                setTimeout(() => navigate("/login"), 2000)
            } else {
                setErrorMessage(data.message || "Logout failed. Please try again.")
            }
        } catch (error) {
            console.error("Error during logout:", error)
            setErrorMessage("An error occurred during logout. Please try again.")
        }
    }

    return (
        <nav className="container mx-auto px-4 py-6 flex justify-between items-center">

            {(errorMessage || successMessage) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                    <CardAlert
                    type={errorMessage ? "error" : "success"}
                    message={errorMessage || successMessage}
                    onClose={() => {
                        setErrorMessage("")
                        setSuccessMessage("")
                    }}
                    />
                </div>
                )}

            <div className="flex items-center space-x-2">
                <CloudSun size={40} className="text-blue-600" />
                <h1 className="text-2xl font-bold text-blue-800">WeatherWatch</h1>
            </div>
            <div className="space-x-4">
                <Link to="#" className="text-blue-700 hover:text-blue-900">Home</Link>
                <Link to="/history" className="text-blue-700 hover:text-blue-900">History</Link>
                {isLoggedIn ? (
                    <button
                        onClick={handleLogout}
                        className="text-blue-700 hover:text-blue-900"
                    >
                        Logout
                    </button>
                ) : (
                    <Link to="/login" className="text-blue-700 hover:text-blue-900">
                        Log in
                    </Link>
                )}
            </div>
        </nav>
    )
}

export default Navbar
