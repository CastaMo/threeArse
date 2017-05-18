var spawnSync = require("child_process").spawnSync;
var spawn = require("child_process").spawn;

var fs = require("fs");
var path = require("path");

exports.transferEmotion = function transferEmotion(options_args, callback) {


	var script_path = path.join(__dirname, "../processEmotionImg/processEmotionPic.py");

	var pei_args = [script_path].concat(options_args);

	console.log("pei_args: ", pei_args);
	var pei = spawn("python", pei_args);

	pei.stdout.on('data', (data) => {
		console.log(`pei stdout: ${data}`);
	});

	pei.stderr.on('data', (data) => {
		console.log(`pei stderr: ${data}`);
	});
	
	pei.on("close", function() {
		if (typeof callback === "function") {
			callback(null);
		}
	});
};

exports.parseAndPrint = function parseAndPrint(options_args, callback) {
	console.log("start parse");


	var pjs_args = ["common/p.js"].concat(options_args);

	console.log(pjs_args);

	var pjs = spawn("phantomjs", pjs_args);

	pjs.stdout.on('data', (data) => {
		console.log(`pjs stdout: ${data}`);
	});

	pjs.stderr.on('data', (data) => {
		console.log(`pjs stderr: ${data}`);
	});

	pjs.on("close", function() {
		console.log("parse end!\nstart print");
		var print = spawn("gsprint", ["test.pdf"]);
		print.on("close", function() {
			console.log("print end!");
			if (typeof callback === "function") {
				callback(null);
			}
		});
	});
}


exports.parseAndPrintForTicket = function parseAndPrintForTicket(options_args, callback) {
	console.log("start parse");


	var pjs_args = ["common/t.js"].concat(options_args);
	console.log(pjs_args);

	var pjs = spawn("phantomjs", pjs_args);

	pjs.stdout.on('data', (data) => {
		console.log(`pjs stdout: ${data}`);
	});

	pjs.stderr.on('data', (data) => {
		console.log(`pjs stderr: ${data}`);
	});

	pjs.on("close", function() {
		console.log("parse end!\nstart print");
		var print = spawn("gsprint", ["ticket.pdf"]);
		print.on("close", function() {
			console.log("print end!");
			if (typeof callback === "function") {
				callback(null);
			}
		});
	});
}
