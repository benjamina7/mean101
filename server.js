var express = require('express'),
	stylus 	= require('stylus'),
	logger 	= require('morgan'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');

var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var app = express();

// configure view engine
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

app.use(logger('dev'));

//app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(stylus.middleware(
	{
		src: __dirname + '/public',
		compile: compileViaStylus
	}
));
app.use(express.static(__dirname + '/public'));

// use mongoDB:connection string:    /myDBName   <-- this will be created if it does not already exist
if (env == 'development') {
	mongoose.connect('mongodb://localhost/mean101'); // DEV
} else {
	mongoose.connect('mongodb://shabadoo1:password123@ds051903.mongolab.com:51903/mean101'); // MongoLab
}

var db = mongoose.connection;
// listen for some stuff in the databse:
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
	console.log('mean101 db opened');
});



// Partials route - any url starting with "partial", then take in the next part of the url as a variable named partialPath
app.get('/partials/*', function(req, resp) { 
	var partialPath = req.params[0];
	console.log('received server request for: ' + '/partials/' + partialPath);
	if (exposedPartials.indexOf(partialPath) > -1) {
		console.log('path is valid. rendering: ' + '/public/app/' + partialPath);
		resp.render('../../public/app/' + partialPath);
	} 
	else {
		console.log('path restricted or not valid');
		//resp.render('index');
	}
});

// add a route to deliver our index page (a 'catch-all' route)
app.get('*', function(req, resp) { // all routes from a server perspective will show the index page (client side routing can pick it up from there)
	resp.render('index');
}); 

var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port: ' + port + '...');

function compileViaStylus(str, path) {
	return stylus(str).set('filename', path);
}

var exposedPartials = [
	'main/main',
	'other/other',
	'main/featured-courses',
	'main/new-courses',
	'account/navbar-login'
];
