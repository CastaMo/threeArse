var fs = require("fs");
var fileDirectory = "../../db_src";

function readFile(path, filesList) {
    var files = fs.readdirSync(path); //需要用到同步读取
    files.forEach(walk);

    function walk(filename) {
        states = fs.statSync(path + '/' + filename);
        if (states.isDirectory()) {
            readFile(path + '/' + filename, filesList);
        } else {
            //创建一个对象保存信息
            var obj = new Object();
            obj.size = states.size; //文件大小，以字节为单位
            obj.name = filename; //文件名
            obj.path = path + '/' + filename; //文件绝对路径
            filesList.push(obj);
        }
    }
}


exports.traversalDir = function traversalDir(path, callback) {
	var filesList = [];
	readFile(path, filesList);
	callback(null, filesList);
}