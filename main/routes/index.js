var express = require('express');
var app = express();
var router = express.Router();

var path = require("path");

var fs = require("fs");

var common = require("../common");

var qr = require('qr-image');

module.exports = function() {

	router.get("/", function(req, res, next) {
		// var index_path = path.join(__dirname, "../headPosTrackDemo/index.html"),
		// 	readStream = fs.createReadStream(index_path);
		// readStream.pipe(res);
		res.render("headPosTrackDemo/index");
	});

	router.get("/template/result", function(req, res, next) {
		res.render("template/demo");
	});

	router.get("/test", function(req, res, next) {
		setTimeout(function() {
			common.parseAndPrint();
		});
		res.send({
			code: 0,
			data: {},
			msg: "SUCCESS"
		});
	});

	router.get("/qrcode/get", function(req, res, next) {
		var dest = req.query.dest;

		var img = qr.image(dest,{size :20});
        img.pipe(res);

	});

	return router;
};