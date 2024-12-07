import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import CardAlert from "../components/alert"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("") 
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!email || !password) {
      setErrorMessage("Email and password must be filled.")
      return
    }

    setIsLoading(true)

    try {
      const response = await axios.post("http://localhost:4000/api/login", {
        email,
        password,
      })

      const data = response.data

      if (data.data && data.data.token && data.data.id) {
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("userId", data.data.id)
        setSuccessMessage("Login successful!")
        setTimeout(() => navigate("/"), 2000)
      } else {
        setErrorMessage(data.message || "Login failed, incorrect email or password.")
      }
    } catch (error) {
      console.error("Login failed, incorrect email or password.", error)
      setErrorMessage("Login failed, incorrect email or password.")
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
          <h2 className="text-3xl font-bold text-white">Login</h2>
          <p className="text-white/80 mt-2">
            Welcome, please enter your details
          </p>
        </div>
        <form onSubmit={handleLogin} className="p-6 space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="example@gmail.com"
              name="Email"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="off"
            />
          </div>
  
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              name="Password"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
  
          <div className="text-right">
            <a href="#" className="text-blue-600 hover:underline text-sm">
              Forgot Password?
            </a>
          </div>
  
          <button
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg hover:opacity-90 transition-all duration-300 shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
  
          <div className="text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-blue-600 hover:underline">
              Register
            </a>
          </div>
        </form>
      </div>
    </div>
  )
  
}

export default LoginPage
