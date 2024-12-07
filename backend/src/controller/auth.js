import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const prisma = new PrismaClient()

export class AuthController {
    static async login(req, res) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email: req.body.email
                }
            })
    
            if (!user) {
                return res.status(401).json({ msg: "User not found" })
            }
    
            const isMatch = await bcrypt.compare(req.body.password, user.password)
            if (!isMatch) {
                return res.status(401).json({ msg: "Email or Password invalid" })
            }
    
            const token = jwt.sign({
                id: user.id,
                name: user.name,
                email: user.email
            }, process.env.JWT_SECRET_KEY, {
                expiresIn: "1h"
            })
    
            await prisma.user.update({
                where: {
                    email: user.email
                },
                data: {
                    token: token
                }
            })
    
            res.status(200).json({
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    token: token
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
        try {
            const token = req.headers.authorization?.split(" ")[1]
            if (!token) {
                return res.status(401).json({ msg: "Token not found" })
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const user = await prisma.user.findUnique({
                where: {
                    id: decoded.id
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                }
            })

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
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({ msg: "No token provided" })
        }

        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY)
            const userId = decode.id
            await prisma.user.update({
                where: { id: userId },
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
