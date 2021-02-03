import { client } from '../main';
import { User } from '../class/database';
import { upload } from '../main';
import express from 'express';
import { checkEventIsActive } from './events';
import { checkSession } from './middleware';
import { hashPassword, checkPassword } from '../hash';

// {name: "Jason"}
// name, password
function validateDataV1<T extends {}>(
    data: T,
    requiredKeys: Array<string>
): boolean {
    for (const requiredKey of requiredKeys) {
        if (!(requiredKey in data)) {
            return false;
        }
        // else {
        //     console.log(
        //         `[info] value: [${data[requiredKey]}], type: [${typeof data[
        //             requiredKey
        //         ]}]`
        //     );
        // }
    }
    return true;
}

export const users = express.Router();

users.post(
    '/api/v1/usersRegister',
    upload.single('image'),
    async (req, res) => {
        try {
            {
                const isValid = validateDataV1(req.body, [
                    'name',
                    'email',
                    'password',
                    'gender',
                    'intro',
                ]);
                if (!isValid) {
                    res.status(400).json({ message: 'invalid input' });
                    return;
                }
            }
            // console.log(isValid); // --> undefined
            let { name, email, password, gender, intro } = req.body;
            const imageName = req.file?.filename;
            const userResult = await client.query<User>(
                /*SQL*/ `
                    SELECT * FROM users WHERE user_name = $1
                `,
                [name]
            );
            if (userResult.rows.length !== 0) {
                res.status(400).json({ message: 'username has been used' });
                return;
            }
            const hashedPassword = await hashPassword(password);
            const data = await client.query(
                /*SQL*/ `
                    INSERT INTO users ( user_name , email, password, gender, introduction , user_icon ) 
                    VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
                `,
                [name, email, hashedPassword, gender, intro, imageName]
            );
            console.log(data.rows[0].id);
            req.session['user_id'] = data.rows[0].id;
            res.json({ message: 'success' });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
);

users.post('/api/v1/userLogin', async (req, res) => {
    try {
        const userInputName = req.body.name;
        const userInputPassword = req.body.password;
        const usersData = await client.query<User>(
            /*SQL*/ `
                SELECT * FROM users WHERE user_name = $1
            `,
            [userInputName]
        );
        const user = usersData.rows[0];
        if (user && (await checkPassword(userInputPassword, user.password))) {
            req.session['user_id'] = user['id'];
            checkEventIsActive();
            res.json({ message: 'success' });
        } else {
            res.status(400).json({
                message: 'Invalid login, please try again',
            });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

users.get('/userProfile/:id', async (req, res) => {
    try {
        let data = await client.query<User>(
            /*SQL*/ `SELECT * FROM users 
            WHERE users.id = $1;`,
            [req.params.id]
        );

        let comments = await client.query(
            /*SQL*/ `
            SELECT * FROM rating_event
            INNER JOIN users ON rating_event.users_id = users.id
            WHERE rating_person_id = $1;`,
            [req.params.id]
        );

        const { password, ...others } = data.rows[0];
        const user = { ...others };
        user['comments'] = comments.rows;
        // console.log(data.rows[0].comments);
        // for (let comment of user['comments']) {
        //     sumRating += comment['single_rating'];
        // }
        let sumRating = (user['comments'] as Array<Object>).reduce(
            (sum, comment) => sum + comment['single_rating'],
            0
        );
        let avgRating =
            Math.round((sumRating * 10) / user['comments'].length) / 10;
        // console.log(avgRating);
        await client.query(
            `
                UPDATE users
                SET rating = $1
                WHERE users.id = $2;
            `,
            [avgRating, req.params.id]
        );
        user['rating'] = avgRating;
        if (!user.user_icon) {
            user.user_icon = `blank-profile-picture-973460_640.png`;
        }
        res.render('./userProfile.ejs', {
            transferred: user,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

users.get('/api/v1/userProfile/self', checkSession, async (req, res) => {
    try {
        let data = await client.query<User>(
            /*SQL*/ `SELECT * FROM users WHERE users.id = $1;`,
            [req.session['user_id']]
        );

        // let comments = await client.query(`
        // SELECT *
        // FROM
        // JOIN rating_event
        // ON users.id = rating_event.users_id
        // JOIN event
        // ON rating_event.event_id = event.id
        // `)

        let comments = await client.query(
            /*SQL*/ `
            SELECT * FROM rating_event
            INNER JOIN users ON rating_event.users_id = users.id
            WHERE rating_person_id = $1;`,
            [req.session['user_id']]
        );

        data.rows[0]['comments'] = comments.rows;
        let sumRating = 0;
        // console.log(data.rows[0].comments)
        // @ts-ignore
        for (let comment of data.rows[0].comments) {
            sumRating += comment['single_rating'];
        }
        let avgRating =
            Math.round((sumRating * 10) / data.rows[0]['comments'].length) / 10;
        // console.log(avgRating);
        await client.query(
            `
            UPDATE users
            SET rating=$1
            WHERE users.id = $2
        `,
            [avgRating, req.session['user_id']]
        );

        // console.log(update);
        data.rows[0]['rating'] = avgRating;
        if (!data.rows[0].user_icon) {
            data.rows[0].user_icon = `blank-profile-picture-973460_640.png`;
        }
        // console.log(data.rows[0].user_icon)

        res.json(data.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// dun put ACTION in path pattern
users.get('/api/v1/getUserData', checkSession, async (req, res) => {
    try {
        const userID = req.session['user_id'];
        const userData = await client.query<User>(
            /*SQL*/ `
                SELECT * FROM users WHERE id = $1
            `,
            [userID]
        );
        const { password, ...others } = userData.rows[0];
        res.json({ ...others });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

users.put('/api/v1/editUserData', upload.single('image'), async (req, res) => {
    try {
        const updateUserData = req.body;
        const imagePath = req.file.path;
        const user_id = req.session['user_id'];
        const updateName = updateUserData.name;
        const updateEmail = updateUserData.email;
        const updatePassword = updateUserData.password;
        const updateGender = updateUserData.gender;
        const updateIntro = updateUserData.intro;
        await client.query(
            /*SQL*/ `
                UPDATE users SET ( user_name, email , password , gender , introduction, user_icon ) 
                = ($1, $2, $3, $4, $5, $6) WHERE id = $7
            `,
            [
                updateName,
                updateEmail,
                updatePassword,
                updateGender,
                updateIntro,
                imagePath,
                user_id,
            ]
        );
        res.json({ message: 'success' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

users.get('/api/v1/userLoggedIn', async (req, res) => {
    try {
        const user_id = req.session['user_id'];
        if (user_id) {
            res.json(user_id);
            console.log('hih' + user_id);
        } else {
            res.json('noLogin');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

users.get('/api/v1/logout', async (req, res) => {
    try {
        const id = req.session['user_id'];
        if (id !== undefined) {
            req.session.destroy((err) => {
                if (err) {
                    res.status(400).send('Unable to log out');
                }
            });
            res.json('success');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

users.get('/users/checkUserIsOrganizer/:id', async (req, res) => {
    const eventID = parseInt(req.params.id);
    const data = await client.query(
        /*SQL */ `
            SELECT * FROM event where organizer = $1 AND id = $2
        `,
        [req.session['user_id'], eventID]
    );
    if (!data.rows[0]) {
        res.json(false);
        return;
    }
    res.json(true);
});

// // //updateLevel   //POST?
// users.get('/users/updateLevel', async (req, res) => {
//     if (req.session['user_id']) {
//         const id = req.session['user_id'];
//         const getExp = await client.query(
//             `
//             SELECT experience FROM users WHERE id = $1
//             `,
//             [id]
//         );
//         const exp = getExp.rows[0].experience;

//         if (exp % 10 === 0) {
//             const x = exp / 10;
//             const getLevel = await client.query(
//                 `
//             SELECT level FROM users WHERE id = $1
//             `,
//                 [id]
//             );
//             const level = getLevel.rows[0].level;

//             let curlevel = level + x;

//             await client.query(
//                 `
//                 UPDATE users SET LEVEL = $1 WHERE id = $2
//                 `,
//                 [curlevel, id]
//             );
//         }
//     }
// });
