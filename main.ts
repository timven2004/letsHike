import express, { Request, Response, NextFunction } from 'express'
import expressSession from 'express-session'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
import { Client } from 'pg'
import dotenv from 'dotenv'
import multer from "multer"
import { checkSession, checkEventOrganizer } from "./router/middleware"

dotenv.config()



// Please Set up .env !!
export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
})

client.connect()

// async function test(){
//     const res = await client.query(' select * from test')
//     console.log(res.rows)
// }

// test()

const app = express()
const server = new http.Server(app)
export const io = new SocketIO(server)

// Session Setup
app.use(expressSession({
    secret: 'This is session',
    resave: true,
    saveUninitialized: true
}))

app.use((req, res, next) => {
    console.log("session['user_id'] = ", req.session["user_id"])
    next()
})

// Socket.io Setup
io.on('connection', (socket) => {
    console.log("Connect")
    socket.on('newMessage', async (data: string) => {
        const newMessageID = parseInt(data)
        const newMessage = (await client.query(`
        SELECT date,users_id,user_name,content,chatroom.id as id FROM chatroom INNER JOIN users ON users_id = users.id WHERE chatroom.id = $1
        `, [newMessageID])).rows[0]
        io.emit("newMessage", newMessage)
    })
})

// Form body Setup
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Multer Setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${__dirname}/uploads`);
    },
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}.${file.mimetype.split("/")[1]}`);
    }
})
export const upload = multer({ storage })

import { users } from './router/users'
import { events } from './router/events'
import { ratingOthers } from './router/ratingOthers'
import { chatroom } from './router/chatroom'
import { hikeTrails } from './router/hikeTrails'


// create event rules : user level >= 3 
const checkUserLevel = async (req: Request, res: Response, next: NextFunction) => {
    console.log('hi')
    const user_id = req.session["user_id"]
    const data = await client.query(`
        SELECT * FROM users WHERE id = $1
    `, [user_id])

    const userLevel = data.rows[0].level
    if (userLevel >= 3) {
        next()
    } else {
        res.redirect("/events.html")
    }
}

app.use("/createEvent.html", checkSession, checkUserLevel)
app.use("/eventEdit.html", checkSession, checkEventOrganizer)

// Use Folder
app.use(express.static('public'))
app.use(express.static("uploads"))
app.use(express.static("hiking_trail_image"))

// Router
app.use(users)
app.use(ratingOthers)
app.use(events)
app.use(chatroom)
app.use(hikeTrails)

const PORT = 8080

server.listen(PORT, () => {
    console.log(`PORT: ${PORT} is Listening`)
})

export function checkUserIsLoginMiddleware(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.session["user_id"]) {
        next()
    }
    res.redirect("/login.html")
}