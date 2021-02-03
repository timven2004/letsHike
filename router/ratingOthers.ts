import express from 'express';
import { client } from '../main';
import { checkSession } from './middleware';

export const ratingOthers = express.Router();

ratingOthers.get('/ratingOthers/api/:id', async (req, res) => {
    try {
        let data = await client.query(
            /*SQL*/ `SELECT * FROM event
            INNER JOIN users ON event.organizer = users.id
            WHERE event.id = $1;`,
            [req.params.id]
        );

        data.rows[0]['password'] = 'password is hidden from server side';

        res.json(data.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

ratingOthers.post(
    '/ratingOthers/api/v2/:eventId',
    checkSession,
    async (req, res) => {
        try {
            // const data = req.body;
            const eventId = req.params.eventId;
            const userId = req.session['user_id'];

            const participants = (
                await client.query(
                    /*SQL*/ `
                SELECT users_id FROM user_joining_event
                WHERE event_id = $1;
            `,
                    [eventId]
                )
            ).rows.map((row) => row.users_id);

            const organizerInfo = (
                await client.query<{
                    id: number;
                    experience: number;
                    event_id: number;
                    count: number;
                }>(
                    /*SQL*/ `
                    SELECT users.id, users.experience, event.id as event_id, COUNT(rating_event.users_id)
                    FROM users INNER JOIN event ON users.id = event.organizer
                    LEFT JOIN rating_event ON rating_event.event_id = event.id
                    WHERE event.id = $1
                    GROUP BY users.id, users.experience, event.id;
            `,
                    [eventId]
                )
            ).rows[0];

            if (organizerInfo.id === userId) {
                res.status(400).json({
                    message: "You can't rate yourself!",
                });
                return;
            } else if (participants.indexOf(userId) === -1) {
                res.status(400).json({
                    message: 'You are not a participant for this event!',
                });
                return;
            }

            const checkingIfRepeatedRating = (
                await client.query(
                    // use count
                    /*SQL */ `SELECT * FROM rating_event
                    WHERE rating_event.event_id = $1 and rating_event.users_id =$2`,
                    [eventId, userId]
                )
            ).rowCount;

            if (checkingIfRepeatedRating !== 0) {
                res.status(400).json({
                    message: 'duplicated',
                });
                return;
            }

            res.json({ participants });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'internal server error' });
        }
    }
);

ratingOthers.post(
    '/ratingOthers/api/:eventId',
    checkSession,
    async (req, res) => {
        try {
            let data = req.body;
            let eventId = req.params.eventId;
            let userId = req.session['user_id'];

            // cannot select organizer
            let organizerAndParticipants = await client.query(
                /*SQL */ `
                SELECT event.organizer, user_joining_event.users_id 
                FROM event JOIN user_joining_event
                ON event.id = user_joining_event.event_id
                WHERE event.id= $1;`,
                [eventId]
            );

            const allParticipants = [];

            for (let pairs of organizerAndParticipants.rows) {
                allParticipants.push(pairs['users_id']);
            }

            if (allParticipants.indexOf(userId) == -1) {
                res.render('somethingWentWrong.ejs', {
                    message: 'You are not a participant for this event!',
                });
                return;
            }

            let organizer1 = organizerAndParticipants.rows[0].organizer;

            // never happen
            if (organizer1 == userId) {
                res.render('somethingWentWrong.ejs', {
                    message: "You can't rate yourself!",
                });
                return;
            }

            let checkingIfRepeatedRating = await client.query(
                // use count
                /*SQL */ `SELECT * FROM rating_event
                    WHERE rating_event.event_id = $1 and rating_event.users_id =$2`,
                [eventId, userId]
            );

            if (!checkingIfRepeatedRating.rows[0]) {
                let checkOrganizerIfAddedExp = await client.query(
                    /*SQL */ `SELECT users_id FROM rating_event Where event_id = $1`,
                    [eventId]
                );

                await client.query(
                    /*SQL */ `INSERT INTO rating_event(users_id, event_id, rating_person_id, single_rating, comment) 
                    VALUES ($1, $2, $3, $4, $5)`,
                    [
                        userId,
                        eventId,
                        organizer1,
                        parseInt(data.rating),
                        data.comment,
                    ]
                );

                let retrieveHardness = await client.query(
                    /*SQL */ `SELECT hardness FROM hiking_trail
                        JOIN event
                        ON event.hiking_trail_id = hiking_trail.id
                        WHERE event.id = $1;
                    `,
                    [eventId]
                );

                if (!checkOrganizerIfAddedExp.rows[0]) {
                    await client.query(
                        /*SQL */ `
                            UPDATE users
                            SET experience = experience + $1
                            WHERE users.id = $2;
                        `,
                        [retrieveHardness.rows[0].hardness, organizer1]
                    );

                    let organizerExp = await client.query(
                        /*SQL */ `SELECT experience FROM users WHERE users.id = $1`,
                        [organizer1]
                    );

                    let newLevel = Math.floor(
                        organizerExp.rows[0].experience / 10
                    );

                    await client.query(
                        /*SQL */ `UPDATE users SET level = $1 WHERE users.id = $2`,
                        [newLevel, organizer1]
                    );
                }

                await client.query(
                    `
                UPDATE users
                SET experience = experience + $1
                WHERE users.id = $2;
                `,
                    [retrieveHardness.rows[0].hardness, userId]
                );

                let userExp = await client.query(
                    `
                SELECT experience FROM users
                WHERE users.id = $1
                `,
                    [userId]
                );

                let newLevel = Math.floor(userExp.rows[0].experience / 10);

                await client.query(
                    `
                UPDATE users
                SET level = $1
                WHERE users.id = $2
                `,
                    [newLevel, userId]
                );

                res.redirect(`/userProfile/${organizer1}`);
            }

            res.render('somethingWentWrong.ejs', {
                message: 'You have rated this event already!',
            });
        } catch (e) {
            console.error(e.message);
            res.status(500).json({ message: 'internal server error' });
        }
    }
);

ratingOthers.get('/ratingOthers/checkRatingRemember', async (req, res) => {
    const user_id = req.session['user_id'];
    if (!user_id) {
        res.json({ message: "Don't Login" });
        return;
    }
    const data = await client.query(
        `
        SELECT event_id as id
        FROM (SELECT event_id FROM user_joining_event WHERE users_id = $1 AND auto_rating_msg = true) as user_joining
        WHERE NOT EXISTS (
            SELECT event_id 
            FROM (SELECT event_id FROM rating_event WHERE users_id = $1 ) as event_rating
            WHERE event_id = user_joining.event_id
        );
    `,
        [user_id]
    );
    const eventId = data.rows;
    // Check user don't rating
    res.json(eventId);
});

ratingOthers.get(
    '/ratingOthers/checkRatingRememberUserProfile',
    checkSession,
    async (req, res) => {
        try {
            const user_id = req.session['user_id'];
            const eventsUserJoined = await client.query(
                `
        SELECT user_joining_event.event_id
        FROM user_joining_event
        WHERE user_joining_event.users_id = $1 
        `,
                [user_id]
            );

            console.log(`${eventsUserJoined.rows}`);
            let checking = [];

            for (let entry of eventsUserJoined.rows) {
                let temp = {};
                if (!temp[entry.event_id]) {
                    temp[entry.event_id] = [];
                }

                const comments = await client.query(
                    `
        SELECT users_id 
        FROM rating_event
        WHERE event_id = $1
        `,
                    [entry.event_id]
                );

                for (let comment of comments.rows) {
                    temp[entry.event_id].push(comment.users_id);
                    // console.log(comment.users_id)
                }
                checking.push(temp);
            }
            // console.log("checking:" + checking)
            let result = [];
            for (let obj of checking) {
                // console.log(obj)
                for (let property in obj) {
                    if (obj[property].indexOf(user_id) == -1) {
                        let temp = await client.query(
                            `SELECT event.id, event.event_name, event.organizer, event.date, event.detail, users.user_name
                                                FROM event
                                                JOIN users
                                                ON event.organizer = users.id
                                                WHERE event.id = $1
                                                AND NOT event.organizer = $2`,
                            [property, user_id]
                        );
                        // console.log("temp:" + temp.rows[0]);
                        if (temp.rows[0]) {
                            result.push(temp.rows[0]);
                        }
                    }
                }
            }

            // console.log("check:"+ checking);
            // console.log("result:" + result)
            res.json(result);
        } catch (e) {
            console.log(e);
        }
    }
);

ratingOthers.put('/neverShowRemember/:id', async (req, res) => {
    try {
        const event_id = req.params.id;
        const user_id = req.session['user_id'];
        await client.query(
            `
            UPDATE user_joining_event 
            SET auto_rating_msg = false 
            WHERE users_id = $1 
            AND event_id =$2
        `,
            [user_id, event_id]
        );
        res.json('ok');
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});
