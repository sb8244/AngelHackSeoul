var index = require('./controllers/index');
var register = require('./controllers/register');
var login = require('./controllers/login');
var ajax = require('./controllers/ajax');
var checkin = require('./controllers/checkin');
var pointsAPI = require('./controllers/api/points');

exports.create = function( app ) {
	app.get('/', index.index);

	app.get('/register', register.index);
	app.post('/register', register.process);

	app.get('/login', login.index);
	app.post('/login', login.process);
	app.get('/logout', login.logout);

	app.get('/checkin', checkin.index);

	app.get('/ajax/logged', ajax.loggedIn);
	
	app.get('/vendor/*', requireAuthentication);
	app.get('/vendor', index.index);

	app.get('/api/v1/points/list', pointsAPI.list);
	app.get('/api/v1/vendor/checkout', pointsAPI.checkOut);
	app.get('/api/v1/vendor/checkin', pointsAPI.checkIn);
}

var loginProvider = require("./models/login");
var requireAuthentication = function(req,res,next) {
	loginProvider.isLoggedIn(req, function(result) {
	    if(result === true) {
	        next();
	    } else {
	       res.redirect("/login");
	    }
	});
}