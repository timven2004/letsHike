import express, { Request, Response, NextFunction } from "express"
import { client } from "../main"

export const ratingOthers = express.Router()


const checkSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.session["user_id"]) {
        next()
    } else res.redirect("/login.html")
}

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

ratingOthers.post('/ratingOthers/api/:eventId', checkSession, async (req, res) => {
    try {
        let data = req.body;
        let eventId = req.params.eventId;
        let userId = req.session["user_id"];
        // console.log(data);
        // console.log(eventId);
        // console.log(userId);

        let organizerAndParticipants = await client.query(
            `SELECT event.organizer,user_joining_event.users_id 
            FROM event JOIN user_joining_event
            ON event.id=user_joining_event.event_id
            WHERE event.id= $1;`
            , [eventId])


            let allParticipants = [];

            for (let pairs of organizerAndParticipants.rows){
                allParticipants.push(pairs.user_id)
            }

            if (allParticipants.indexOf(userId) == -1){
                res.render("somethingWentWrong.ejs", {message: "You are not participant for this event!"})
                return
            }

        let organizer1 = organizerAndParticipants.rows[0].organizer

        let checkingIfRepeatedRating = await client.query(
            `SELECT * FROM rating_event
        WHERE rating_event.event_id = $1 and rating_event.users_id =$2`,
            [eventId, userId]
        );
        
        
        // console.log(checkingIfRepeatedRating)

        if (!checkingIfRepeatedRating.rows[0]) {
            let response = await client.query(
                `INSERT INTO rating_event(users_id, event_id,rating_person_id,single_rating,comment) VALUES ($1,$2, $3, $4,$5)`, [userId, eventId, organizer1, parseInt(data.rating), data.comment]);

            res.redirect(`/userProfile/${organizer1}`)
            response
        }

        res.render("somethingWentWrong.ejs", { message: "You have rated this event already!" })
    }
    catch (e) {
        console.error(e);
    } finally {
        console.log(`/ratingOthers/api/${req.params.eventId} triggered`)
    }

})

ratingOthers.get("/checkRatingRemember", async (req, res) => {
    const user_id = req.session["user_id"]
    let eventId: { id: Number }[] = []
    if(!user_id){
        res.json({message:"Don't Login"})
        return
    }
    // Get eventUserJoining
    const data = await client.query(`
        SELECT event.id FROM user_joining_event 
        LEFT JOIN event ON user_joining_event.event_id = event.id 
        WHERE users_id = $1 
        AND auto_rating_msg = true 
    `, [user_id])
    const eventUserJoining = data.rows
    // Check user don't rating
    for (const event of eventUserJoining) {
        const event_id = event.id
        const res = await client.query(`
            SELECT COUNT(*) FROM rating_event 
            WHERE users_id = $1 
            AND event_id = $2
        `, [user_id, event_id])
        if(res.rows){
            eventId.push(event)
        }
    }
    res.json(eventId)
})
