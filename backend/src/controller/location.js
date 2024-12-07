import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export class LocationController {
    static async get(req, res) {
        try {
            const { userId } = req.params
    
            const locations = await prisma.location.findMany({
                where: { userId: userId },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            })
    
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
        try {
            const { id } = req.params 
            const location = await prisma.location.findUnique({
                where: { id: id }, 
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            })
    
            if (!location) {
                return res.status(404).json({ msg: "Location not found" })
            }
    
            res.status(200).json({
                data: location,
                msg: "Location retrieved successfully"
            })
        } catch (error) {
            console.error("Error retrieving location:", error)
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }

    static async create(req, res) {
        try {
            const { name, latitude, longitude } = req.body
            if (!name || !latitude || !longitude) {
                return res.status(401).json({ msg: "Fields cannot be empty" })
            }

            const location = await prisma.location.create({
                data: {
                    name,
                    latitude,
                    longitude,
                    userId: req.userId
                }
            })

            res.status(201).json({
                data: location,
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
        try {
            const { id } = req.params 
            const userId = req.userId 
    
            const location = await prisma.location.findUnique({
                where: {
                    id: id,
                    userId: userId 
                }
            })
    
            if (!location) {
                return res.status(404).json({ msg: "Location not found or user does not have permission to update" })
            }
    
            const { name, latitude, longitude } = req.body
            const updatedLocation = await prisma.location.update({
                where: {
                    id: id 
                },
                data: {
                    name,
                    latitude,
                    longitude
                }
            })
    
            res.status(200).json({
                data: updatedLocation,
                msg: "Location updated successfully"
            })
        } catch (error) {
            console.error("Error updating location:", error) 
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }

    static async delete(req, res) {
        try {
            const { id } = req.params 
            const location = await prisma.location.findUnique({
                where: {
                    id: id,
                    userId: req.userId 
                }
            })
    
            if (!location) {
                return res.status(404).json({ msg: "Location not found or user does not have permission to delete" })
            }
    
            await prisma.location.delete({
                where: {
                    id: id 
                }
            })
    
            res.status(200).json({ msg: "Location deleted successfully" })
        } catch (error) {
            console.error("Error deleting location:", error)
            res.status(500).json({
                data: error.message,
                msg: "Internal server error"
            })
        }
    }
}
