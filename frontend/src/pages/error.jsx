import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

const ErrorPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 
        flex items-center justify-center px-4 py-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white shadow-2xl rounded-3xl p-10 
                max-w-2xl w-full text-center space-y-8"
            >
                <div className="relative">
                    
                    <motion.div 
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-9xl font-extrabold 
                        bg-clip-text text-transparent 
                        bg-gradient-to-r from-blue-500 to-purple-600"
                    >
                        404
                    </motion.div>

                    
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="absolute top-0 right-0 text-red-500"
                    >
                        <AlertTriangle size={64} strokeWidth={1.5} />
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">
                        Page Not Found
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Sorry, the page you are looking for may have been moved, 
                        deleted, or is temporarily unavailable.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex justify-center space-x-4"
                >
                    <Link 
                        to="/"
                        className="flex items-center space-x-2 
                        bg-blue-500 text-white px-6 py-3 
                        rounded-full hover:bg-blue-600 
                        transition duration-300 
                        shadow-md hover:shadow-lg"
                    >
                        <Home size={20} />
                        <span>Back to Home</span>
                    </Link>

                    <button 
                        onClick={() => window.location.reload()}
                        className="flex items-center space-x-2 
                        bg-purple-500 text-white px-6 py-3 
                        rounded-full hover:bg-purple-600 
                        transition duration-300 
                        shadow-md hover:shadow-lg"
                    >
                        <RefreshCw size={20} />
                        <span>Reload</span>
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-sm text-gray-500 pt-6 border-t"
                >
                    Please go back to the landing page
                </motion.div>
            </motion.div>

            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        scale: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                        duration: 5, 
                        repeat: Infinity, 
                        repeatType: "reverse" 
                    }}
                    className="absolute -top-20 -right-20 
                    w-96 h-96 bg-blue-300 rounded-full 
                    opacity-20 blur-3xl"
                />
                <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ 
                        opacity: [0.1, 0.2, 0.1],
                        scale: [0.5, 1, 0.5]
                    }}
                    transition={{ 
                        duration: 5, 
                        repeat: Infinity, 
                        repeatType: "reverse",
                        delay: 2
                    }}
                    className="absolute -bottom-20 -left-20 
                    w-96 h-96 bg-purple-300 rounded-full 
                    opacity-20 blur-3xl"
                />
            </div>
        </div>
    )
}

export default ErrorPage
