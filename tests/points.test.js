var mongo = require("../models/mongo");

exports.list = function(test) {
	mongo.getCollection("vendors", function(err, col) {
		if(err) return callback(err, null);
		col.find({name:"string"}).toArray(function(e, r) {
			console.log(r);
		});
	});
}
