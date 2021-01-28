import express from "express"
import { upload, client } from "../main"

export const chatroom = express.Router()

chatroom.post("/chatroom/addMessage", upload.none(), async (req, res) => {
    try {
        console.log("1");

        if (req.session["user_id"]) {
            console.log("2");

            const user_id = req.session["user_id"]
            const event_id = req.body.event_id
            const comment = req.body.comment
            let id = await client.query(`
                INSERT INTO chatroom (users_id, event_id, content) VALUES ($1,$2,$3) RETURNING id
            `, [user_id, event_id, comment])
            res.json(id.rows[0].id)
        } else {
            console.log("3");
            
            res.json('no login')
            console.log("3");
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
        SELECT * FROM chatroom INNER JOIN users ON chatroom.users_id = users.id WHERE event_id = $1
        `, [event_id])
        res.json(chatMessage.rows)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})
