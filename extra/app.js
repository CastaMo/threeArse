var express = require('express')

var route = require("./routes")();

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');


var logger = require('morgan');

var port = 8888;


var app = express();

var compression = require('compression');

// var wuaotian = require("./wuaotian.json");

var path = require("path");


app.use(compression());


app.set('views', path.join(__dirname, ""));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    return next();
});

app.use(logger("dev"));

app.use(bodyParser.json({limit: '5000mb'}));

app.use(bodyParser.urlencoded({ extended: true, limit: '5000mb', parameterLimit:50000}));

app.use(cookieParser("secret"));

// app.use(session({
// 	name: wuaotian.session.name,
// 	secret: wuaotian.session.secret,
// 	cookie: {
// 		maxAge: 60 * 60 * 1000
// 	},
// 	resave: false,
// 	saveUninitialized: false
// }));

var auth_need = [
	
];


app.use(route);

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')());

app.use(express.static('dist'));

app.use(express.static('template'));
app.use(express.static('ticket'));

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.send({
        msg: err.message,
        error: {}
    });
});

app.listen(port, function(err) {
    if (err) {
        console.log(err)
        return
    }
    var uri = 'http://localhost:' + port
    console.log('Listening at ' + uri + '\n')
})