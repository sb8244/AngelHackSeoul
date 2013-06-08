var crypto = require('crypto');
var mongo = require("./mongo");

exports.register = function(email, password, display_name, description, path, callback) {
	var md5pass = crypto.createHash('md5').update(password).digest("hex");
	var newVendor = {
		company_name: display_name,
		description: description,
		pictures: [path],
		current_location: {
			time: new Date(0),
			expires: new Date(0),
			point: {
				type: "Point",
				coordinates: [0, 0]
			}
		},
		past_locations: [],
		private: {
			email: email,
			password: md5pass
		}
	}
	mongo.getCollection("vendors", function(err, col) {
		if(err) return callback(err, null);
		col.insert(newVendor, function(err, result) {
			if(err) return callback(err, null);
			return callback(null, result);
		});
	});
}