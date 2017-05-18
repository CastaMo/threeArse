var express = require('express');
var app = express();
var router = express.Router();

var path = require("path");

var fs = require("fs");
var stream = require("stream");

var sdk = require("../sdk");

var qr = require('qr-image');

module.exports = function() {


	router.get("/template/result", function(req, res, next) {
		var query = req.query;
		console.log(query);
		// query.me = query.me || "http://threearse-1252859479.picgz.myqcloud.com/test/2.jpeg?imageView2";
		// query.h5 = query.h5 || "http://localhost:8888/qrcode/get?dest=http://www.baidu.com";
		res.render("template/demo", {
			data: query
		});
	});

	router.get("/ticket/get", function(req, res, next) {
		var query = req.query;
		console.log(query);
		res.render("ticket/index", {
			data: query
		});
	});


	router.get("/qrcode/get", function(req, res, next) {
		var dest = req.query.dest;

		var img = qr.image(dest,{size :30});
        img.pipe(res);

	});

	return router;
};