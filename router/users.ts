import express from "express"
import { client } from "../main"

export const users = express.Router()

users.post("/users", async (req, res) => {
    try {
        let data = req.body
        console.log(data)
        await client.query(`
            INSERT INTO users ( name, email, password ) VALUES ($1,$2,$3)
        `, [data.name, data.email, data.password])
        res.json({ message:"success"})
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
})