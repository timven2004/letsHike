import express from 'express'
import expressSession from 'express-session'
import http from 'http'
import { Server as SocketIO } from 'socket.io'
import { Client } from 'pg'
import dotenv from 'dotenv'
import { users } from './router/users'
import { events } from './router/events'

dotenv.config()

// Please Set up .env !!
export const client = new Client({
    database: process.env.DB_NAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    host: "localhost"
})

client.connect()

// async function test(){
//     const res = await client.query(' select * from test')
//     console.log(res.rows)
// }

// test()

const app = express()
const server = new http.Server(app)
const io = new SocketIO(server)

io.on('connection', (socket) => {
    console.log("Connect")
})

app.use(expressSession({
    secret: 'This is session',
    resave: true,
    saveUninitialized: true
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(express.static('public'))

app.use(users)
app.use('/events', events)

const PORT = 8080

server.listen(PORT, () => {
    console.log(`PORT: ${PORT} is Listening`)
})