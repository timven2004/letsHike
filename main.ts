import express from 'express'
import http from 'http'
import {Server as SocketIO} from 'socket.io'

const app = express()
const server = new http.Server(app)
const io = new SocketIO(server)

io.on('connection',(socket)=>{
    console.log("Connect")
})

app.use(express.static('public'))

const PORT = 8080

server.listen(PORT,()=>{
    console.log(`PORT: ${PORT} is Listening`)
})