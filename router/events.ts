import express from "express"
import { client } from '../main'

export const events = express.Router()

events.get("/", (req, res) => {
    res.send('get events')
})

events.post("/events/createEvent", async (req, res) => {
    // try {
    console.log(req.body)
    const { event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail } = req.body

    await client.query(/*sql*/`INSERT INTO event ( event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail])
    res.json({ message: "success" })
    // } catch (err) {
    //     console.error(err.message)
    //     res.status(500).json({ message: "Internal server Error" })
    // }
})