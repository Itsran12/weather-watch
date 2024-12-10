import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class LocationController {
    static validateLocationFields({ name, latitude, longitude }) {
        if (!name || !latitude || !longitude) {
            throw new Error("Fields cannot be empty")
        }
    }

    static async findLocationsByUserId(userId) {
        return await prisma.location.findMany({
            where: { userId },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        })
    }

    static async findLocationById(id, userId) {
        return await prisma.location.findUnique({
            where: { id, userId },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        })
    }

    static async get(req, res) {
        const { userId } = req.params

        try {
            const locations = await LocationController.findLocationsByUserId(userId)
            if (locations.length === 0) {
                return res.status(404).json({ msg: "User does not have a location" })
            }

            res.status(200).json({
                data: locations,
                msg: "Locations retrieved successfully"
            })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }

    static async getById(req, res) {
        const { id } = req.params

        try {
            const location = await LocationController.findLocationById(id, req.userId)
            if (!location) {
                return res.status(404).json({ msg: "Location not found" })
            }

            res.status(200).json({
                data: location,
                msg: "Location retrieved successfully"
            })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }

    static async create(req, res) {
        const { name, latitude, longitude } = req.body

        try {
            LocationController.validateLocationFields({ name, latitude, longitude })

            const newLocation = await prisma.location.create({
                data: {
                    name,
                    latitude,
                    longitude,
                    userId: req.userId
                },
                select: {
                    id: true,
                    name: true,
                    latitude: true,
                    longitude: true,
                    userId: true
                }
            })

            res.status(201).json({
                data: newLocation,
                msg: "Location created successfully"
            })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }

    static async update(req, res) {
        const { id } = req.params
        const { name, latitude, longitude } = req.body

        try {
            const location = await LocationController.findLocationById(id, req.userId)
            if (!location) {
                return res.status(404).json({
                    msg: "Location not found or user does not have permission to update"
                })
            }

            const updatedLocation = await prisma.location.update({
                where: { id },
                data: { name, latitude, longitude },
                select: {
                    id: true,
                    name: true,
                    latitude: true,
                    longitude: true
                }
            })

            res.status(200).json({
                data: updatedLocation,
                msg: "Location updated successfully"
            })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }

    static async delete(req, res) {
        const { id } = req.params

        try {
            const location = await LocationController.findLocationById(id, req.userId)
            if (!location) {
                return res.status(404).json({
                    msg: "Location not found or user does not have permission to delete"
                })
            }

            await prisma.location.delete({ where: { id } })

            res.status(200).json({ msg: "Location deleted successfully" })
        } catch (error) {
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }
}
