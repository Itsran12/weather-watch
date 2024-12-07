import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { MapPin, Trash2, Eye, Search } from "lucide-react"
import { motion, AnimatePresence } from 'framer-motion' 
import CardAlert from "../components/alert"
import axios from "axios"



const formatLocationName = (fullName) => {
    const parts = fullName.split(',')
    if (parts.length > 1) {
        const city = parts[0].trim()
        const province = parts[1].trim()
        return `${city}, ${province}`
    }
    return fullName
}


const LocationCard = ({ id, name, latitude, longitude, onDelete, onView }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = () => {
        onDelete(id)
    }

    return (
        <AnimatePresence>
            <motion.div 
                key={id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ 
                    opacity: isDeleting ? 0 : 1, 
                    scale: isDeleting ? 0.7 : 1 
                }}
                transition={{ duration: 0.3 }}
                className={`relative overflow-hidden rounded-3xl shadow-2xl bg-white border-2 border-indigo-100 
                    transform transition-all duration-300 ease-in-out 
                    ${isHovered ? 'scale-105 shadow-xl' : 'scale-100'}
                    ${isDeleting ? 'opacity-0 scale-75' : ''}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 to-white opacity-50 pointer-events-none"></div>
                <div className="relative z-10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <motion.div 
                            whileHover={{ rotate: 15 }}
                            className="text-indigo-600"
                        >
                            <MapPin size={48} strokeWidth={1.5} />
                        </motion.div>

                        <div className="flex space-x-3">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => onView(id)}
                                className="p-2.5 bg-blue-500 text-white rounded-xl 
                                    shadow-md hover:bg-blue-600 transition-colors 
                                    focus:outline-none focus:ring-2 focus:ring-blue-400"
                                aria-label="Lihat Detail Lokasi"
                            >
                                <Eye size={20} />
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleDelete}
                                className="p-2.5 bg-red-500 text-white rounded-xl 
                                    shadow-md hover:bg-red-600 transition-colors
                                    focus:outline-none focus:ring-2 focus:ring-red-400"
                                aria-label="Hapus Lokasi"
                            >
                                <Trash2 size={20} />
                            </motion.button>
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-indigo-900 mb-3 truncate">
                        {formatLocationName(name)}
                    </h2>

                    <div className="grid grid-cols-2 gap-2 bg-indigo-50 rounded-xl p-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Latitude</span>
                            <p className="text-lg font-medium text-indigo-800">{latitude.toFixed(4)}</p>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase tracking-wider">Longitude</span>
                            <p className="text-lg font-medium text-indigo-800">{longitude.toFixed(4)}</p>
                        </div>
                    </div>

                    {isHovered && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-indigo-600/5 
                                pointer-events-none"
                        />
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

const History = () => {
    const [locations, setLocations] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const [searchTerm, setSearchTerm] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("") 
    const itemsPerPage = 6
    const navigate = useNavigate()

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    setErrorMessage("You must be logged in!")
                    return
                }

                const response = await axios.get("http://localhost:4000/api/locations", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })

                if (response.status === 200) {
                    setLocations(response.data.data)
                } else {
                    setErrorMessage("Failed to fetch locations!")
                }
            } catch (error) {
                if (error.response && error.response.status === 404) {
                    console.warn("No locations found. Setting locations to an empty array.")
                    setLocations([])
                } else {
                    console.error("Error fetching locations:", error)
                    setErrorMessage("There was an error fetching locations.")
                }
            }
        }

        fetchLocations()
    }, [])

    // Filter locations based on the search term
    const filteredLocations = locations.filter((location) =>
        location.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Paginate the filtered locations
    const startIndex = (currentPage - 1) * itemsPerPage
    const currentData = filteredLocations.slice(startIndex, startIndex + itemsPerPage)

    const totalPages = Math.ceil(filteredLocations.length / itemsPerPage)

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value)
        setCurrentPage(1) // Reset to first page when searching
    }

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1)
        }
    }

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1)
        }
    }

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                setErrorMessage("You must be logged in!")
                return
            }

            const response = await axios.delete(`http://localhost:4000/api/locations/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })

            if (response.status === 200) {
                await new Promise(resolve => setTimeout(resolve, 300))
                setSuccessMessage("Location successfully deleted!")
                setLocations((prevLocations) =>
                    prevLocations.filter(location => location.id !== id)
                )
            } else {
                setErrorMessage(`Failed to delete location. Status: ${response.status}`)
            }
        } catch (error) {
            console.error("Delete error details:", error)

            if (error.response) {
                setErrorMessage(`Error deleting location: ${error.response.data?.message || 'Unknown error'}`)
            } else {
                setErrorMessage(`Error: ${error.message}`)
            }
        }
    }

    const handleView = async (id) => {
        try {
            const token = localStorage.getItem("token")
            if (!token) {
                setErrorMessage("You must be logged in!")
                return
            }

            const response = await axios.get(`http://localhost:4000/api/weather/${id}/current`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.status === 200) {
                navigate(`/weather/${id}`, { state: { weatherData: response.data } })
            } else {
                setErrorMessage(`Failed to fetch weather data. Status: ${response.status}`)
            }
        } catch (error) {
            console.error("Error fetching weather data:", error)

            if (error.response) {
                setErrorMessage(`Error fetching weather data: ${error.response.data?.message || 'Unknown error'}`)
            } else {
                setErrorMessage(`Error: ${error.message}`)
            }
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-indigo-100 via-white to-indigo-100 py-6">
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

            <header className="w-full max-w-4xl flex flex-col items-center mb-8 px-4 sm:px-6">
                <h1 className="text-4xl sm:text-5xl font-bold text-indigo-800 mb-6 text-center transition-transform transform hover:scale-105">
                    Location Data
                </h1>
                <div className="w-full flex items-center bg-white rounded-full shadow-lg px-4 py-2 transition-shadow hover:shadow-xl">
                    <Search className="text-gray-500 mr-2 transition-transform transform hover:scale-125" />
                    <input
                        type="text"
                        placeholder="Search locations..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="w-full outline-none p-1 text-lg text-gray-700 placeholder-gray-400 transition-all duration-300 rounded-full"
                    />
                </div>
                <p className="mt-4 text-gray-600 text-center">
                    Find your favorite locations quickly and easily!
                </p>
            </header>

            {filteredLocations.length === 0 ? (
                <p className="text-2xl text-gray-600">No data available</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 px-6">
                        {currentData.map((location) => (
                            <LocationCard
                                key={location.id}
                                id={location.id}
                                name={location.name}
                                latitude={location.latitude}
                                longitude={location.longitude}
                                onDelete={handleDelete}
                                onView={handleView}
                            />
                        ))}
                    </div>
                    <div className="flex mt-8 space-x-6">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className={`px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-300 ${
                                currentPage === 1 ? 'cursor-not-allowed' : ''
                            }`}
                        >
                            Previous
                        </button>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className={`px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:opacity-50 transition-colors duration-300 ${
                                currentPage === totalPages ? 'cursor-not-allowed' : ''
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    )
}


export default History
