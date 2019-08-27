const express = require('express');
const app = express();
// const replace = require('replace-in-file');

let port = process.env.PORT || 5000;

// const options = {
//   files: [
//       './dist/js/*.js',
//       './dist/js/*.js.map',
//   ],
//   from: /5555/g,
//   to: port
// };

// replace(options)
// .then(r => {
//     console.log('replace ran: ', r)
// })

app.use(express.static(__dirname + '/dist'));
app.get('/', (req, res) => res.sendFile(__dirname + '/dist/index.html'))

const server = app.listen(port, function() {
    console.log('server running on port ' + port);
});

const io = require('socket.io')(server);

let users = [];

io.on('connection', function(socket) {
    console.log(socket.id)

    socket.on('newUser', function(user) {
        users.push(user);
        io.emit('updateUsers', users)
    })

    socket.on('startGame', function(game) {
        io.emit('newGame', game);
    })

    socket.on('addMsg', function(msg) {
        io.emit('newMsg', msg);
    })
    
});
