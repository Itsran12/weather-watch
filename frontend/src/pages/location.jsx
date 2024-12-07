import React, { useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'
import CardAlert from '../components/alert'

const MapFlyTo = ({ lat, lon }) => {
    const map = useMap()
    map.flyTo([lat, lon], 10, { animate: true })
    return null
}

const LeafletMap = ({ position, locationInfo, handleSearch }) => {
    const mapRef = useRef(null)

    const indonesiaBounds = [
        [-11.0, 95.0], 
        [6.0, 141.0]
    ]

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 p-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold text-blue-800 mb-6">
                🌏 Map - <span className="text-blue-600">Indonesia</span>
            </h1>
            <div className="w-full max-w-2xl mb-6">
                <input
                    type="text"
                    placeholder="Search location (e.g., Jakarta)"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch(e.target.value)
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="w-full max-w-7xl relative">
                <MapContainer
                    center={position}
                    zoom={5}
                    style={{ height: '700px', width: '100%' }} 
                    maxBounds={indonesiaBounds}
                    maxBoundsViscosity={1.0}
                    className="rounded-lg shadow-2xl"
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position}>
                        <Popup>
                            <div className="text-sm">
                                <strong>Location:</strong> {locationInfo.city || 'Indonesia'} <br />
                                <strong>Latitude:</strong> {locationInfo.lat || '-2.5489'} <br />
                                <strong>Longitude:</strong> {locationInfo.lon || '118.0149'}
                            </div>
                        </Popup>
                    </Marker>

                    {locationInfo.lat && locationInfo.lon && (
                        <MapFlyTo lat={parseFloat(locationInfo.lat)} lon={parseFloat(locationInfo.lon)} />
                    )}
                </MapContainer>

                <div
                    className="absolute bottom-4 left-4 bg-blue-800 text-white p-4 rounded-lg shadow-md text-sm z-[500]"
                    style={{ pointerEvents: 'none' }}
                >
                    <h3 className="font-semibold">📍 Location Information:</h3>
                    {locationInfo.city ? (
                        <p className="mt-1">
                            <strong>City:</strong> {locationInfo.city} <br />
                            <strong>Latitude:</strong> {locationInfo.lat} <br />
                            <strong>Longitude:</strong> {locationInfo.lon}
                        </p>
                    ) : (
                        <p className="mt-1">No location selected yet.</p>
                    )}
                </div>
            </div>
        </div>
    )
}

const AddCityForm = ({ newCity, handleFormChange, handleAddCity }) => {
    return (
        <div 
            className="w-full bg-white p-6 rounded-lg shadow-xl mx-auto" 
            style={{ maxWidth: '750px', marginTop: '20px' }}
        >
            <h2 className="text-2xl font-semibold text-blue-800 mb-4 text-center">
                Add New City
            </h2>
            <form onSubmit={handleAddCity} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-lg text-blue-700 font-semibold">
                        City Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={newCity.name}
                        onChange={handleFormChange}
                        className="w-full p-3 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Jakarta"
                    />
                </div>
                <div>
                    <label htmlFor="latitude" className="block text-lg text-blue-700 font-semibold">
                        Latitude
                    </label>
                    <input
                        type="number"
                        name="latitude"
                        value={newCity.latitude}
                        onChange={handleFormChange}
                        className="w-full p-3 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., -6.2088"
                    />
                </div>
                <div>
                    <label htmlFor="longitude" className="block text-lg text-blue-700 font-semibold">
                        Longitude
                    </label>
                    <input
                        type="number"
                        name="longitude"
                        value={newCity.longitude}
                        onChange={handleFormChange}
                        className="w-full p-3 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., 106.8456"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
                >
                    Add City
                </button>
            </form>
        </div>
    )
}

const Location = () => {
    const [position, setPosition] = useState([-2.5489, 118.0149])
    const [locationInfo, setLocationInfo] = useState({ city: '', lat: '', lon: '' })
    const [newCity, setNewCity] = useState({
        name: '',
        latitude: '',
        longitude: ''
    })
    const [errorMessage, setErrorMessage] = useState("")
    const [successMessage, setSuccessMessage] = useState("") 

    const handleAddCity = async (e) => {
        e.preventDefault()

        if (newCity.name && newCity.latitude && newCity.longitude) {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    setErrorMessage('You must log in first!')
                    return
                }

                const response = await axios.post(
                    'http://localhost:4000/api/locations',
                    {
                        name: newCity.name,
                        latitude: parseFloat(newCity.latitude),
                        longitude: parseFloat(newCity.longitude),
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                    }
                )

                if (response.status === 201) { 
                    setPosition([parseFloat(newCity.latitude), parseFloat(newCity.longitude)])
                    setLocationInfo({
                        city: newCity.name,
                        lat: newCity.latitude,
                        lon: newCity.longitude,
                    })
                    setNewCity({ name: '', latitude: '', longitude: '' })
                    setSuccessMessage('Location successfully added!')
                } else {
                    setErrorMessage('An error occurred while adding the location!')
                }
            } catch (error) {
                console.error('Error:', error)
                setErrorMessage('An error occurred while adding the location.')
            }
        } else {
            setErrorMessage('Please fill out all fields!')
        }
    }

    const handleSearch = async (city) => {
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}`)
            const data = await response.json()

            if (data.length > 0) {
                const { lat, lon, display_name } = data[0]
                setPosition([parseFloat(lat), parseFloat(lon)])
                setLocationInfo({ city: display_name, lat, lon })
                setNewCity({ name: display_name, latitude: lat, longitude: lon })
            } else {
                setErrorMessage('Location not found!')
            }
        } catch (error) {
            console.error('Error:', error)
        }
    }

    const handleFormChange = (e) => {
        const { name, value } = e.target
        setNewCity((prev) => ({ ...prev, [name]: value }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-blue-100 via-white to-blue-100 p-6">
            
            {(errorMessage || successMessage) && (
            <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
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

            <LeafletMap
                position={position}
                locationInfo={locationInfo}
                handleSearch={handleSearch}
            />
            <AddCityForm
                newCity={newCity}
                handleFormChange={handleFormChange}
                handleAddCity={handleAddCity}
            />
        </div>
    )
}

export default Location
