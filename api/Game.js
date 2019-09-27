var mongoose = require('mongoose')

var game = new mongoose.Schema({
        player1: {
            username: {
                type: String
            },
            id: {
                type: String
            }
        },
        player2: {
            username: {
                type: String
            },
            id: {
                type: String
            }
        },
        round: {
            type: Number
        },
        userTurn: {
            type: String
        },
        melody: {
            type: Array
        },
        step: {
            type: String
        },
        winner: {
            type: String
        },
        mode: {
            type: String
        },
        date: {
            type: Date
        }
    },
    {
        collection: 'games'
    })

module.exports = mongoose.model('Game', game);