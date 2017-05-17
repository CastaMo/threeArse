var spawnSync = require("child_process").spawnSync;
var spawn = require("child_process").spawn;


exports.parseAndPrint = function parseAndPrint(options_args, callback) {
	console.log("start parse");


	var pjs_args = ["common/p.js"].concat(options_args);

	console.log(pjs_args);

	var pjs = spawn("phantomjs", pjs_args);

	pjs.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	pjs.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
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

