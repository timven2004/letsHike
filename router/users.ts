import express from "express"
import { client } from "../main"

export const users = express.Router()

users.post("/api/v1/usersRegister", async (req, res) => {
    try {
        let data = req.body
        console.log(data)
        await client.query(`
            INSERT INTO users ( user_name, email, password ) VALUES ($1,$2,$3)
        `, [data.name, data.email, data.password])
        res.json({ message: "success" })
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
})

users.post("/api/v1/userLogin", async (req, res) => {
    try {
        let userInputName = req.body.name
        let userInputPassword = req.body.password
        let usersData = await client.query(`
            SELECT * FROM users WHERE user_name = $1
        `, [userInputName])
        const user = usersData.rows[0];
        if(user && user.password === userInputPassword){
            req.session["user-id"] = user["id"]
            res.json({ message: "success" })
            console.log(req.session);
        }else {
            res.status(400).json({ message: "Invalid login, please try again" })
        }
    } catch (err) {
        console.error(err.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
})