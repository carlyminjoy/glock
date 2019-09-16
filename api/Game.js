var mongoose = require('mongoose')

var game = new mongoose.Schema({
        round: {
            type: Number
        },
        winner: {
            type: String
        },
        loser: {
            type: String
        },
        mode: {
            type: String
        }
    },
    {
        collection: 'games'
    })

module.exports = mongoose.model('Game', game);