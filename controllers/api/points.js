/*
 * Options:
 *	lon: Longitude
 *	lat: Latitude
 *	within: X KM
 */
var points = require("../../models/points");
exports.list = function(req, res) {
	var lat = req.query.lat;
	var lon = req.query.lon;
	var dis = req.query.within;
	var types = req.query.types;
	if(types == null || types.length == 0) {
		res.send([], 200);
	}
	else {
		points.list(lat, lon, dis, types, function(err, result) {
			if(err) throw err;
			res.send(result, 200);
		});
	}
}

/*
 * Checkout API takes an ID and sets the current locate expiration to new Date(0) and adds
 * the current location to the past locations
 */
exports.checkOut = function(req, res) {
	var id = req.param("id");
	if(id == undefined) {
		id = req.session.user_id;
	}
	if(id == undefined) {
		throw new Exception("No access");
	}
	points.checkOut(id, function(err, result) {
		if(err) throw err;
		res.send(result, 200);
	});
}

exports.checkIn = function(req, res) {
	var id = req.param("id");
	if(id == undefined) {
		id = req.session.user_id;
	}
	if(id == undefined) {
		throw new Exception("No access");
	}
	var lat = req.param("lat");
	var lon = req.param("lon");
	var type = req.param("type");
	var desc = req.param("desc");
	var hours = req.param("hours");
	points.checkIn(id, lat, lon, hours, type, desc, function(err, result) {
		if(err) throw err;
		res.send(result, 200);
	});
}