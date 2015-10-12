var express = require('express');
var router = express.Router();
var models = require('../../models');
var Hotel = models.Hotel;
var Restaurant = models.Restaurant;
var Activity = models.Activity;
var Day = models.Day;
var Promise = require('bluebird');

// list all days
router.get("/", function(req, res, next){
	Day.find().sort([['number', 'ascending']]).populate('hotels restaurants activities').exec().then(function(data){
		res.json(data);
	}).then(null, next);

})

// create a day
router.post("/", function(req, res, next){
	Day.find().exec().then(function(data){
		return data.length;
	}).then(function(length){
		return Day.create({
			number: length+1,
		})
	}).then(function(newDay){
		// console.log(newDay);
		res.json(newDay);
	})
	.then(null, next);
})


// get a specific day
router.get("/:id", function(req, res, next){
	Day.findById(req.params.id).exec().then(function(data){
		res.json(data);
	}).then(null, next);
})

// delete a day
router.delete("/:id", function(req, res, next){
	Day.findById(req.params.id).remove().exec()
	.then(function(maybeSomeData){
		res.json(maybeSomeData)
	})
	.then(null, next);
})

// add attraction to a day
router.post("/:id/add", function(req, res, next){
	var type = req.body.type;
	var attractionId = req.body.attractionId;
	var query = {}
	query[type] = attractionId
	if (req.body.type === 'hotels') {
		Day.findById(req.params.id).exec()
			.then(function(day) {
				day[type] = attractionId;
				return day.save();
			}).then(function(day) {
				return day.populate('hotels restaurants activities').execPopulate();
			})
			.then(function(day) {
				res.json(day);
			}).then(null, next);
	} else {
		Day.findById(req.params.id).exec()
		.then(function(day) {
			day[type].push(attractionId);
			return day.save();
		}).then(function(day) {
				return day.populate('hotels restaurants activities').execPopulate();
			}).then(function(day) {
				res.json(day);
			}).then(null, next);
	}

})

// remove attraction from a day
router.delete("/:id/remove", function(req,res,next){
	var type = req.body.type;
	var attractionId = req.body.attractionId;
	var query = {}
	query[type] = attractionId
	Day.update({_id: req.params.id}, { $pull: query}).exec().then(function(){
		return Day.findById(req.params.id).populate("hotels restaurants activities").exec()
	}).then(function(day){
		res.json(day);
	})
	.then(null, next);
})


module.exports = router;