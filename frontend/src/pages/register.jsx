import { Mail, Lock, Eye, EyeOff, UserCircle } from "lucide-react"
import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import CardAlert from "../components/alert"

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("") 
    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prevData) => ({
        ...prevData,
        [name]: value,
        }))
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        try {
        const response = await fetch("http://localhost:4000/api/users", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
            setSuccessMessage("Registration Successful")
            setTimeout(() => navigate("/login"), 2000)
        } else {
            setErrorMessage(data.message || "Registration failed, the data entered is invalid")
        }
        } catch (err) {
        console.error("Error during registration:", err)
        setErrorMessage("An error occurred, please try again.")
        } finally {
        setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100 p-4">

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

        <div className="w-full max-w-md bg-white shadow-2xl rounded-xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white">Register</h2>
            <p className="text-white/80 mt-2">
                Welcome, please enter your details
            </p>
            </div>
            <form onSubmit={handleRegister} className="p-6 space-y-6">
            <div className="relative">
                <UserCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                type="text"
                placeholder="username"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
                />
            </div>

            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                type="email"
                placeholder="example@gmail.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
                />
            </div>

            <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                autoComplete="off"
                />

                <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-500"
                >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
                disabled={isLoading}
            >
                {isLoading ? "Loading..." : "Register"}
            </button>

            <div className="text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-blue-600 hover:underline">
                Login
                </Link>
            </div>
            </form>
        </div>
        </div>
    )
}

export default RegisterPage
