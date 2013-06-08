var mongo = require("./mongo");
var async = require("async");
exports.list = function(lat, lon, within, callback) {
	var params = 
	{
		"current_location.point":
		{ 
			$near :
			{ 
				$geometry :
				{ 
					type: "Point" ,
					coordinates: [parseFloat(lon), parseFloat(lat)]
				}
			},
			$maxDistance: parseInt(within)*1000
		}
		,
		"current_location.expires":
		{
			$gt: new Date()
		}
	};
	var limit_fields = {
		_id: 0,
		past_locations: 0,
		private: 0
	}
	mongo.getCollection("vendors", function(err, col) {
		if(err) return callback(err, null);
		col.find(params, limit_fields).toArray(function(err, result) {
			if(err) return callback(err, null);
			console.log(result.length);
			return callback(null, result);
		});
	});
}

var checkOut = function(id, callback) {
	mongo.getCollection("vendors", function(err, col) {
		if(err) return callback(err, null);
		mongo.getObjectID(id, function(object_id) {
			col.find({_id:object_id}).toArray(function(err, res) {
				var currentLocation = res[0]['current_location'];
				if(currentLocation.expires.getTime() == new Date(0).getTime()) {
					return callback(null, true);
				} 
				else
				{
					async.parallel([function(callback) {
						//push the current location to past_locations
						col.update({_id:object_id}, {$push: {past_locations: currentLocation}}, function(err, res) {
							if(err) return callback(err);
							return callback(null);
						});
					}, function(callback) {
						//set the current expiration to new Date(0)
						col.update({_id:object_id}, {$set: {"current_location.expires": new Date(0)}}, function(err, res) {
							if(err) return callback(err);
							return callback(null);
						});
					}], function(err) {
						if(err) return callback(err, null);
						else return callback(err, true);
					});
				}
			});
		});
	});
}
exports.checkOut = checkOut;

exports.checkIn = function(id, lat, lon, hours, callback) {
	checkOut(id, function(err, res) {
		if(err) return callback(err, null);
		mongo.getCollection("vendors", function(err, col) {
			if(err) return callback(err, null);
			mongo.getObjectID(id, function(object_id) {
				var expirationDate = new Date();
				expirationDate.setHours(expirationDate.getHours() + hours);
				var newLocation = {
					time: new Date(),
					expires: expirationDate,
					point: {
						type : "Point",
						coordinates : [parseFloat(lon), parseFloat(lat)]
					}
				}
				col.update({_id:object_id}, {$set: {current_location: newLocation}}, function(err, res) {
					if(err) return callback(err, null);
					else return callback(null, true);
				});
			});
		});
	});
}
