var express = require('express');
var router = express.Router();
var models = require('../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Promise = require('bluebird');
var apiPath = require('./api/days.js');

router.get('/', function(req, res) {
  Promise.all([
    Hotel.find(),
    Restaurant.find(),
    Activity.find()
    ]).spread(function(hotels, restaurants, activities) {
      res.render('index', {
        all_hotels: hotels,
        all_restaurants: restaurants,
        all_activities: activities
      });
    })
})

router.use("/api/days",apiPath);

module.exports = router;
