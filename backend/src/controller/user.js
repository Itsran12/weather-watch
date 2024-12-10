import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export class UserController {
    static validateInput({ name, email, password }) {
        if (!name || !email || !password) {
            throw new Error("Fields cannot be empty")
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!emailRegex.test(email)) {
            throw new Error("Invalid email address")
        }

        if (password.length < 4) {
            throw new Error("Password must be at least 4 characters long")
        }
    }

    static async checkExistingUser(email) {
        const user = await prisma.user.findUnique({
            where: { email },
            select: { id: true }
        })
        if (user) throw new Error("Email already in use")
    }

    static async hashPassword(password) {
        return await bcrypt.hash(password, 10)
    }

    static async create(req, res) {
        const { name, email, password } = req.body

        try {
            UserController.validateInput({ name, email, password })

            await UserController.checkExistingUser(email)

            const hashPassword = await UserController.hashPassword(password)

            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword
                },
                select: {
                    name: true,
                    email: true
                }
            })

            res.status(201).json({
                data: newUser,
                msg: "User created successfully"
            })
        } catch (error) {
            const statusCode = error.message === "Email already in use" ||
                error.message === "Fields cannot be empty" ||
                error.message === "Invalid email address" ||
                error.message.includes("Password must be") ? 400 : 500

            res.status(statusCode).json({
                error: error.message,
                msg: statusCode === 500 ? "Internal server error" : error.message
            })
        }
    }
}
