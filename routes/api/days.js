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
	
	Day.find().exec().then(function(data){
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
	// console.log(type, attractionId);
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
			console.log("step 1", day)
			day[type].push(attractionId);
			return day.save();
		}).then(function(day) {
				console.log("step 2", day)
				return day.populate('hotels restaurants activities').execPopulate();
			}).then(function(day) {
				console.log("step 3", day)
				res.json(day);
			}).then(null, next);
	}

})


// router.post("/:id/add", function(req, res, next){
// 	var type = req.body.type;
// 	var attractionId = req.body.attractionId;
// 	// console.log(type, attractionId);
// 	var query = {}
// 	query[type] = attractionId
// 	if (req.body.type === 'hotels') {
// 		Day.findByIdAndUpdate(req.params.id, query, {new:true}).populate("hotels restaurants activities").exec()
// 			// .then(function(day) {
// 			// 	return day.populate("hotels restaurants activities").execPopulate();
// 			// })
// 			.then(function(day) {
// 				res.json(day);
// 			}).then(null, next);
// 	} else {
// 		Day.findByIdAndUpdate(req.params.id, {$push: query}, {new:true}).populate("hotels restaurants activities").exec()
// 			// .then(function(day) {
// 			// 	console.log(day)
// 			// 	return day.populate("hotels restaurants activities").execPopulate();
// 			// })
// 			.then(function(day) {
// 				console.log(day)
// 				res.json(day);
// 			}).then(null, next);
// 	}

// })

// remove attraction from a day
router.post("/:id/remove", function(req,res,next){



})


module.exports = router;