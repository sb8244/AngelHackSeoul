var mongo = require("./mongo");

exports.login = function(email, password, req, callback) {
	mongo.getCollection("vendors", function(err, col) {
		var crypto = require('crypto');
		var cryptPass = crypto.createHash('md5').update(password).digest("hex");

		//find user by email and MD5 password
		//If the user is found, return the user id, false otherwise
		col.find({"private.email": email, "private.password": cryptPass}).toArray(function(error, res) {
			if(error) return callback(error);
			else if(res[0] == undefined) return callback(null, false);
			
			req.session.user_id = res[0]._id;
			return callback(null, true);
		});
	});
}

exports.isLoggedIn = function(req, callback) {
	return callback(req.session.user_id != undefined);
}

exports.logout = function(req, callback) {
	req.session.user_id = undefined;
	return callback();
}