var index = require('./controllers/index');
var pointsAPI = require('./controllers/api/points');

exports.create = function( app ) {
	app.get('/', index.index);

	app.get('/api/v1/points/list', pointsAPI.list);
	app.get('/api/v1/vendor/checkout', pointsAPI.checkOut);
	app.get('/api/v1/vendor/checkin', pointsAPI.checkIn);
}