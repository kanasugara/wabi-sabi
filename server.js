var express = require('express');
var app = express();
var port = process.env.PORT || 8080;
var path = require("path");

var cookieParser = require('cookie-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");
var passport = require("passport");
var flash = require("connect-flash");
var MongoStore = require("connect-mongo")(session);

var configDB = require('./config/database.js');
mongoose.connect(configDB.url);
require("./config/passport")(passport);

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({secret: 'anystringoftext',
				 saveUninitialized: true,
				 store: new MongoStore({
				 	mongooseConnection: mongoose.connection,
				 	ttl: 2*24*60*60
				 }),
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session



app.set('view engine', 'ejs');
app.set("views", path.resolve(__dirname, "views"));
app.use(express.static(path.resolve(__dirname, 'public')));


var auth = express.Router();
require('./app/routes/auth.js')(auth, passport);
app.use('/auth', auth);

var secure = express.Router();
require('./app/routes/secure.js')(secure, passport);
app.use('/', secure);
// app.use('/', function(req, res){
// 	res.send('Our First Express program!');
// 	console.log(req.cookies);
// 	console.log('================');
// 	console.log(req.session);
// });

app.listen(port,process.env.IP);
console.log('Server running on port: ' + port);