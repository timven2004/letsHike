import express from 'express';
import { client } from '../main';
import { Event } from '../class/database';
import moment from 'moment';
import { checkSession } from './middleware';

export const events = express.Router();

// id: number;
// event_name: string;
// organizer: number;
// meeting_point: string;
// date: Date;
// time: string;
// max_number_of_member: number;
// joining_number_of_member: number;
// hiking_trail_id: number;
// detail: Text;
// is_active: boolean;

//events
events.get('/events', async (req, res) => {
    try {
        const data = await client.query<any>(/*SQL*/ `
            SELECT event.id, image, event_name ,is_active, hardness FROM event
            INNER JOIN hiking_trail ON event.hiking_trail_id = hiking_trail.id
            INNER JOIN image_hiking_trail ON image_hiking_trail.hiking_trail_id = hiking_trail.id
            WHERE is_active = true ORDER BY id DESC;
        `);
        const mapping = {}; // object OR new Set
        for (const row of data.rows) {
            const eventID = row.id;
            const { image, ...others } = row;
            if (!(eventID in mapping)) {
                mapping[eventID] = { ...others, images: [] };
            }
            mapping[eventID].images.push({ image });
        }
        res.json(Object.values(mapping));
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server Error' });
    }
});

//event details
events.get('/events/eventDetails/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await client.query(
            /*SQL*/ `
            SELECT event.*, users.user_name, image_hiking_trail.image,
                hiking_trail.name, hiking_trail.introduction,
                hiking_trail.hardness, image_hiking_trail.is_default
            FROM event INNER JOIN users ON organizer = users.id
            INNER JOIN hiking_trail ON event.hiking_trail_id = hiking_trail.id
            INNER JOIN image_hiking_trail ON image_hiking_trail.hiking_trail_id = hiking_trail.id
            WHERE event.id = $1
            `,
            [id]
        );
        let result = undefined;
        for (const row of data.rows) {
            if (!result) {
                const { is_default, image, ...others } = row;
                result = { ...others, images: [] };
            }
            result.images.push({
                image: row.image,
                is_default: row.is_default,
            });
        }
        moment(result.date).format('YYYY-MM-DD');
        result.date = moment(result.date).format('YYYY-MM-DD');
        res.json(result);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server Error' });
    }
});

// get name from user_joining_event
events.get('/events/userJoiningEvent/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = await client.query(
            `
        SELECT users.user_name FROM event INNER JOIN user_joining_event ON event.id = user_joining_event.event_id 
        INNER JOIN users ON user_joining_event.users_id = users.id WHERE event.id = $1
        `,
            [id]
        );
        const userJoiningEventData = data.rows;
        res.json(userJoiningEventData);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server Error' });
    }
});

events.post('/events/createEvent', async (req, res) => {
    try {
        const {
            event_name,
            meeting_point,
            date,
            time,
            max_number_of_member,
            hiking_trail_id,
            detail,
        } = req.body;

        // demo
        // for (const key in req.body) {
        //     console.log(
        //         `[info] value: [${req.body[key]}], type: [${typeof req.body[
        //             key
        //         ]}]`
        //     );
        // }

        const organizerID = req.session['user_id'];
        console.log(req.body);
        let id = await client.query<Event>(
            `
        INSERT INTO event ( event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail, organizer) 
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) returning id
        `,
            [
                event_name,
                meeting_point,
                date,
                time,
                max_number_of_member,
                hiking_trail_id,
                detail,
                organizerID,
            ]
        );
        res.json(id.rows[0].id);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server Error' });
    }
});

events.put('/events/updateEventDetail/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const {
            event_name,
            meeting_point,
            date,
            time,
            max_number_of_member,
            hiking_trail_id,
            detail,
        } = req.body;
        await client.query<Event>(
            `
            UPDATE event SET (event_name, meeting_point, date, time, max_number_of_member, hiking_trail_id, detail) = ($1,$2,$3,$4,$5,$6,$7) WHERE id = $8
            `,
            [
                event_name,
                meeting_point,
                date,
                time,
                max_number_of_member,
                hiking_trail_id,
                detail,
                id,
            ]
        );
        res.json('success');
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server Error' });
    }
});

events.delete('/events/deleteEvent/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid event ID' });
            return;
        }
        const data = await client.query(`SELECT * FROM event WHERE id = $1`, [
            id,
        ]);
        const eventData = data.rows[0];

        const active = eventData.id === id && eventData.is_active === true;
        if (!active) {
            res.status(400).json({ message: 'event not found' });
            return;
        }
        const update = await client.query<Event>(
            `UPDATE event SET is_active = false WHERE id = $1 `,
            [id]
        );
        console.log(update);
        res.json('success');
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server Error' });
    }
});

events.get('/userJoinEvent/:id', async (req, res) => {
    try {
        const user_id = req.session['user_id'];
        const event_id = req.params.id;

        // Check login
        if (!user_id) {
            res.status(400).json({ message: 'login' });
            return;
        }

        // Check User is (or not) join this event
        const num = await client.query(
            `
            SELECT COUNT(*) FROM user_joining_event WHERE users_id = $1 AND event_id = $2
        `,
            [user_id, event_id]
        );
        console.log(num.rows[0].count);
        if (num.rows[0].count == 1) {
            res.status(401).json('You have been join');
            return;
        }
        // Check joining event fill
        const eventData = await client.query(
            `
            SELECT * FROM event WHERE id = $1
        `,
            [event_id]
        );
        const joiningNumber = eventData.rows[0].joining_number_of_member;
        const maxNumber = eventData.rows[0].max_number_of_member;
        if (joiningNumber === maxNumber) {
            res.status(401).json('Event joining fill');
            return;
        }
        // User join event
        await client.query(
            `
            INSERT INTO user_joining_event (users_id,event_id) VALUES ($1,$2)
        `,
            [user_id, event_id]
        );
        // Increase event joining number
        await client.query(
            `
        UPDATE event SET joining_number_of_member = joining_number_of_member +1 WHERE id = $1
        `,
            [event_id]
        );
        res.json('success');
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Internal server error');
    }
});

events.get('/goCreateEventPage', checkSession, (req, res) => {
    res.redirect('/createEvent.html');
});

events.get('/checkEventOrganizer/:id', async (req, res) => {
    try {
        const event_id = req.params.id;
        const user_id = req.session['user_id'];
        const data = await client.query(
            `
            SELECT COUNT(*) FROM event WHERE organizer = $1 AND id = $2
        `,
            [user_id, event_id]
        );
        const count = parseInt(data.rows[0].count);
        if (count !== 0) {
            res.json(true);
        } else {
            res.json(false);
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

events.get('/checkUserHaveBeenJoin/:id', async (req, res) => {
    try {
        const event_id = parseInt(req.params.id);
        const user_id = parseInt(req.session['user_id']);
        if (!user_id) {
            res.json("don't login");
            return;
        }
        const data = await client.query(
            `
            Select COUNT(*) FROM user_joining_event WHERE users_id = $1 AND event_id = $2
        `,
            [user_id, event_id]
        );
        const userJoin = data.rows[0].count !== '0';
        if (userJoin) {
            res.json(true);
        } else res.json(false);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

events.delete('/userLeaveEvent/:id', async (req, res) => {
    try {
        const event_id = parseInt(req.params.id);
        const user_id = parseInt(req.session['user_id']);
        await client.query(
            `
            DELETE FROM user_joining_event WHERE users_id = $1 AND event_id = $2
        `,
            [user_id, event_id]
        );
        await client.query(`
            UPDATE event SET joining_number_of_member = joining_number_of_member - 1
        `);
        res.json('user leave');
    } catch (err) {
        console.error(err.message);
        res.status(500).json('Internal server error');
    }
});

events.get('/getJoiningNumber/:id', async (req, res) => {
    const event_id = req.params.id;
    const joiningNumber = (
        await client.query(
            `
        SELECT joining_number_of_member FROM event WHERE id = $1
    `,
            [event_id]
        )
    ).rows[0].joining_number_of_member;
    res.json(joiningNumber);
});

// Check event  is active
export async function checkEventIsActive() {
    var now = new Date();
    var date = moment(now).format('YYYY-MM-DD');
    console.log(date);
    const data = await client.query(
        `
        SELECT id FROM event WHERE date < $1
    `,
        [date]
    );
    for (const row of data.rows) {
        await client.query(
            `
            UPDATE event SET is_active = false WHERE id = $1
        `,
            [row.id]
        );
    }
    console.log(data.rows);
}
