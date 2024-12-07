import React, { useState, useEffect } from "react"
import { ThermometerSnowflake, Wind, CloudHail, Cloudy, Droplets } from "lucide-react"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
} from "chart.js"
import axios from "axios"
import { useParams } from "react-router-dom"

ChartJS.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement, Filler)

const TemperatureCard = ({ temperature, feelsLike }) => {
  return (
    <div className="p-8 bg-blue-200 rounded-xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
      <div className="text-6xl text-blue-700">
        <ThermometerSnowflake size={40} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-blue-700">Temperature Information</h2>
      <p className="text-gray-800 text-sm mt-2">{temperature}°C (Feels Like: {feelsLike}°C)</p>
    </div>
  )
}

const WindSpeedCard = ({ windSpeed }) => {
  return (
    <div className="p-8 bg-green-200 rounded-xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
      <div className="text-6xl text-green-700">
        <Wind size={40} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-green-700">Wind Speed</h2>
      <p className="text-gray-800 text-sm mt-2">{windSpeed} km/h</p>
    </div>
  )
}

const HumidityCard = ({ humidity }) => {
  return (
    <div className="p-8 bg-purple-200 rounded-xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
      <div className="text-6xl text-purple-700">
        <Droplets size={40} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-purple-700">Humidity</h2>
      <p className="text-gray-800 text-sm mt-2">{humidity}%</p>
    </div>
  )
}

const DescriptionCard = ({ description }) => {
  return (
    <div className="p-8 bg-pink-200 rounded-xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105">
      <div className="text-6xl text-pink-700">
        <Cloudy size={40} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-pink-700">Weather Condition</h2>
      <p className="text-gray-800 text-sm mt-2">{description}</p>
    </div>
  )
}

const RainfallPredictionCard = ({ rainfallPrediction }) => {
  const extendedRainfallPrediction = [
    ...rainfallPrediction,
    ...Array(5 - rainfallPrediction.length).fill(0)
  ]

  const rainfallData = {
    labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
    datasets: [
      {
        label: "Rainfall (mm)",
        data: extendedRainfallPrediction,
        fill: true,
        backgroundColor: "rgba(255, 215, 0, 0.4)",
        borderColor: "rgba(255, 215, 0, 1)",
        tension: 0.2,
        pointRadius: 5,
        pointBackgroundColor: "rgba(255, 215, 0, 1)",
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#ddd",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      title: {
        display: true,
        text: "Rainfall Prediction (Next 5 Days)",
        font: {
          size: 16,
          weight: "bold",
        },
        color: "#FBBF24",
      },
    },
    animation: {
      duration: 1500,
      easing: "easeInOutQuad",
    },
  }

  return (
    <div className="lg:col-span-4 p-16 bg-yellow-200 rounded-xl shadow-lg flex flex-col items-center transition-transform transform">
      <div className="text-6xl text-yellow-700">
        <CloudHail size={50} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-yellow-700">Rainfall Prediction</h2>
      <div className="w-full h-64 mt-4">
        <Line data={rainfallData} options={options} />
      </div>
      <p className="text-gray-800 text-sm mt-2">
        This chart shows the estimated daily rainfall in millimeters (mm) for the next 5 days.
      </p>
    </div>
  )
}


const Weather = () => {
  const { id } = useParams()
  const [weatherData, setWeatherData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          throw new Error("Token not found. Please log in again.")
        }
  
        const response = await axios.get(
          `http://localhost:4000/api/weather/${id}/current`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
  
        if (response.status === 200) {
          const data = response.data.data 
          const rainfallPrediction = data.rainFall || [0, 0, 0, 0, 0, 0, 0] 
          const city = data.location.split(",")[0] 
  
          setWeatherData({
            location: city, 
            temperature: data.temperature,
            feelsLike: data.feelsLike,
            humidity: data.humidity,
            windSpeed: data.windSpeed,
            description: data.description,
            rainfallPrediction, 
          })
        } else {
          throw new Error("Failed to retrieve weather data.")
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
  
    fetchWeatherData()
  }, [id])

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 border-t-transparent"></div>
                <p className="mt-4 text-lg text-gray-700">Loading data...</p>
            </div>
        </div>
    )
}

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">Error: {error}</div>
  }

  if (!weatherData) {
    return <div className="min-h-screen flex items-center justify-center">Data not available.</div>
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-r from-blue-100 via-white to-blue-100 py-6">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Current Weather</h1>
      <div className="text-xl font-semibold text-gray-800 mb-4 -mt-5">
        Location: {weatherData.location}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-screen-lg">
        <TemperatureCard
          temperature={weatherData.temperature}
          feelsLike={weatherData.feelsLike}
        />
        <WindSpeedCard windSpeed={weatherData.windSpeed} />
        <HumidityCard humidity={weatherData.humidity} />
        <DescriptionCard description={weatherData.description} />
        <RainfallPredictionCard rainfallPrediction={weatherData.rainfallPrediction || []} />
      </div>
    </div>
  )
}


export default Weather
