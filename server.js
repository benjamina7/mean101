var express = require('express'),
	stylus 	= require('stylus'),
	logger 	= require('morgan'),
	bodyParser = require('body-parser');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

// configure view engine
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

app.use(logger('dev'));

//app.use(bodyParser());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(stylus.middleware(
	{
		src: __dirname + '/public',
		compile: compileViaStylus
	}
));
app.use(express.static(__dirname + '/public'));

// Partials route - any url starting with "partial", then take in the next part of the url as a variable named partialPath
app.get('/partials/:partialPath', function(req, resp) { 
	var partialPath = req.params.partialPath;
	if (exposedPartials.indexOf(partialPath) > -1) {
		resp.render('partials/' + partialPath);
	} 
	// else {
	// 	resp.render('index');
	// }
});

// add a route to deliver our index page (a 'catch-all' route)
app.get('*', function(req, resp) { // all routes from a server perspective will show the index page (client side routing can pick it up from there)
	resp.render('index');
}); 

var port = 3030;
app.listen(port);
console.log('Listening on port: ' + port + '...');

function compileViaStylus(str, path) {
	return stylus(str).set('filename', path);
}

var exposedPartials = [
	'main',
	'other'
];