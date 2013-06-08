
/**
 * Module dependencies.
 */

global.testing = true;
var express = require('express')
  , http = require('http')
  , path = require('path')
  , expressValidator = require('express-validator')
  , router = require('./router');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser({uploadDir:'./public/uploads'}));
app.use(expressValidator);
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

router.create(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
