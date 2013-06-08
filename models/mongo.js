var Db = require("mongodb").Db;
var Connection = require("mongodb").Connection;
var Server = require("mongodb").Server;
var BSON = require("mongodb").BSON;
var ObjectID = require("mongodb").ObjectID;

var host = "localhost";
var port = 27017;

(function() {
	var dbToUse = "prod";
	if(global.testing === true)
		dbToUse = "dev";
	db = new Db(dbToUse, new Server(
		host, 
		port,
		{auto_reconnect: true},
		{}
	),
		{safe: true}
	);
	db.open(function(){});
})();

/*
 * Wrapper around new ObjectID to prevent extra imports and confusion
 */
exports.getObjectID = function(string, callback) {
	if(typeof string != 'string') {
		return callback(string);
	} else {
		var o = new ObjectID(string);
		return callback(o);
	}
}

/*
 * Get a collection from Mongo
 */
exports.getCollection = function(collection, callback) {
	db.collection(collection, function(error, the_collection) {
		if ( error ) return callback(error);
		else return callback(null, the_collection);
	});
}
