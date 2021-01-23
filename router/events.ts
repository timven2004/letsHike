import express from "express"
import { client } from '../main'
import { Event } from '../class/database'

export const events = express.Router()

events.get("/events", async (req, res) => {
    const data = await client.query(`
    SELECT event_name, image FROM event LEFT OUTER JOIN hiking_trail ON event.hiking_trail_id = hiking_trail_id 
    LEFT OUTER JOIN image_hiking_trail ON image_hiking_trail.hiking_trail_id = image_id
    `)
    const eventsdata = data.rows
    res.json(eventsdata)
})

events.get("/events/eventDetails/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const data = await client.query(`SELECT * FROM event WHERE id = $1`, [id])
        // const data = await client.query(`SELECT image, event_name, meeting_point, date, time, max_number_of_member, detail FROM event INNER JOIN hiking_trail ON hiking_trail_id = hiking_trail_id
        // INNER JOIN image_hiking_trail ON image_hiking_trail.hiking_trail_id = image_id WHERE id = $1`, [id])
        const eventData = data.rows[0]
        res.json(eventData)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server Error" })
    }
})

events.post("/events/createEvent", async (req, res) => {
    try {
        const { event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail } = req.body


        let id = await client.query<Event>(`
        INSERT INTO event ( event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail) 
        VALUES ($1,$2,$3,$4,$5,$6,$7) returning id
        `,
            [event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail])
        // console.log(id.rows[0].id)
        res.json(id.rows[0].id)
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server Error" })
    }
})

events.put("/events/updateEventDetail/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const { event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail } = req.body
        await client.query<Event>(`
            UPDATE event SET (event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail) = ($1,$2,$3,$4,$5,$6,$7) WHERE id = $8
            `,
            [event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail, id])
        res.json("success")
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server Error" })
    }
})

events.delete("/events/deleteEvent/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        if (isNaN(id)) {
            res.status(400).json({ message: "Invalid event ID" })
            return
        }
        const data = await client.query(`SELECT * FROM event WHERE id = $1`, [id])
        const eventData = data.rows[0]

        const active = (eventData.id === id && eventData.is_active === true)
        if (!active) {
            res.status(400).json({ message: "event not found" })
            return
        }
        const update = await client.query<Event>(`UPDATE event SET is_active = false WHERE id = $1 `, [id])
        console.log(update)
        res.json("success")
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server Error" })
    }
})

events.post("/userJoinEvent", async (req, res) => {
    try {
        const user_id = req.session["user_id"]
        const event_id = req.body.event_id
        await client.query(`
            INSERT INTO user_joining_event (users_id,event_id) VALUES ($1,$2)
        `,[user_id,event_id])
        res.json("success")
    } catch (err) {
        console.error(err.message)
        res.status(500).json("Internal server error")
    }
})