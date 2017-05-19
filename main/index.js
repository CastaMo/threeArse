var express = require('express')

var route = require("./routes")();
var bodyParser = require('body-parser');

var logger = require('morgan');

var port = 3000;

var path = require("path");

var app = express();

var compression = require('compression');  


app.set('views', path.join(__dirname, ""));
app.set('view engine', 'html');
app.engine('html', require('ejs-mate'));

app.use(compression());  


app.use(logger("dev"));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(route);

app.use(express.static('headPosTrackDemo'));


app.use(function(err, req, res, next) {
	console.log(err);
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