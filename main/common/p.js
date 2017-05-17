var page = require('webpage').create();

var system = require('system');
// var port = 3000;
// var app = express();
// app.use(function(req, res, next) {
// 	res.send("haha");
// });

// app.listen(port, function(err) {
//     if (err) {
//         console.log(err)
//         return
//     }
//     var uri = 'http://localhost:' + port
//     console.log('Listening at ' + uri + '\n')
// })

var template_path = "http://localhost:8080/main";

console.log("ggggg");
var args = system.args;
// var args = process.argv;


// var h5 = "http://localhost:8888/qrcode/get?dest=http://www.baidu.com",
// 	me = "http://threearse-1252859479.picgz.myqcloud.com/test/2.jpeg?imageView2";

template_path = "http://localhost:8888/template/result";
//template_path = "file:///C:/Users/binl/Desktop/printer/hw2-table-sorter-master/13331202_%E8%8E%AB%E5%86%A0%E9%92%8A/index.html";

var querys = [
	"h5=" + args[1],
	"me=" + args[2],
	"datetime=" + args[3],
	"gender=" + encodeURIComponent(args[4]),
	"age=" + args[5],
	"energy=" + args[6],
	"number=" + args[7],
];

var result = [
	template_path,
	"?",
	querys.join("&")
];

var url = result.join("");
console.log(url);
page.open(url, function() {
	page.render('test.pdf', {
		format: 'pdf',
		quality: '100'
	});
	console.log("gg");
	phantom.exit();
});

	