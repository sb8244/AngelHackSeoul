var index = require('../controllers/index');

exports.create = function( app ) {
	app.get('/', index.index);
}