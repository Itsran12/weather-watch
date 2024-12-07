import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import apiRouter from "./routes/api.js"

dotenv.config()
const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())
app.use(apiRouter)

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server running on port ${process.env.SERVER_PORT}`)
})