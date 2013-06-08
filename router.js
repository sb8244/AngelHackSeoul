var index = require('./controllers/index');
var register = require('./controllers/register');
var login = require('./controllers/login');
var pointsAPI = require('./controllers/api/points');

exports.create = function( app ) {
	app.get('/', index.index);

	app.get('/register', register.index);
	app.post('/register', register.process);

	app.get('/login', login.index);
	app.post('/login', login.process);
	app.get('/logout', login.logout);
	
	//app.get('/logout', show.list);
	
	app.get('/api/v1/points/list', pointsAPI.list);
	app.get('/api/v1/vendor/checkout', pointsAPI.checkOut);
	app.get('/api/v1/vendor/checkin', pointsAPI.checkIn);
}