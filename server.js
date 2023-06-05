const express = require('express')
const app = express()
app.use(express.static('public'))

const http = require('http').Server(app)
const io = require('socket.io')(http)
const port = 8000

http.listen(port, function()
{
    console.log('Servidor Iniciado http://localhost:' + port)
})

app.get('/', function(req, resp){
    resp.sendFile(__dirname + '/index.html')
})

app.get('/chat', function(req, resp){
    resp.sendFile(__dirname + '/chat.html')
})


io.on('connection' , (socket) => {
    console.log('user connected, ID: ' + socket.id)

    socket.on('join', ({room, nickname}) => {
        socket.nickname = nickname
        socket.join(room)
        io.to(room).emit('message', {nickname: nickname, message: `join the channel`})
        console.log('user ID: ' + socket.nickname + ' join room: ' + room)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected')
    })

    socket.on('message', ({room, message}) => {
        console.log("room: " + room + " nickname: " + socket.nickname + ' : message '  + message)
        var data = {
            'nickname' : socket.nickname,
            'message' : message
        }
        io.to(room).emit('message', data)
    })

    socket.on('set_nickname', (nickname) => {
        socket.nickname = nickname
    })
})    

