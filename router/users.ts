import express from "express"
import { client } from "../main"
import { User } from "../class/database"
import { upload } from "../main"

export const users = express.Router()

users.post("/api/v1/usersRegister",upload.single("image"), async (req, res) => {
    try {
        const data = req.body
        const imagePath = req.file.filename
        await client.query(`
        INSERT INTO users ( user_name , email, password, gender, introduction , user_icon ) VALUES ($1,$2,$3,$4,$5,$6)
        `, [data.name, data.email, data.password, data.gender, data.intro, imagePath])
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

users.get("/userProfile/:id", async (req,res)=>{
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

        data.rows[0]["comments"] = comments.rows
        res.render("./userProfile.ejs", {transferred: data.rows[0]});
            console.log(data.rows[0])
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal server error" })
    }


})


users.get("/api/v1/userProfile/self", async (req, res) => {

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

        console.log(data.rows[0]);
        console.log(comments.rows);
        data.rows[0]["comments"] = comments.rows
        console.log(req.session["user_id"])
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

users.put("/api/v1/editUserData",upload.single('image'), async (req, res) => {
    try {
        const updateUserData = req.body
        const imagePath = req.file.path
        console.log("imagePath",imagePath)
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