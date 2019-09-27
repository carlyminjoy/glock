'use strict'

var express = require('express')
var endpoints = express.Router()
var game = require('./Game')

endpoints.route('/all').get(function (req, res, next) {
  game.find(function (err, games) {
    if (err) {
      return next(new Error(err))
    }
    res.json(games) 
  })
})

endpoints.route('/new').post(function (req, res) {
    game.create({
        player1: req.body.player1,
        player2: req.body.player2,
        round: 1,
        userTurn: req.body.player1.username,
        winner: null,
        melody: [],
        step: "add",
        mode: req.body.mode,
        date: new Date()
    },
      function (error, game) {
        if (error) {
          res.status(400).send('Unable to add game: ' + error)
        }
        res.status(200).json(game)
      }
    )
})

endpoints.route('/update').post(function (req, res) {
    game.findOne(
        { "_id" : req.body._id }
    , async function(error, game) {
        if (error) {
            res.status(400).send('Unable to update game: ' + error);
        }

        game.round = req.body.round;
        game.userTurn = req.body.userTurn;
        game.winner = req.body.winner;
        game.melody = req.body.melody;
        game.step = req.body.step;

        await game.save();
        res.status(200).json(game);
    });
})

endpoints.route('/game/:id').get(function (req, res) {
    game.findOne(
        { 
            "_id" : req.params.id 
        },
        function(error, game) {
            if (error) {
                res.status(400).send('Unable to update game: ' + error);
            }
            res.status(200).json(game);
        }
    );
    
})

module.exports = endpoints