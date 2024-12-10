import { PrismaClient } from "@prisma/client"
import axios from "axios"

const prisma = new PrismaClient()
const apiKey = process.env.WEATHER_API

export class WeatherController {
    static async fetchLocation(locationId) {
        const location = await prisma.location.findUnique({
            where: { id: locationId },
            include: { weatherData: true }
        })
        if (!location) throw new Error("Location not found")
        return location
    }

    static buildDateFilter(startDate, endDate) {
        if (!startDate || !endDate) return {}
        return {
            recordedAt: {
                gte: new Date(startDate),
                lte: new Date(endDate),
            },
        }
    }

    static formatLocationString(location) {
        return [location.name, location.region, location.country].filter(Boolean).join(", ")
    }

    static async fetchWeatherData(latitude, longitude) {
        const params = { lat: latitude, lon: longitude, appid: apiKey, units: "metric" }
        const [weatherResponse, forecastResponse] = await Promise.all([
            axios.get("https://api.openweathermap.org/data/2.5/weather", { params }),
            axios.get("https://api.openweathermap.org/data/2.5/forecast", { params }),
        ])
        return { weather: weatherResponse.data, forecast: forecastResponse.data }
    }

    static async fetchAndSaveWeather(req, res) {
        try {
            const { locationId } = req.params
            const location = await WeatherController.fetchLocation(locationId)

            const { weather } = await WeatherController.fetchWeatherData(location.latitude, location.longitude)

            const savedWeather = await prisma.weatherData.create({
                data: {
                    locationId: location.id,
                    temperature: weather.main.temp,
                    humidity: weather.main.humidity,
                    windSpeed: weather.wind.speed,
                    recordedAt: new Date(),
                },
            })

            res.status(201).json({
                data: { ...savedWeather, name: location.name },
                msg: "Weather data saved successfully",
            })
        } catch (error) {
            res.status(500).json({ error: error.message, msg: "Internal server error" })
        }
    }

    static async getWeatherHistory(req, res) {
        try {
            const { locationId } = req.params
            const { startDate, endDate } = req.query

            const location = await WeatherController.fetchLocation(locationId)

            const dateFilter = WeatherController.buildDateFilter(startDate, endDate)

            const weatherHistory = await prisma.weatherData.findMany({
                where: { locationId: location.id, ...dateFilter },
                orderBy: { recordedAt: "desc" },
            })

            res.status(200).json({
                data: weatherHistory,
                msg: "Weather history retrieved successfully",
            })
        } catch (error) {
            res.status(500).json({ error: error.message, msg: "Internal server error" })
        }
    }

    static async getCurrentWeather(req, res) {
        try {
            const { locationId } = req.params
            const location = await WeatherController.fetchLocation(locationId)

            const { weather, forecast } = await WeatherController.fetchWeatherData(location.latitude, location.longitude)

            const rainFall = forecast.list
                .filter((_, index) => index % 8 === 0)
                .map((item) => (item.rain?.["3h"] || 0))

            await prisma.weatherData.create({
                data: {
                    locationId: location.id,
                    temperature: weather.main.temp,
                    humidity: weather.main.humidity,
                    windSpeed: weather.wind.speed,
                    rainFall,
                    recordedAt: new Date(),
                },
            })

            res.status(200).json({
                data: {
                    location: WeatherController.formatLocationString(location),
                    temperature: weather.main.temp,
                    feelsLike: weather.main.feels_like,
                    humidity: weather.main.humidity,
                    windSpeed: weather.wind.speed,
                    description: weather.weather[0].description,
                    rainFall,
                },
                msg: "Current weather retrieved and saved successfully",
            })
        } catch (error) {
            res.status(500).json({ error: error.message, msg: "Internal server error" })
        }
    }

    static async deleteWeatherHistory(req, res) {
        try {
            const { locationId } = req.params
            const { beforeDate } = req.query

            const location = await WeatherController.fetchLocation(locationId)

            const deleteFilter = {
                locationId: location.id,
                ...(beforeDate && { recordedAt: { lt: new Date(beforeDate) } }),
            }

            const deleteResult = await prisma.weatherData.deleteMany({ where: deleteFilter })

            res.status(200).json({
                data: deleteResult,
                msg: "Weather history deleted successfully",
            })
        } catch (error) {
            res.status(500).json({ error: error.message, msg: "Internal server error" })
        }
    }
}
