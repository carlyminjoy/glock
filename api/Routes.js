'use strict'

var express = require('express')
var gameRoutes = express.Router()
var game = require('./Game')

gameRoutes.route('/all').get(function (req, res, next) {
  game.find(function (err, games) {
    if (err) {
      return next(new Error(err))
    }
    res.json(games) 
  })
})

gameRoutes.route('/add').post(function (req, res) {
  game.create(
    {
      round: req.body.round,
      winner: req.body.winner,
      loser: req.body.loser,
      mode: req.body.mode
    },
    function (error, game) {
      if (error) {
        res.status(400).send('Unable to store game')
      }
      res.status(200).json(game)
    }
  )
})

module.exports = gameRoutes