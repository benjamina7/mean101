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

// use mongoDB:connection string:    /myDBName   <-- this will be created if it does not already exist
mongoose.connect('mongodb://localhost/mean101');
var db = mongoose.connection;
// listen for some stuff in the databse:
db.on('error', console.error.bind(console, 'connection error...'));
db.once('open', function callback() {
	console.log('mean101 db opened');
});

var messageSchema =  mongoose.Schema({ message: String });
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message
	.findOne() // return very first document in the collection
	.exec(function(err, messageDoc) { // callback function
		mongoMessage = messageDoc.message;
	});

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
	resp.render('index', {
		mongoMessage: mongoMessage
	});
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