var express = require("express");
var app = express();
var port = process.env.PORT || 8080;

var cookieParser = require("cookie-parser");
var session = require("express-session");
var morgan = require("morgan");

app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({secret:'anystringoftext',
                saveUninitialized: true,
                resave: true}));


app.use('/', function(req, res){
  res.send('Stop starring at my cock');
  console.log(req.cookies);
  console.log('================================');
  console.log(req.session);
});

app.listen(port);
console.log('Sever running on ' + port);