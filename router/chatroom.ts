import express from "express"
import { upload, client } from "../main"

export const chatroom = express.Router()

chatroom.post("/chatroom/addMessage", upload.none(), async (req, res) => {
    try {
        if (req.session["user_id"]) {
            const user_id = req.session["user_id"]
            const event_id = req.body.event_id
            const comment = req.body.comment
            let id = await client.query(`
                INSERT INTO chatroom (users_id, event_id, content) VALUES ($1,$2,$3) RETURNING id
            `, [user_id, event_id, comment])
            res.json(id.rows[0].id)
        } else {
            res.json('no login')
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})

chatroom.get("/chatroom/getMessage/:event_id", async (req, res) => {
    try {
        const event_id = req.params.event_id
        const chatMessage = await client.query(`
        SELECT date,user_name,content,chatroom.id as id,users_id FROM chatroom INNER JOIN users ON chatroom.users_id = users.id WHERE event_id = $1
        `, [event_id])
        res.json(chatMessage.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})

chatroom.delete("/deleteChatroomMessage/:id", async (req, res) => {
    try {
        const id = req.params.id
        await client.query(`
            DELETE FROM chatroom WHERE id = $1
        `, [id])
        res.json("ok")
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})