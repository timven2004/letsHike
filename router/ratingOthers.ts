import express from "express"
import { client } from "../main"

export const ratingOthers = express.Router()

ratingOthers.get('/ratingOthers/api/:id', async (req,res)=>{
    try {
        let data = await client.query(
            `SELECT * 
            FROM event
            JOIN users
            ON event.organizer=users.id
            WHERE event.id=$1
            ;`, [req.params.id]);

        res.json(data.rows[0]);
            console.log(data)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }

})

