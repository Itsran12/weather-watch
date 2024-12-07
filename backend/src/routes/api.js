import express from "express"
import { UserController } from "../controller/user.js"
import { AuthController } from "../controller/auth.js"
import { LocationController } from "../controller/location.js"
import { WeatherController } from "../controller/weather.js"
import { Middleware } from "../middleware/middleware.js"

const apiRouter = express.Router()

// USER API
apiRouter.post("/api/users", UserController.create)

// AUTH API
apiRouter.post("/api/login", AuthController.login)
apiRouter.get("/api/me", Middleware.verify, AuthController.me)
apiRouter.delete("/api/logout/:id", Middleware.verify, AuthController.logout)

// LOCATION API
apiRouter.get("/api/locations", Middleware.verify, LocationController.get)
apiRouter.get("/api/locations/:id", Middleware.verify, LocationController.getById)
apiRouter.post("/api/locations", Middleware.verify, LocationController.create)
apiRouter.patch("/api/locations/:id", Middleware.verify, LocationController.update)
apiRouter.delete("/api/locations/:id", Middleware.verify, LocationController.delete)

// WEATHER API
apiRouter.get("/api/weather/:locationId/get", Middleware.verify, WeatherController.fetchAndSaveWeather)
apiRouter.get("/api/weather/:locationId/current", Middleware.verify, WeatherController.getCurrentWeather)
apiRouter.get("/api/weather/:locationId/history", Middleware.verify, WeatherController.getWeatherHistory)
apiRouter.delete("/api/weather/:locationId/delete", Middleware.verify, WeatherController.deleteWeatherHistory)

export default apiRouter