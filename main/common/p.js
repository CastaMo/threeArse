var page = require('webpage').create();


// var express = require('express');

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

template_path = "http://localhost:8888/template/result";
//template_path = "file:///C:/Users/binl/Desktop/printer/hw2-table-sorter-master/13331202_%E8%8E%AB%E5%86%A0%E9%92%8A/index.html";

page.open(template_path, function() {
	page.render('test.pdf', {
		format: 'pdf',
		quality: '100'
	});
  console.log("gg");
  phantom.exit();
});

	