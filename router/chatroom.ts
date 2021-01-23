import express from "express"
import { upload, client } from "../main"

export const chatroom = express.Router()

chatroom.post("/chatroom/addMessage", upload.none(), async (req, res) => {
    try {
        const user_id = req.session["user_id"]
        const event_id = req.body.event_id
        const comment = req.body.comment
        await client.query(`
            INSERT INTO chatroom (users_id, event_id, content) VALUES ($1,$2,$3)
        `, [user_id, event_id, comment])
        res.json({ message: "Success" })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})
