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

        for (let pairs of organizerAndParticipants.rows) {
            allParticipants.push(pairs["users_id"])
        }

        if (allParticipants.indexOf(userId) == -1) {
            res.render("somethingWentWrong.ejs", { message: "You are not a participant for this event!" })
            return
        }


        let organizer1 = organizerAndParticipants.rows[0].organizer

        if (organizer1 == userId) {
            res.render("somethingWentWrong.ejs", { message: "You can't rate yourself!" });
            return
        }

        let checkingIfRepeatedRating = await client.query(
            `SELECT * FROM rating_event
        WHERE rating_event.event_id = $1 and rating_event.users_id =$2`,
            [eventId, userId]
        );


        // console.log(checkingIfRepeatedRating)

        if (!checkingIfRepeatedRating.rows[0]) {

            let checkOrganizerIfAddedExp = await client.query(
                `SELECT users_id FROM rating_event
                Where event_id=$1
                `, [eventId]
            )


            await client.query(
                `INSERT INTO rating_event(users_id, event_id,rating_person_id,single_rating,comment) VALUES ($1,$2, $3, $4,$5)`, [userId, eventId, organizer1, parseInt(data.rating), data.comment]);



            let retrieveHardness = await client.query(
                `SELECT hardness FROM hiking_trail
                JOIN event
                ON event.hiking_trail_id = hiking_trail.id
                WHERE event.id=$1;
                `, [eventId]
            )

            if (!checkOrganizerIfAddedExp.rows[0]) {
                await client.query(`
                UPDATE users
                SET experience = experience + $1
                WHERE users.id = $2;
                `, [retrieveHardness.rows[0].hardness, organizer1])

                let organizerExp = await client.query(`
                SELECT experience FROM users
                WHERE users.id = $1
                `, [organizer1])

                let newLevel = Math.floor(organizerExp.rows[0].experience / 10);

                await client.query(`
                UPDATE users
                SET level = $1
                WHERE users.id = $2
                `, [newLevel, organizer1])
            }


            await client.query(`
                UPDATE users
                SET experience = experience + $1
                WHERE users.id = $2;
                `, [retrieveHardness.rows[0].hardness, userId])

            let userExp = await client.query(`
                SELECT experience FROM users
                WHERE users.id = $1
                `, [userId])

            let newLevel = Math.floor(userExp.rows[0].experience / 10);

            await client.query(`
                UPDATE users
                SET level = $1
                WHERE users.id = $2
                `, [newLevel, userId])



            res.redirect(`/userProfile/${organizer1}`)
        }

        res.render("somethingWentWrong.ejs", { message: "You have rated this event already!" })
    }
    catch (e) {
        console.error(e);
    } finally {
        console.log(`/ratingOthers/api/${req.params.eventId} triggered`)
    }

})

ratingOthers.get("/ratingOthers/checkRatingRemember", async (req, res) => {
    const user_id = req.session["user_id"]
    if (!user_id) {
        res.json({ message: "Don't Login" })
        return
    }
    const data = await client.query(`
        SELECT event_id as id
        FROM (SELECT event_id FROM user_joining_event WHERE users_id = $1 AND auto_rating_msg = true) as user_joining
        WHERE NOT EXISTS (
            SELECT event_id 
            FROM (SELECT event_id FROM rating_event WHERE users_id = $1 ) as event_rating
            WHERE event_id = user_joining.event_id
        );
    `, [user_id])
    const eventId = data.rows
    // Check user don't rating
    res.json(eventId)
})

ratingOthers.get("/ratingOthers/checkRatingRememberUserProfile", async (req, res) => {

    try{    
    const user_id = req.session["user_id"]
    const eventsUserJoined = await client.query(`
    SELECT user_joining_event.event_id
    FROM user_joining_event
    WHERE user_joining_event.users_id = $1 
    `, [user_id]);


    console.log(`${eventsUserJoined.rows}`)
    let checking = []

    for (let entry of eventsUserJoined.rows) {
        let temp = {}
        if (!temp[entry.event_id]){
            temp[entry.event_id]=[]
        }


        const comments = await client.query(`
        SELECT users_id 
        FROM rating_event
        WHERE event_id = $1
        `, [entry.event_id])

        for (let comment of comments.rows){
            temp[entry.event_id].push(comment.users_id)
            console.log(comment.users_id)
        }
        checking.push(temp)
    }

    console.log(checking)


    }
 catch (e){console.log(e)}

})


ratingOthers.put("/neverShowRemember/:id", async (req, res) => {
    try {
        const event_id = req.params.id
        const user_id = req.session["user_id"]
        await client.query(`
            UPDATE user_joining_event 
            SET auto_rating_msg = false 
            WHERE users_id = $1 
            AND event_id =$2
        `, [user_id, event_id])
        res.json("ok")
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})