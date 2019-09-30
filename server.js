const bodyParser = require("body-parser");
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path')
const port = process.env.PORT || 5000;
const uri = "mongodb+srv://carly:charles2013@cluster0-cq98e.gcp.mongodb.net/glock?retryWrites=true&w=majority";
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/dist')))

const server = app.listen(port, () => {
    console.log('server running on port ' + port);
});

var endpoints = require('./api/endpoints')

app.use('/api', endpoints)
app.get('/', (req, res) => res.sendFile(__dirname + '/dist/index.html'))

// Web sockets
const io = require('socket.io')(server);

let users = [];

io.on('connection', function(socket) {

    socket.on('disconnect', function() {
        users = users.filter(u => u.id != socket.id)

        io.emit('updateUsers', users)
    })

    socket.on('getUsers', function() {
        io.emit('onlineUsers', users)
    })

    socket.on('newUser', function(user) {
        users.push(user)
        io.emit('updateUsers', users)
    })

    socket.on('startGame', function(game) {
        io.emit('newGame', game);
    })

    socket.on('move', function(game) {
        io.emit('newMove', game)
    })

    socket.on('addMsg', function(msg) {
        io.emit('newMsg', msg);
    })
    
});
