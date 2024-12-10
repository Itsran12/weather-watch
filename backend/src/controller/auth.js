import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export class AuthController {
    static async findUserByEmail(email) {
        return await prisma.user.findUnique({
            where: { email }
        })
    }

    static async findUserById(userId) {
        return await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true
            }
        })
    }

    static async generateToken(payload, secret, options) {
        return jwt.sign(payload, secret, options)
    }

    static async login(req, res) {
        const { email, password } = req.body

        try {
            const user = await AuthController.findUserByEmail(email)
            if (!user) {
                return res.status(401).json({ msg: "User not found" })
            }

            const isMatch = await bcrypt.compare(password, user.password)
            if (!isMatch) {
                return res.status(401).json({ msg: "Email or Password invalid" })
            }

            const token = await AuthController.generateToken(
                { id: user.id, name: user.name, email: user.email },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" }
            )

            await prisma.user.update({
                where: { email: user.email },
                data: { token }
            })

            res.status(200).json({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token
                },
                msg: "User logged in successfully"
            })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }

    static async me(req, res) {
        const authHeader = req.headers.authorization
        const token = authHeader?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ msg: "Token not found" })
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const user = await AuthController.findUserById(decoded.id)

            if (!user) {
                return res.status(401).json({ msg: "User not found" })
            }

            res.status(200).json({
                data: user,
                msg: "User information retrieved successfully"
            })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }

    static async logout(req, res) {
        const authHeader = req.headers.authorization
        const token = authHeader?.split(" ")[1]

        if (!token) {
            return res.status(401).json({ msg: "No token provided" })
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            await prisma.user.update({
                where: { id: decoded.id },
                data: { token: null }
            })
            res.status(200).json({ msg: "Successfully logged out" })
        } catch (error) {
            res.status(401).json({
                data: error.message,
                msg: "Invalid token"
            })
        }
    }
}
