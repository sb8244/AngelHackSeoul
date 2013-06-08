/*
 * Options:
 *	lon: Longitude
 *	lat: Latitude
 *	within: X KM
 */
var points = require("../../models/points");
exports.list = function(req, res) {
	var lat = req.param("lat");
	var lon = req.param("lon");
	var dis = req.param("within");

	points.list(lat, lon, dis, function(err, result) {
		if(err) throw err;
		res.send(result, 200);
	});
}

/*
 * Checkout API takes an ID and sets the current locate expiration to new Date(0) and adds
 * the current location to the past locations
 */
exports.checkOut = function(req, res) {
	var id = req.param("id");
	points.checkOut(id, function(err, result) {
		if(err) throw err;
		res.send(result, 200);
	});
}

exports.checkIn = function(req, res) {
	var id = req.param("id");
	var lat = req.param("lat");
	var lon = req.param("lon");
	var hours = req.param("hours");
	points.checkIn(id, lat, lon, hours, function(err, result) {
		if(err) throw err;
		res.send(result, 200);
	});
}