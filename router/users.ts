import { client } from "../main"
import { User } from "../class/database"
import { upload } from "../main"
import express, { Request, Response, NextFunction } from "express"


export const users = express.Router()

const checkSession = (req: Request, res: Response, next: NextFunction) => {
    if (req.session["user_id"]) {
        next()
    } else res.redirect("/login.html")
}

users.post("/api/v1/usersRegister", upload.single("image"), async (req, res) => {
    try {
        let { name, email, password, gender, intro } = req.body
        const imageName = req.file.filename
        const usersName = await client.query(`
            SELECT * FROM users WHERE user_name = $1
        `, [name])
        if (usersName.rows.length !== 0) {
            res.status(400).json({ message: "username has been used" })
            return
        }
        const data = await client.query(`
        INSERT INTO users ( user_name , email, password, gender, introduction , user_icon ) VALUES ($1,$2,$3,$4,$5,$6) RETURNING id
        `, [name, email, password, gender, intro, imageName])
        console.log(data.rows[0].id)
        req.session["user_id"] = data.rows[0].id
        res.json({ message: "success" })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
})

users.post("/api/v1/userLogin", async (req, res) => {
    try {
        const userInputName = req.body.name
        const userInputPassword = req.body.password
        const usersData = await client.query<User>(`
            SELECT * FROM users WHERE user_name = $1
        `, [userInputName])
        const user = usersData.rows[0];
        if (user && user.password === userInputPassword) {
            req.session["user_id"] = user["id"]
            res.json({ message: "success" })
        } else {
            res.status(400).json({ message: "Invalid login, please try again" })
        }
    } catch (err) {
        res.status(500).json({ message: "Internal Server Error" })
    }
})

users.get("/userProfile/:id", async (req, res) => {
    try {
        let data = await client.query<User>(
            `SELECT * 
            FROM users 
            WHERE users.id=$1
            ;`, [req.params.id]);

        let comments = await client.query(`
            SELECT *
            FROM rating_event
            JOIN users
            ON rating_event.users_id = users.id
            WHERE rating_person_id = $1
            ;`, [req.params.id])

            let sumRating = 0;
            data.rows[0]["comments"] = comments.rows
            console.log(data.rows[0].comments)
            for (let comment of data.rows[0].comments){
                sumRating += comment['single_rating'];
            }
            let avgRating = Math.round(sumRating*10/(data.rows[0]["comments"].length))/10;
            console.log(avgRating);
            let update = await client.query(`
                UPDATE users
                SET rating=$1
                WHERE users.id = $2
            `, [avgRating,req.session["user_id"]])
            console.log(update)
            data.rows[0]["rating"] = avgRating;
            if (!data.rows[0].user_icon){
                data.rows[0].user_icon=`blank-profile-picture-973460_640.png`
            }
        res.render("./userProfile.ejs", { transferred: data.rows[0] });
        console.log(data.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }


})


users.get("/api/v1/userProfile/self",checkSession, async (req, res) => {

    try {
        let data = await client.query<User>(
            `SELECT * 
            FROM users 
            WHERE users.id=$1
            ;`, [req.session["user_id"]]);

        // let comments = await client.query(`
        // SELECT *
        // FROM            
        // JOIN rating_event 
        // ON users.id = rating_event.users_id 
        // JOIN event 
        // ON rating_event.event_id = event.id

        // `)
        let comments = await client.query(`
            SELECT *
            FROM rating_event
            JOIN users
            ON rating_event.users_id = users.id
            WHERE rating_person_id = $1
            ;`, [req.session["user_id"]])


        data.rows[0]["comments"] = comments.rows;
        let sumRating = 0;
        console.log(data.rows[0].comments)
        for (let comment of data.rows[0].comments){
            sumRating += comment['single_rating'];
        }
        let avgRating = Math.round(sumRating*10/(data.rows[0]["comments"].length))/10;
        console.log(avgRating);
        let update = await client.query(`
            UPDATE users
            SET rating=$1
            WHERE users.id = $2
        `, [avgRating,req.session["user_id"]])

            console.log(update);
        data.rows[0]["rating"] = avgRating;
        if (!data.rows[0].user_icon){
            data.rows[0].user_icon=`blank-profile-picture-973460_640.png`
        }
        console.log(data.rows[0].user_icon)

        res.json(data.rows[0]);

    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})

users.get("/api/v1/getUserData", async (req, res) => {
    try {
        const user_id = req.session["user_id"]
        const userData = await client.query<User>(`
            SELECT * FROM users WHERE id = $1
        `, [user_id])
        res.json(userData.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})

users.put("/api/v1/editUserData", upload.single('image'), async (req, res) => {
    try {
        const updateUserData = req.body
        const imagePath = req.file.path
        console.log("imagePath", imagePath)
        const user_id = req.session["user_id"]
        const updateName = updateUserData.name
        const updateEmail = updateUserData.email
        const updatePassword = updateUserData.password
        const updateGender = updateUserData.gender
        const updateIntro = updateUserData.intro
        await client.query(`
            UPDATE users SET ( user_name, email , password , gender , introduction, user_icon ) = ($1,$2,$3,$4,$5,$6) WHERE id = $7
        `, [updateName, updateEmail, updatePassword, updateGender, updateIntro, imagePath, user_id])
        res.json("success")
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }
})

// check session["user_id"]
// users.get("/api/v1/userLoggedIn", async (req, res) => {
//     try {
//         const user_id = req.session["user_id"]
//         if (!user_id) {
//             res.json('notLoggedIn')
//         } else {
//             res.json(user_id)
//         }
//     } catch (err) {
//         console.error(err.message)
//         res.status(500).json({ message: "Internal server error" })
//     }
// })

users.get("/api/v1/logout", async (req, res) => {

    const id = req.session["user_id"]
    if (id !== undefined) {
        req.session.destroy((err => {
            if (err) {
                res.status(400).send('Unable to log out')
            } else {
                res.send('Logout successful')
            }
        }))
        console.log('logout')
    }
})


