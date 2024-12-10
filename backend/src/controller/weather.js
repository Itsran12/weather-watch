import { PrismaClient } from "@prisma/client"
import axios from "axios"

const prisma = new PrismaClient()
const apiKey = process.env.WEATHER_API

export class WeatherController {
    static async fetchAndSaveWeather(req, res) {
        try {
            const { locationId } = req.params
            const location = await prisma.location.findUnique({
                where: { id: locationId }
            })

            if (!location) {
                return res.status(404).json({ msg: "Location not found" })
            }

            const weather = await axios.get("https://api.openweathermap.org/data/2.5/weather", {
                params: {
                    lat: location.latitude,
                    lon: location.longitude,
                    name: location.name,
                    appid: apiKey,
                    units: 'metric'
                }
            })

            const weatherData = weather.data

            const saveWeather = await prisma.weatherData.create({
                data: {
                    locationId: location.id,
                    temperature: weatherData.main.temp,
                    humidity: weatherData.main.humidity,
                    windSpeed: weatherData.wind.speed,
                    recordedAt: new Date()
                }
            })

            res.status(201).json({
                data: {
                    ...saveWeather,
                    name: location.name
                },
                msg: "Weather data saved successfully"
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                data: error.response ? error.response.data : error.message,
                msg: "Internal server error"
            })
        }
    }

    static async getWeatherHistory(req, res) {
        try {
            const { locationId } = req.params
            const { startDate, endDate } = req.query

            const location = await prisma.location.findUnique({
                where: { id: locationId }
            })

            if (!location) {
                return res.status(400).json({ msg: "Location not found" })
            }

            const filterDate = {}
            if (startDate && endDate) {
                filterDate.recordedAt = {
                    gte: new Date(startDate),
                    lte: new Date(endDate)
                }
            }

            const weatherHistory = await prisma.weatherData.findMany({
                where: {
                    locationId: location.id,
                    ...filterDate
                },
                orderBy: {
                    recordedAt: 'desc'
                }
            })

            res.status(200).json({
                data: weatherHistory,
                msg: "Weather history retrieved successfully"
            })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }

    static async getCurrentWeather(req, res) {
        try {
            const { locationId } = req.params
            const location = await prisma.location.findUnique({
                where: { id: locationId },
            })

            if (!location) {
                return res.status(404).json({ msg: "Location not found" })
            }

            const responseWeather = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
                params: {
                    lat: location.latitude,
                    lon: location.longitude,
                    appid: apiKey,
                    units: 'metric',
                },
            })

            const responseForecast = await axios.get('https://api.openweathermap.org/data/2.5/forecast', {
                params: {
                    lat: location.latitude,
                    lon: location.longitude,
                    appid: apiKey,
                    units: 'metric',
                },
            })

            const weatherData = responseWeather.data

            const rainFall = responseForecast.data.list
                .filter((item, index) => index % 8 === 0)
                .map((item) => (item.rain && item.rain['3h']) ? item.rain['3h'] : 0)

            await prisma.weatherData.create({
                data: {
                    locationId: location.id,
                    temperature: weatherData.main.temp,
                    humidity: weatherData.main.humidity,
                    windSpeed: weatherData.wind.speed,
                    rainFall: rainFall,
                    recordedAt: new Date(),
                },
            })

            const locationString = [
                location.name,
                location.region,
                location.country
            ].filter(Boolean).join(', ')

            res.status(200).json({
                data: {
                    location: locationString,
                    temperature: weatherData.main.temp,
                    feelsLike: weatherData.main.feels_like,
                    humidity: weatherData.main.humidity,
                    windSpeed: weatherData.wind.speed,
                    description: weatherData.weather[0].description,
                    rainFall: rainFall,
                },
                msg: "Current weather and rainfall prediction retrieved and saved successfully",
            })

            
        } catch (error) {
            res.status(500).json({
                error: error.message,
                msg: "Internal server error",
            })
        }
    }

    static async deleteWeatherHistory(req, res) {
        try {
            const { locationId } = req.params
            const { beforeDate } = req.query

            const location = await prisma.location.findUnique({
                where: { id: locationId }
            })

            if (!location) {
                return res.status(404).json({ msg: "Location not found" })
            }

            const deleteData = { locationId: locationId }
            if (beforeDate) {
                deleteData.recordedAt = { lt: new Date(beforeDate) }
            }

            const deleteResult = await prisma.weatherData.deleteMany({
                where: deleteData
            })

            res.status(200).json({
                data: deleteResult,
                msg: "Weather history deleted successfully"
            })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }
}
