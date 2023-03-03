const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const roomHandler = require('./src/roomHandler')

const PORT = 8000

const app = express()
app.use(cors)
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})


io.on("connection", (socket) => {
    console.log('User connected')
    roomHandler(socket)
    socket.on('disconnect', () => {
        console.log('Disconnected')
    })
})

server.listen(PORT, () => {
    console.log('Server is up on port: ', PORT)
})