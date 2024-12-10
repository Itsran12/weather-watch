import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export class Middleware {
    static extractToken(authHeader) {
        if (!authHeader) return null
        const parts = authHeader.split(" ")
        return parts.length === 2 ? parts[1] : null
    }

    static async findUserById(userId) {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                token: true
            }
        })
    }

    static async verify(req, res, next) {
        const authHeader = req.headers.authorization
        const token = Middleware.extractToken(authHeader)

        if (!token) {
            return res.status(401).json({ msg: "Token not provided or empty" })
        }

        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        } catch (jwtError) {
            const statusCode = jwtError instanceof jwt.TokenExpiredError ? 403 : 401
            const message = jwtError instanceof jwt.TokenExpiredError ? "Token expired" : "Token invalid"
            return res.status(statusCode).json({ msg: message })
        }

        try {
            const user = await Middleware.findUserById(decoded.id)
            if (!user) {
                return res.status(401).json({ msg: "User not found" })
            }

            if (user.token !== token) {
                return res.status(401).json({ msg: "User already logged in" })
            }

            req.user = { id: user.id }
            req.userId = user.id
            next()
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }
}
