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

var messageSchema =  mongoose.Schema({ message: String });
var Message = mongoose.model('Message', messageSchema);
var mongoMessage;
Message
	.findOne() // return very first document in the collection
	.exec(function(err, data) { // callback function
		console.log(data);
    	if (err) {
    		mongoMessage = ':( Mongo appears to be down bro.';
    		return console.error(err);
    	}
		mongoMessage = data.message;
	});
var mongoMessage2 = '';
Message
	.find({ 'message': { $regex: '.*blah.*' } }) // return any message object where the massage contains blah
	.exec(function(err, data1) { // callback function
		console.log(data1);
    	if (err) return console.error(err);
    	data1.forEach(function(item) {
			console.log(item.message);
			mongoMessage2 += (item.message + '   |   ');
	    });
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
		mongoMessage: mongoMessage,
		mongoMessage2: mongoMessage2,
	});
}); 

var port = process.env.PORT || 3030;
app.listen(port);
console.log('Listening on port: ' + port + '...');

function compileViaStylus(str, path) {
	return stylus(str).set('filename', path);
}

var exposedPartials = [
	'main',
	'other'
];