import express from "express"
import { client } from "../main"

export const ratingOthers = express.Router()

ratingOthers.get('/ratingOthers/api/:id', async (req, res) => {
    try {
        let data = await client.query(
            `SELECT * 
            FROM event
            JOIN users
            ON event.organizer=users.id
            WHERE event.id=$1
            ;`, [req.params.id]);

        res.json(data.rows[0]);
        console.log(data.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }

})

ratingOthers.post('/ratingOthers/api/:eventId', async (req, res) => {
    try {
        let data = req.body;
        let eventId = req.params.eventId;
        let userId = req.session["user_id"];
        // console.log(data);
        // console.log(eventId);
        // console.log(userId);

        let organizer = await client.query(
            `SELECT organizer FROM event
        WHERE event.id = $1`
            , [eventId])


        // console.log(organizer.rows[0])    
        let organizer1 = organizer.rows[0].organizer

        let checkingIfRepeatedRating = await client.query(
            `SELECT * FROM rating_event
        WHERE rating_event.event_id = $1 and rating_event.users_id =$2`,
            [eventId, userId]
        );

        console.log(checkingIfRepeatedRating)
        
        if(!checkingIfRepeatedRating.rows[0]){
            let response = await client.query(
                `INSERT INTO rating_event(users_id, event_id,rating_person_id,single_rating,comment) VALUES ($1,$2, $3, $4,$5)`, [userId, eventId, organizer1, parseInt(data.rating), data.comment]);
                
            res.send("Rated Successfully")
            response
        }

        res.status(500).json({message:"You have rated already!"})
        }
     catch (e) {
        console.error(e);
    } finally {
        console.log(`/ratingOthers/api/${req.params.eventId} triggered`)
    }

})