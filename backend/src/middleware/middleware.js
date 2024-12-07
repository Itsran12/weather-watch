import { PrismaClient } from "@prisma/client"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export class Middleware {
    static async verify(req, res, next) {
        try {
            const authHeader = req.headers.authorization
            if (!authHeader) {
                return res.status(401).json({ msg: "Token not provided" })
            }

            const token = authHeader.split(" ")[1]
            if (!token) {
                return res.status(401).json({ msg: "Token is empty" })
            }

            let decoded
            try {
                decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            } catch (jwtError) {
                if (jwtError instanceof jwt.TokenExpiredError) {
                    return res.status(403).json({ msg: "Token expired" });
                }
                return res.status(401).json({ msg: "Token invalid" })
            }

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    token: true,
                }
            })

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
