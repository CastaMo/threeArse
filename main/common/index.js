var spawnSync = require("child_process").spawnSync;

exports.parseAndPrint = function parseAndPrint() {
	console.log("start parse");
	spawnSync("phantomjs", ["common/p.js"]);
	console.log("parse end!\nstart print");
	spawnSync("gsprint", ["test.pdf"]);
	console.log("print end!");
}

