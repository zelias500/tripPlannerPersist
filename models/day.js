var mongoose = require('mongoose');
var PlaceSchema = require('./place');

var HotelSchema = require("./hotel");
var RestaurantSchema = require("./restaurant");
var ActivitySchema = require("./activity");

var DaySchema = new mongoose.Schema({
	number: Number,
	hotels: [{type: mongoose.Schema.Types.ObjectId, ref: "Hotel"}],
	restaurants: [{type: mongoose.Schema.Types.ObjectId, ref: "Restaurant"}],
	activities: [{type: mongoose.Schema.Types.ObjectId, ref: "Activity"}]
})


module.exports = mongoose.model('Day', DaySchema);