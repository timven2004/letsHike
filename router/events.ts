import express from "express"
import { client } from '../main'

export const events = express.Router()

events.get("/events", async (req, res) => {
    const data = await client.query(/*sql*/`SELECT event_name, image FROM event LEFT OUTER JOIN hiking_trail ON event.hiking_trail_id = hiking_trail_id 
                 LEFT OUTER JOIN image_hiking_trail ON image_hiking_trail.hiking_trail_id = image_id`)
    const eventsdata = data.rows
    console.log(eventsdata)
    res.json(eventsdata)
})

events.get("/events/eventDetails/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const data = await client.query(/*sql*/`SELECT * FROM event WHERE id = $1`, [id])
        const eventData = data.rows[0]
        res.json(eventData)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server Error" })
    }
})


events.post("/events/createEvent", async (req, res) => {
    try {
        // console.log(req.body)
        const { event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail } = req.body



        let id = await client.query<{ id: number }>(/*sql*/`INSERT INTO event ( event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail) VALUES ($1,$2,$3,$4,$5,$6,$7) returning id`,
            [event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail])
        console.log(id.rows[0].id)
        res.json(id.rows[0].id)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server Error" })
    }
})