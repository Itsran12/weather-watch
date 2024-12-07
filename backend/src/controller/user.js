import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

const prisma = new PrismaClient()

export class UserController {
    static async create(req, res) {
        const { name, email, password } = req.body
        if (!name || !email || !password) {
            return res.status(401).json({ msg: "Fields cannot be empty" })
        }
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (password.length < 4) {
            return res.status(400).json({ error: "Password must be at least 4 characters long" })
        }

        if (!emailRegex.test(email)) {
            return res.status(400).json({ msg: "Invalid email address" })
        }

        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return res.status(400).json({ msg: "Email already in use" })
        }

        const hashPassword = await bcrypt.hash(password, 10)
        try {
            await prisma.user.create({
                data: {
                    name,
                    email,
                    password: hashPassword
                }
            })
            res.status(201).json({
                data: { name, email },
                msg: "User created successfully"
            })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }
}
