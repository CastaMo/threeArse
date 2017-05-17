var express = require('express');
var app = express();
var router = express.Router();

var path = require("path");

var fs = require("fs");

var common = require("../common");

var qr = require('qr-image');

var sdk = require("../sdk");

var uploadFile = function uploadFile(stream, ContentLength, Key, callback) {
	var ContentLength = ContentLength,
        Body = stream,
        Key = Key,
        Bucket = "threearse",
        Region = "cn-south";
    sdk.cosAPI.putObject({
        ContentLength: ContentLength,
        Body: Body,
        Bucket: Bucket,
        Region: Region,
        Key: Key
    }, callback);
};

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
		common.parseAndPrint({
			h5: "http://localhost:8888/qrcode/get?dest=http://www.baidu.com",
			me: "http://threearse-1252859479.picgz.myqcloud.com/test/2.jpeg?imageView2"	
		});
		res.send({
			code: 0,
			data: {},
			msg: "SUCCESS"
		});
	});

	router.get("/base64", function(req, res, next) {
		var base64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/2wBDAQoLCw4NDhwQEBw7KCIoOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozv/wAARCAGQAZADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD1qiiiqICiiigAooooAKhlwWHtU1Qtgyn2rKpsBKo4rmvHVysOjLGRkytgV0w6VwfxHnG61twx3dcCrjohM4ySTy4ScckVlbC8hc9TU985LAAnioVJERatDMr3GBWfdzCNOOpFXnbJOe1ZLA3V1sVsc0MB9hbMczyA7u1Wj8zcnpUh/cxbV/KoHPy59aA3BmLPx0FV3YFjjtUm4gECoSOfrSAawZgQpoCCPBBqbYEQk9cVDICYtw55pgDyDHAzxVGV28sk9DVthwR2xUcsOYEw2R9KrpoJPUqgYgBxg0KMrViaICNMHk9qWOAkEEDiosPmK+09M8U08cVY25FQsOadgTBFwwxU5wFzmmxqXO7uODTnXIxRsDZWYZbijbt5qdYsn1qCY7Tis2UncXdSgFhmol6VaiJVDjuKaBjGyRg9KjYccVIxqMjvRsBIvCCoZmJNSJyhHvUEv3qGEVqPUkrT+gGaWFVaEHPOelI3H4U7dQb1sP3fuiAKRW+VccYprnbEp7t2oXtn8aLitoWWcucnHApIiM1GD+7ZqIz2pMEW8bh7V6j8EZsw6jBlvkbOD07V5dDymfQ4r0v4INmbVvTI/pSLWx65RRRVDCiiigAooooAKKKKACiiigAooooAD0quBmU1Yboagi5bNY1N0BP2rzLx7Pv13AwfLQD+dem15b8QFMWru2Dl+laks5CdtwyaiP8AqzT5BkhfWmXJ8pNverIM+4fah96TTbQRxNOwwxJ60y4fIwKvqNtnGM9V5oQFeY7yPaqsh5xU5P7z2FQMP3v1NJjSHBQQc+nFPSAMOaUqMgVIhAouBDdIqoirk+tQKPk21ZKs4BOM1AxCtimmDGrH1pLlAyxgcYNShgPxqvdybXQKeoq1ZEMZdKFmUZzkZqQfLGenIxULsZJFJ7DFSO3AB7UMRBsJcKKrvy2QenFTMSHDKelOZFPzAAewpblXsLbcIfelIxkmlUY4ByKSVxHgHvQLqPjCou5vTOKzpuZDU8krEcGoZME8elZs0SIwcVct1HlZ96pE84q3C5WLH40kNoS6GyXA6YzUcWGR/XFSztkD1IqGM7Qw9aA6D4W+R/aq8hyxqyo2wbv7x5qo3LUNjjuSxOQhwe9S9V2g8HqfWq6A9KsRD5U7lmx+tNCkhZ0ClQrZ4qKp7kBXZe44qDvzQyUP3YjxQCRgjrR1wO5p2KkZZTiNz3xXsXwVsxH4ZmuzjdNKRx6CvHVBMLfQ17X8Gmz4KA/uzMP1oKjsd/RRRVDCiiigAooooAKKKKACiiigAooooAbJ9w0yFcCnSnAojHFYvWYD683+JaCK9t5exFekVxXxNiH9jQzbeUc5OK1Ezy1zvn+lVbuUByCT6VOGHmsQc5rPvWxclapEELNuf8a05MiIemBWfCM7/pV9gfsqHrxTEQKAWOaQR5m6U5Mb6kQAZNQ2aJEcgwKjVsip3G5GquoouNInQgrxVOVDvJOcZq5Cuc+1NuIsDI71KkNxM5pQpqKaRXCn+IHqaW5G0k1WLcVomZWJUcZB7USyc1Ar9s0x5CTRzCSJwwp4bMZPviqm7JqRTxijmHYsI20M3JyMVXll3Hk0+SQLHgdaqE0uYaiTZ6c1Gx+Y0gbuaQnLE1LKSE71bQfJVdADVuMfJn1oTKa0I3+YimLwTUhxmkUbmI9OaTYktBtxIwChemO1VRyasyDINV+jUDSsOTO/A9Kni3b1A7VEo6n2qWA4yzc8cVauRIJn3PuPWmZpGOfzpVYYpC2FQ7nHHSpm6hehNMiXD+ZipB8zB/Shh1LeFFucddpr2f4NR7PBSvg/vJWP64rxCRybd+SAB2r6H+HdkLDwRp0QGCyFz+JJ/rSLWx01FFFUAUUUUAFFFFABRRRQAUUUUAFFFFAEcvb609RgUx/vVIOlYx+JiCuZ8fWb3fhqTZ1Q5rpqz9eTzNDvF/6ZNjj2rUGeAQgk4IwRxVC8OboH1NXy224lHoapzrvlzTTJaHxJgVZU/u9tNjT93n0qWOMswX1pNjSItm0Z70BSF6VYmiMb7T1FSQpmIErj3NQzRFWRSiYPeo0iATjrVqT99JwOAKAm3qKmUtC0iOCP5TgYJq1cRBY0HBOOeKbjZtyOtWfLLrz2FRcpo5PUUZJWOOKo79y9MVu6nbFoXYAcVz54OBWsXcwkhC3NNJyaD1xSZ5qgSHg8U9SO/SoxyKVTQFh0rbmzjFQ81JgmmEc0AhTjik70NQvWgZKgq3CARjOABxmq8YABJ9OKkQny8ip1GAGcmkh5lY+1BYgdetOt0AlO/wBKlghJFG0n2qlyT9atzP1qqpxIDjpVQBkhBHFG7bGR70DJUse5pjGruQLnA+tPXAFRipVNITH5IXbmlBxTM5OaVDkigRcsoftd3aWx+UTzohz6E19R2VstnZQWyY2wxqgx7DFfPHgTTH1fxlYwAZSE+a5PbFfRooRfQKKKKoAooooAKKKKACiiigAooooAKKKD0pARHl6lHSo15epKzgJBVe/iM1hPEoyXQgVYoPTmtBnzlfwmC/nU8EMQRVeNQ0nNb3jC3ii8R3YhOVLk5xWNBGSxIGcUgsO24UL2zWlptr5m6RzwOlO0/T3ug7fdx2NdLZaVHFAgIBJHNS2WkYBtUkvMNkqfaodUVLfy4UJDMcHFdLDbI00zEBVjzx61h21rJc6lNJNHmKNty59KhsaKUFuQuWHNTJbh3xitJoAWJAqaK0VUzjk1mzVIzZLYY5XkVG0bhDWx9m3HkVFJEFJXb145oQHL3sJMbDBII5rkZRtldfQ16FqkCxSGNOpHNcJfpsuHBHetYGU0VTSAc0GnAcVdzMVTSjGaao5qRo9qb8cU7jBuBmoX4NWmUeUGxmo7mLy8ZBBIzSuOxXzTk+9Taco5oAmByQBU5OyMjsKhiXDZNSupPHY0noCIHcMwx2p5lO/PTipGgRF4BPHeqzAg0tGPYWRyfxqMUE5pwBPWrSJuKTiMCmGpdh7jFQnrRuJDgcmn9uKYtSKM80CY4DilRcnFKBxTo8AkmgR6L8GoDJ4nuroA7Vh28j3Fe215r8HNJ8jQ21HdjzmIxjtmvSqaGFFFFMYUUUUAFFFFABRRRQAUUUUAFI3SlobpUy2AYlPpqinVMNgCsjWddttOHktIPNYdPQVr15j43hI8SneTtdARz9aVSTSN6EFOVmc74kVZblpVIO45yKZ4O0ZdY1X7O5bZuwzL2p16oaPHaum+E9sTc6lcbcBWCDj1/wD1VcXeJnONpNG9B4Ijtp3KyloyPSrC6ILSN2C5VQcZrpawPEurR2tsYFf5yOcHpSaRKZyN3ESGjBB3ZyRVNIhDGVHftQ18ka8HJPXNMN1GdvPJNTItEscWT0qcr2ApsLFhUwOPrWLN1qNSL5S3pVW8ZRKrYGQPSrTu6r8v61RkwzEsfzppiaM29Ysz3ZACheprg9TjbzGlbnc2a7XXriNrZbVOQeWHvXL6lh4SpjUEAYrSLM5IwCOakA+XGKUpjrxU0cROOOtVczSIY0O4VbFq0tu+EJx70scLEsAvStmxtwsew55yKmUuxaiZlrB5kKkqCMdKh1CL91npjitW0gKIydgSBVe/iZYXQqST0xUqV2Nx0Of2E1IgxUzId23FQupTGT1rW5lqWY1JGR0qwITTbWMMAPfitZbde+RWMpamkUZEpIG3oBVSQg/hW9JpXnn5Saj/AOEeUHLSc/WnFobRhJCZGCKfmPQVrWWiSTOocNtHJNadjokUcgfHI71sLCqJtUnHpTlPsJROY1SySJ1SIZFY8kYV8YxXXalb9DXOXcf74DsPSiDFJFPZTl609lweKaBzWqMmOFSIhdkjUZaVgo/E0xV5Ge9dj8OvCz+IteE8mVt7JwxYevpQJHt3hrTv7K8PWVmQAY4l3YXHOOa1KKKZQUUUUwCiiigAooooAKKKKACiiigAoNFFJgAooooSsAVx3xA0lp7SPUYU3PDwxHXFdjTJ4UuIHhkGVcYNTOPMjSnPklc8UuBmJeOozXb/AAtg2aHcz7cCWc4/DNc1runf2bcy2sgGEJKH1Fdt8PYvK8IW3GN5LdMdaIPSxVTV3R0kh2xsfQE15lrz+bdu4JzmvS5+YXA/umvOdYtyty54waG7GSWpzFw7B+vFV0umjkBPSrV3GecVkTpJnoai9y7NHR2uqK4A4FXTcFlBU4riEneGUDJHtWpDqbAAZyKiUS4uxtyX0g4YbhWdNfBpSAhFOjv0Yds0skqzHrWexpe5k3bI8od/yrHuiHfOOM9K3ruwX/WByQe1Zj2e5+nSqUkhONzGFu00vCjFXYrRlGemK04rQquQuc+1TrbZGCtLmBQsZ+m2G55nODn1q95Pk8rxirFvGkROABn0psrDcQKVx2KiQ4ZmA+8c1DdxF+cDgd6tGUJweKqXN0mSo5qkiZMxpImVy27HtVGRD3OeeK0L1/nwp4IzwaqSAOBjrWuxkSQSNEUx0HWt+KRGCnnJGTmuYDlOG/Cti1lJRSe4qJIaZtIqtx0+lTLAvfn0rPhnK8VowTblBPWs3dGhOi4qQLSAVIBSGZ2pLiAsB07Vzl3AqxhzncT6V19wgePBFYmoWuFGR15qosmSOck4OKj71Nd8SkY6VB3rpWxzscWJ2qgJcnAA7mvoD4XeHZNB8Lh7mNo7q7IkkVuo9P514Rpsk9tqEF5bbfOhbcm9cjNdv/wmXjC/kDNqvkD0iTA/nUymomkKbke6UV5LpPjTxHZzZupVvYsYwwwfrmvR9B12212z86E7ZF4kjPVTThNSCdNxNOiiitDMKKKKACiiigAooooAKKKKACszU9WbT5kQwkq44kJ4z6Vp1HP5YjLSgFR60mBnaPra6rLNGoX911KtmtU8Cq1qtvkvDGqMeDgYNTyHCmlfQTIw53n0qUNkVXQ8EmpFNYKbTEjjfiPZA21reIdrGTymYDPB/wD1VveEoRb+GLGIHO2IAnGO1UfHieZoUIGMi6Q8n2NbOjoE0qBR02iteppd2sPubkRhh14xXJajEJWZsVq6jO0c7gnjNZkkqyfjWDepolY5q6tssflrNltSc/LXdHRpXh8zy+CMisO6tDG5BXFS7mkbM5aaxRuWSs6Ww2/dZvzrrJoBtORWVcxqCannki+VMoWsAjIJJNaEcO7kGqedp4q1BOAcGjmvuLlsPmQldvaoUt1HUVeAEgyKjZMGky4kflrtwOKYfkXins2KgkelcbIZGIOaoXEjq52k5xVyRqrvg9qpMhoy5pJ2bgHOKrOtwT0+tbGBnikEWT0q1OxnyMw2glfopP1pEs7jnKfSuiWAY+7Sm3B7Ue1D2ZzktjMFwUDe9W4QBGqjqowRWqYMdqabdWb7ozT57hyWIol3KDVy2YhgKiSBkPsasxxjIOKm40jSiwRUmKgiNWAc0gGlc1n6hAuwtjJxWoF4qnqQ/cUAzh70YmIqsAc1avVxdNUMaeZOiAnk11J6HM1qaej26sTI5+XtW4GKr8ny/SqtrbGGID1q5sOyuaTuztpxsiMSyo25XY47E9a6/wABawbfxAkIVdl6pVtxwQwGf6Vx461s+CrZ7jxbZLGrERszscZxwacNzWrFch7bRRRXWeYFFFFMAooooAKKKQjNAhc0VEyv/CaYPtCnnaaVxXLFZms3QihWNWG5jyOpxWhubKjH1qlc31tbzt50RJGBuC5pNjDSn8yBpDn5jjBq5McJVJNYsNowxX22mmy6tYviMT/MeQMdalvQRMhqdTwKgUHbnB9elTDtXMtwK+q2ou7AoVU7SGG6ptOjMVhEh/hWpyu5CvrQq7EA9K6ktCkc9qkOZZD71yuow3ag+Q5Rs5FdxfxhnPFYV3ACelcstzqjsc9HrXiOzhZfPWRVB4YVjy+Mr6YMZbcb06iunltVY/N0Nc5q2l+TIZY8fUCrurCtqZM3jyUArJZgfhWe3ipLlgBAQWOAMU7UdHurs70eMEevFVbfQbuKdXkeMhey0WhYFzGh9qDHkBasQndyKq/2VezufLCY75q9p9lcWytHchc/w4rGVlsarzLluTirDpxRbW5L4ArR+x/LyKhXZRhyIaqSAit+WyA7Vm3NuQfagGZT1CQTVyWMiolhLHgUxFcLzU8SbiMCs+/vWtbjyItpYdSe1RfbruKEz537TnAqlFsTdje8rA6UhUVkWviq3KBbkSKfXGasr4g0ybgSNnt8uM0OnJC50WyoxTCozTGvbQcmcKPek+12h6XCn6Ukmh3RKuKmQCqYnjYjbIDmp1b0oDcuKRUyNmq0fNWEHNO4rFgdKo6kCYjir69Kp6gP3Z+lWQzhr8YvGA9KWxjLTbhwU6Ut4P8ATWarGkxM0ckxxtJxW7b5TOCvI1oZ2ZVVsZrRjUGFmx0FY4O1q1oyUsyW/iFc1jtasUnfapOee1ej/C/w/JbW0ms3LHdcfLEnZVrifDugyeJNdjsi5S3Qh5iByQO3417lbW0VnbR28CBI41Cqo7Ct6cOpjXqacqJaKKK6DiCiiigAooooAKKKKACiiigAxTHiRxhkDfUU+ikKxA1nbt1hX8qYNOtQwYQLuHQ4q1RRYLIbsFN281JSAc1DigFHSiig1fQZQvuCfpWLP81a9+4yRjpWPLXHPc64bFKdNy8Vi6hE5UjGa3XNUp1DZqLmljlZYGz92oxbSHotdBJCvPyiohbk9qQGVHbyjpwauR2j9W5rRhtR3HNadlpDXEigj5c00rh6lHTNMaVgxGBWlc2YjIUHNb8emqo2INgFZ14mJyvpVONiYyuzDurPam496xLmIAV1WpIERR6jNc9dJk1LLZhzRc1EIyvIrQlj+Y0wRe1Q0SYdxo9rNKZXOGY89aiXSY1Up55K/St2W2DA1Ve1I6VSbQWucncaDcxMRCySr1BJxSW+lzRSLJOigr0AOa6ZoCM7kzTBEgPK1p7VkchiS2xueCvGemKsW9jGibSlanlg/dX8qljtS3UYqXO6HylKGwU4wvSr8VuVq1HCFAGKl2YFQ3ctECx4qZeKAtOApoGPXpVbUF/csfaraCq+oY+zN9K0SMmcNeLi4yBye9XLIrDZhO+cmoMfaNTWBQcE8kdq3W8PJBiTzjt9DWknpYKaSd2UoVMkyKBkE81panIIkjhjwXPyj0JoRbe1XIUs/oPWul8AeHF1nVm1a+XfBbH90h+6W9fes4rmZvKdlc7LwL4Yh8P6OsjZe7ugJJXbrzziunoAwMUV2JWPPlJydwooopiCiiigAooooAwLXxjpzTG21Dfp92GC+RMOeenIyOfrW/VK/wBIsNSikS5tYnaRdvmFBuHoQevFc6dO1TwkVubGW71e3b5JYJXyyDsykmgDr6Ky9F12DWI3UK0NzFxLA4+ZPStSkAUUUUwCiiigAooooAKDRRSYGRf/AOsIrKnbFbGpAeZn1rImTIJrjmtTrpvQoSyEVWYljVt0qIR81mblfy89qesHtVlUGelSbRQBHBDucLtzmur063SGBcL83rWBYpm4FdTEAI1A9K3pI56zHkCsG+jAuTit89Kwb9x57DvVVSaO5jak5dh6KMVjTDNat63zVly9awOlvQpOgJpm2pnqPvQQJ5YIqF4atLzTimakDPMPqBTTbIeoFXWjNR7KVhlYWyjoKkWH2qcLTsUWAi8sCkZcVKRTH6UWAi20nFKTSVSRLHoKqavIIrIseuDVxBxWPrxMjJCoPJ6VqloZPVlDQbdEma5kAyTmtW8zOoCsetVbeExIFxg1paRplzrWppYWx25/1knZB/jUXu9DWK5VdlbStFn1rUEtIASCcSOP4RXtel6Xa6Pp8VjaIEiiXA9T7mqug+HrPQLXybZcsfvSEcmtWumEOVHPUqczCiiitTIKKKKACiiigAooooAghud/yygJIOSmegqfNRPBE77mQbiMbsc044jXJOFUZJpEmPrmhy3m2702f7HfIc+Yo/1o/ut6iodE1uePZY60yx3buUibHEn/ANet6OVJVDIwYHoRVLWLA3doxijjNzH80LuOUb1HoaHoPZGhRWHo+pXULrpusMoveqOo+WQf41uUJ3BO4UUUUxhRRRQAUUUUAUdRTKhqxJ+uK3dU3fZcqM4NYc6t97HFctRanRTZVbAHNRMQW46U6UkCoWbFYM6UPDUNJUJeoJJaRRftbzyrpORye9djbsWhVj1NebQ+beanbQRYP7zLewr0uJNiAe1dNJHNXHNwprnr7mVj61vTuEiJNYN384OKdUVEw7rkms6UVpSpgkVSmGAaxOhlCTioGbmppaz5JCjHNIzRoRc1YVciqNrKGANaUWCKRRGY6iePmrhANRulA7FTbimk81M61C60CGswxULPSuSDULGgQbqM1ETTlOapIlsnQkLWVqMjLcKwglkUfxImQK02bZA7njCmvSvB1kLTw1bAqN8q73Prn/61bRjcycuV3PKNPtb7WJ1t7GxmdiMsxXaFH416p4S8OLoWnjzADdScu3p7VvhVXoAKWtI01EmdVy0CiiitDIKKKKACiiigAooooAKKKKAEHNIygqQRkHgg1CrPJGGC7ZR2PSplYleevemSQHbbj5Vwg7AdKlMgC5pxGahZhHKif3v0qCdUQ6tbNLZtJAga5iG6I45B9qpeG9am1OF4byBobqHhg38XvWvG6um5enasDU1fTL9NZCyu+NkyRfdI7ZpNWd0aXstjo6KitZxc20cwBUOobB7VLVAFFFFMAooooAjnQyQuo6kcVgXeYoAXXBzjFdGelZGqwEwtgEnOaxqI0g7MwZWAFU5G5qeYHGTVKU1zNHXFjXkNV5pHACopZ2O1QO5pzGrGkQCfXLQPnYGJPNJbl3sjqvD2gJpduJpVVrqTlmx932rdHSoWuoVON1Nmu444i27tXWnFI4pc0mQ6hLgbM1jyyAdaLy78x81QkuMjFc8pXZ0xjZDLgjJIrPmGc1Ykl4NVmcHvUsvoU3jyaz7+1YQmQdq1yBnNRzYKFT0PXNMmxiWE2ePStmKTgVz0MZhvJVzxu4rXhlyAKkZfMnFR+YTwTTN3FNPrQFx7GoJGoeXaPWoGkyDmqJGO9QM2aR5MnAqMmkJinmpYhmolqxEvNXEhkvlGZorcDJlcLz9a9ftIfs9pDD/zzjVfyFeSwTrb3K3Cxec9v8/ljvWxB8ZtLEpiv9OubZwwBAG7Hr6V0wiYTPR6K5a0+JfhO7UEarFFkE4lIUit221jTb0A217DLk4+Vs81diHpuXKKAQehooAKKKKACiiigAooooAKKKKAIeQemKduweazrTUlmQqkUrS79rgjGD61fRSmFJJPUk0GSHk4IA71FNuaZFHQZJpvlxkGEs+WO6n4AnAOd239Kd0U/IjiuFG8M65X7yg8R/WnoqTW5U7WDjnByDUM0ZjldvLTyXHzgDlmqS1WREVZY0jwMYU0nYbV0YXh291iPUrnTr7T5Et43YQTMeCoPGOK6eua1/ToRqltqpjvJpIsAJC3y+nIxXRxsXjVypUsASD2qI3Wg0ONFBNFUMKKKKACqV8MrjHBFXar3iFocgdKma0Gtzl7uILmsabqa6HUEJBIFYUqZrkZ1wZWAyatW6lHVxwQcimRxEt0q5HGAOak1C41h7Yr5mcN3FKuqrdQ7kkBGcdarX1uJVHoKzWAtlOwYyeapK5DaRoT3/OM1WN4D3rJup2zkGqJvWHU80tik7m+94PWq730YbrzWFLfnHFVWvHY5BosDZ04vF9abJeRlcZ5rlmubkn5ZMD6U+O4nIwxH1o1Foahwb0471bjG2sm2ZhOHJrXTlc0J3E9CUPSl8VGDimuwxxSsMR3zzUEjUM3vULEmgVxpPNLjNJjJp4qiGxUHNWk4GfSoEFSlZJAsMQBklYIoJ7mtIK5DO4+Htp/xK571yjC5lO0BeQAcda6eTTrOZt0lrEx65KisC4s9V0TwhFaaNH5t+FAAP3dx6k+3WobnVte0ay04Pbm9kmCpOduDGxPLH/ZFdqi7XRztXdie9+Hfha+D+ZpMKs6kb0GCM9x781hy/BzRRL5lpeXkBDZGJen6V0a+JnTVptNmsJFkVd0Lg/LMMZOOPXNTyeJ7C1lhgvi1rPMoKRuPvEkjA9Tx+tO0lqTdN8qOK/4V54v09CdM8XS/ImEjZcZ9s5pom+KmmzNuitbyJXPYksPzr0NtWsItvnXMcJckKJG2k464z9asxTRToHikV1IyCpyKSdug3qebD4meINNTdrPhO6jUKN0gyoGcc9Kt2fxm8OTuEuVntmyc7lyBj3rv3ijlXbIisPQjNUbjQNJukZJrCFg4IPyevWhOIMzrPx94XvWCxazbBmxhWkAJJ7Vt295bXaB7edJVPQo2Qa5S++FnhW8X5LE2rZHzQtg8Viz/B6OEb9J1q7tpMEZdtw56dMUrIG9T0uivLz4O+IemHOn+JhcjcPlcbQR+JrB1Pxn4305n0y5u4EnjYo7qh3A/XOKVgeh6/q+tWGiWb3V/cpDGgzyeT7CvPNY+MqLHJHpOmSSNj5ZZDgAn2xXm11Le3VxJLf3bXLu+8ls9arhDtYoCxJosK577qSXF9cw3umOwktsiULxu4PGO9TWWqR3VjDFLFcpPO5VlkG1lIP06Ut6tvZTqpvYYGkQ4DSqrE9iM9ayr6/ggtrC6bWreG6jkLyAsrGVRnjA6cd6Sv2M4u50zgTmS2ZZEVMYfpu+lP8ALQXKzgsfl2deMetVrWaFljRLyF/MHmENIC/PTj0q2i+ZvKtlcbR6UMtNhcqjxZLlQDnK1GQkSJKpG4kDLmnowktnKZOAR071Ss5p7jTsCECSJtpaXofU0lqNXJ9Vtjd2U0G9owy5VkPzUmhSmTT1Qxyp5R2Zl6tjvVpQk8QYc5XAYVjeHI1t7u9hM0jP5hwsjA8e1Q9JBfU3z1oI5pD96gfep3GOoooqhhSMNykGlooAwtRTG4elc+yHPIrrdThUpvx1GK5uZdrkVyzVmdMHoV0ULzUUl4qDaBls06d9uAKz5CPN5IHNZots3YIDc24O08jrjpVO40ggFmbvVltdttPswuFPAwSe9Yt54mmuhhI8AVVwUWyrqVkqRkjrXNzj5iMVuXGoPKMSdDWdIkcrZ3YNYybuaxjoZ5iyKjMRHNaDLGgxkUzajdDQpCcSkvXFSqBmrH2cHkD8aabfaOOtO9ydh0QAINasDZjrFJZPrVyyuWOVYU0JsvsagZqeWBFRM3NDY0MbNNNI7kdKZkmhCY+nCmD3p4q0QyVa3vA+mx6rrj3ksDSQWgIRzwu/29e9c47StsihUNLKwRATgZNeu+HdKOjaLBZOVaRB85UYBPeummtLmUmadBUN1AP1FFFamRDJZ28siySRKzocq3cVWvdFsb+5gubiIPLbHdCx/gPqKv0U7sVrO5z+q+Fl1XWLS/mmDLa7sRMOCDj0+lRnw7fJf3txHebY5lQQxpwE2gjFdJRVc7ElZ3OInl8W2Wg28MMAa9Nw3nEHcFj3Hke+McVrNrOow61Z6Ylq0qToHe4ZSFiAXkH3JH610NJtXOcDP0pud+g4qzuclB8QrOVriFrOdbi3Yh4yMdyAQcc1pp4y8Pm4a3fU7eKZH2MjyBSDgHv9a0JdJ0+clpLSMk9TjBNY2ofD7wzqUjSz6anmsSxdWIOfXr7UvdYK/Ul8VeKrXw9ojXv+tkk+WFFPLE9K8Lu2uDLJeX0/nXE75c+hr1PxHogDW1rFE8ttp8fmSTTH5eOg9z1rzbUQ+qo13FDsjZtxUEcVo4xtoZOepltOnnbWByR6UxVMW8qcEnIz0q1c2yMkT8+YvBx3FI8EcZJdjwhOO3SosMDA0sqtcXM87qMAySEkfrSCxiMrMxdtoxgsTgU4zbQWUcinNM5cvtADpgkVDbHdiGNswvb3VxGxYAlZGzgfWtfS/FfiLSLiKaG++1RIWjSCf7oBxySOTWOjsscfP3Aeaar7QCTkopOPekNSZ6b4d+LFvc7LPWoPskrEr9ojU+Xmu00e9tb+zle1kM0QcqZGIw3qa+fWAnUxyJkYCjJwB61r+GfFNz4U1VXV5LnT5jtlt1ycDsRnoaHbqUrM9yjb9yyMTuhbOyPsO1U4ohH4lBG1d8ZbGDkmpLR7W5V5IJJF80LIVCnIBHAz+NZd6JF8XWhSN8BQNxfqMemazk1bUhux1TdaE5NMdsP+FOiOVz60LcpO4+iiitCgooooAiuYhNCykc44rkrk5ZjjBBwQa7KuY1u38i8JB+WQZx71jVjdGkGYN0xxXN6mbh9xhY7h0rorjkVREKs3IrmsdCORa51IOY7iJmVehqaDV9mEkjcLnqRXY21vbtL++QMo9aunTtIezk3W67yOKpI1jZnHl1mQOjAqarSMu09jWjd6FEhZrWZk77c1jz2d2km0YOP1rNo2UewxmHrUTuR3xQYbkdEOfSq1xaXsp5yoxjGKEkJxZMNQkjOA3Aq0mpK4+brWM2nXKNwx/Gke0uwmAwB9afKmRKDNzzFduoqaNcHIPWsWytrlQXlfNasDFSM1OzMWi+pwKjd+aZ5maaaBodnNKMUzNKDVolilttAfNMY0INxxVIlly1QmVJwm5omDKD617FpmoR6nYR3UYKhxyp7H0ryW1wFxW7oXiGbQbgQ3BMmnynr3iJ/pW0ZpaGUkej0U2KWOaNZI3DowyGB4Ip1bGQUUUUwCiiigAooooAKKKKAOe8aXEFr4duJpVLjG0IGxkmvJkt44dPjwu0qoBAPWvV/HenfbvCl4qEh418xcDOcV5HJcb7OJlIwRXRHWJyyumNeFXdGKjA4471lSsS94uRwNqg1fE4MoU7h3GazZcefckDPOaBo6mf4aavb3tlavqUDfasiUqOUOCcdParFz8K9Qi1GDT4dZiw0RkJlGMckYGBXeLp0dgH1C986adG3Kgf7pP4+9GlmGe8ur6UyFw+2JZhuKgqMgE++awjqXzM871f4c6xpBs4ob6K6+0SrESB8qFjjJ4zjmsrWPDus6FN5M9p9pBcpvtkLA4APcdOa9WuHS61GzuvtCpA0iqcAj5lbPINX7fVss0f2pl2z7MtGMNnHQ0paagppuzR8/tdx78P8Au2HJWQEEU5mLxFBISjf3Bivernw5o2sNi/0i0O7JMiKASfr1rgP+FSSXVzejT9TWCKK4ZY4ny21M/Lz9KlTTRry2Nj4UapLc+HbqObUXMkEuz513FR2yfpW3eTeb4zsdodxtwH6KeOazPBXh+TwxZahZw6tazTvMDIrLwp7ZJFacUKXHjWJvtrMywhjGo+QEDnH41nUtZETV2dFePtbr2q5F/q1+lZuofNeRoD0wf1rTXoKcdykLRRRWpQUUUUAFUNZtRcWLEIGdOVqzdXcFlbvcXMqxRIMszHAFeUeIPixfX2of2f4as2mRWw77clx6D0+tS1dDRr3SFc5rPLkHitaTzp7eKaaExGRASGGOazJI8GuR6HUhpn+Xk81DLqGyMruwKSVOeTjisqcs+dvrScrGkGy2b1W75pjEPzmsmR5EPANLHfOp+YVF7m6kaY+Tnj8ailk5yazJNUbnaM4qI3kknJpD5i5M4Zs8D6VARk1GHJ61IhoM3IlC8UdKTfgUm7NFiCUNxRuJHWo80ueKCR4NLuwKi34pDJxVITQ8vmp4KqpzVqLg02ybGhCcCrqkPGVYZBGCDWfG1W0filzBY1/DviCbQJfslxumsHOVOcmL2+ld5Y6pZ6hai4t5lKHg5OMGvLi2etJ5MUgKNJMiMcssUrJnjHatqdVLRmcqemh62ssbfdkU/Q06vCdS0jW9Nk+36Lq93IkTCRYWmZiMc4IJ5rpfB/xMne9Sz1+Rdlwf3Vxt27W6bWHauuNpL3THla3PUaKRXVlDKQQeQRS5FIm4UUUUDCiiigBk0fnQvGTjepGcV4TeaNNY6le6eGEi28rKrdCRnivea8z8caX/AGbrr6vJIotplA8sH5i3c1pCVtCJRb2PNLiRobsId2V4PpVW4uVj3Nk8gjir3iBD56XKIQko3CslsNw44B7irMrHuRls9NtzdXGpG5nkVU2k/wAXHX8qu20VzdEwTzsAu2ZXB2YyRxkdayXXw8bhbextpbiRJAxVuec1rT3M090RGF+zz7Y0CruKsMZBH4VzPUaVmQX1zaSaxDpol4tmcyeYuV5UEVPpPntYW8cwKBdykCMMpOeD+tV9Pt2nu7u6XyZUuVaJdnUMBg5qzpczLa7rWNXj4Z2ilOSQTkYxRH4byDl10LiymS5bbJbvEh3FfLwwX8qzbW4ayudSiOoxQSmbKK8WeOcfpV65aT7GIi9zO0zHaqj5wvGec1Tub2O3utSxdRxJFGgKXEeecfL/AFpOTfTQrS+43Tt86yzf8Su4EkuXZVwcf988mjw7It5rdzMr2j/Z2aMGKPawX8qW1Q2elJcSQQB1j8zzIR/e6jH40ng9NsN7ciZ38yXaAybcfrWEneSQ7s1boltYiAJxxmthTzWQPMfV1C42gZNaEl1b2yb57hIx6lq1gNFmiue1DxzoOnkq135rAZxEM5rltQ+J15OhTTLERknAkkP9K2SbKuehX1/a6baSXV3MsUUYyzMa89m+Jd/qUrLpFkkUCuf385+8o9BiuP8AE+sahrNzBDfXDvGeWQHCj8Kdbt5cIUDAHSml3Jci/repa14zvrbRvPU5cCWJRtBU9+K9L8LeENL8LWax2duvnkfvJiMs34+lcb8LrL7RrWoao6fdARWr1Cs92abIztcsBfaew5Dp8ykda4fywwBPXvXpNcP4kt20/VPOC4gm5zjgGsqseprTl0MmW1EgIxWfJp4jOFXFbCuGGaZJg1zM6Ec9NZEnpVWXT/l5Wt+Xb+NV5emKixVznXslQYK4+lM+yhe1bUiKxyab5akdBS1GY/kYPSlCYrRaJelRtCo6UCKTKTSBDVooKY2BRcCMDFIxGDRI4FQNJVIlscWpAcmmDk1KopsCSMYq1HVdKsJ0qWwLKGrKNVNTViM0mwLGaN2KbmkNS2BYhnaORWViCD1rjPEzxtqk0GxdjfNwMc+tdUGwck4A7159qt41xqk8mQQDgc11YZvmMK2x1WkfEbxJpEEVuJ47qCFNqrIOSO2TXeeG/ippur3NtZXsL2d1KuGLfc3+gNeJLOfWpY5PNJEigKORz3r07K2pxJ9z6mR0cZRgw9jmkYnsa+edK8Xa9osMkNhfny5HDssg3HI7A9ga67Tfi/Kvya3YEIWIM1uclVI644rPlKk7rQ9YVs980pbFc74f8R6HqVtGtlqiyyHPyyt8+ferl7r8FlLLEySStCoZvLGcA5xn8qfI29DP2jiveNUEE1578SJRcanYWZQOigmQfXpXbaVei/t/NA2kHBU9RXnPiO6F54wvN4JS3wn0IrGr7p24T3ndnJeI9OmtJw6IxtkA+8c7Aa569CAhl4UjBr0u1ka/uLoKAVWPDqwyD3rz3W4HjkdncFmkJIAxgdqqjJtakYmFpaHtWnnS7a8tWtbd1jZD5rkc7vVqr3Wr20drJb20ckM63YCADBYMRkg/QmpLSOWzhub/AFiMRF4mfYhyOmcfgKoeHbT+3rJNRFwRbs3mWqhcSfK3OR6cGlqzmuzTsrKK3iiVCBBFdb4mBwwJxuDevOaj0xVjh8q2lI3SOEnVMhW44NWLyXTrWRppdRit4pmEkchbADr1BH4Vzk3jvTdOtrltMWWS6nkMrHH7sv06enAp8t0OzOot/K1DUPtcbzTQRJiKa14Xd/ED+lVdTMonhso7yOaKaMGbzlyxAwRzmvPrvx1rbhkt50skJLbYBjOeuaxJNTupzvuLp5HK7S2ecVXKyrKx6h4k1PT4tPkt0Qo0pXJhfoM8moW+IWl6VYxWtqsly0agbm9a8u8/A+8x+ppFm54GKhUle4jsr7x1qk8jSQYgLj+GsCa8luxi5lkkP+03FZzTErjdTEmPc1okkBf3rvyFCkelWbZi0hJ6dqzA/fNXrZtsQfJGatCZRklE+synLE9OfStMPiEn0U1j26kX0khzkn9K02b92Qe4qSluejfCSMDw3NLnLNO2T+Vd5Xn3whnU6Dc2/O5JycH8K9BzWK0NWB6Vk6rFHdxPBMoZSOM9jWozYBPpWNdSbmasaki4I4y5hl06YxvzHn5WHpUUlwpTO6t6/VJo2R1DA/pXKanYTxAPB8yjqKx3N0xJJ+4NQtPnvWXJdlfvkKfQ1GL5TyGz9Kz1RqjTZ8nrSeaB3rON4COtRm7GetLUDSZweahacDg1RN2expjXHrQguXGlx3qvJNg9arGfPemhi1NK25NyRpN1IBmkAxThzRcBy1IKYq81IBSAcudwOatIeKrLUyNSYydTViNqphjmrCNUsSLQbigmow3FDSBQXY4VQSTUjM/Xb9bHTXYn5nGFHrXn4Y8seSTmtHxDqrajekK+Yk4ArJDV6VCPIjlqPmZOHqSOQgVWBzT9+BiunmOdxLPnH1qVLlsYPSqIcetL5lPmFyl4FPMEiExyKQVdTggjoa6PTvHmtac8wlcXsc2C4Y4Y47ZrjxIe1PWfHXrSUmJq+59DeHfiL4b1tlihuBb3LqMxyjaSfQetcn4jhNlr95ORlJ5SwIPXmvJxINwcMVZTkFTgitew8U3llGsU/wDpUAbJWTk4PXmsasXJaHXQqKDPQvC08Vzd6ksZG5YQcZ+grlPFVoIr8iVOGHABrR8KeJtAg1Ri8j2X2j5G3jIwen9K6LxTpP8AagN5ZFJ4dpAaM56CppJx3CvNT2IdV8QadGsVnavM0NuTj5s56+1ZF34x1SQQpDcfZ1hB2FOGGe1cu1ztB9T1qBrgk5rqslscS0L012zuTLIXySTuNVmuTg7GAzVN5iTTC2ec07lFhpyTyaTzCe9VC3NKGpAWjIQOtCuc9agJyKdG2TSsBZLcU1H5ppPFMVsNQhl1GzWhCwMG3NZKNV+A7lwKqxLKSbV1KQ5IPTFXTMemMVkSuE1NJCSA3FXnkBztqSjtPhVqYtvEdzYswCzDKjPevX2bBxXzXYam+ka1baggyI3AbBwcV9DWOoR6jp8V1EeGUGuapdG61RYuJNsJIrEuJPvVdupiQRmsqeTg1zNmsVYpzuCSM81lXRJNX5Tlqo3HepKMmSC3cMskKtmqFxoli4/ds0RPXFaMxwTVdnyKVyrGFNpMkJOycMo/vdapvbzKT81bs5zVCQc0uYozvKlXq2aPLbOTVvbSbKdxWIVSpQuBShadtpDGhacBR0pQDSAcOKdTaUGkMetSqagBqRTikBOlShsVApqReQWJwo6mkK5OGbBIBOPSuZ8S66v/AB62rnOMOQentUeueIcM1vZuRjgsK5gksSSck9TXTSo/aZlOfRBmiiiusxFBpck02jNO4rC5pd1NoouFh4agMaZmgHFFwsTA8U4PUG6lDUE2LO4N1HtV2w1LUdObfY3kkXIOM5BNZqmpRJgcGnuS7outMSetN8w9c1BvyaduAFbEWF3knmnE8UxPWl659qQhN3NOTBySelRZ5pQcUDJpCNq+9KjVGzAgZ7DiiM5cegoC5bPIxTOVYD1p4PGaZ1NOwidDirUM2xSRVLdT921cetAyteAHEmcbGqdZ8xqcg5HUVA+GUhgDmoYmwCvp2pNIZZl2yqVboa9O+FXiUSWzaRcyhmj+7u64ryoOQfrVixv30vUIb+EsGQ/Nt7ispxujSD6H0LdMQSKzJm61U0fX4dZ05JlcE7easMd3euFqx0ooynDEVWm5HFWLng5qsTmpKMy6GCaos1aN4vWsqQ4rN6FoZJVSRanZqjPIpXGVyKbUrCmEU7gNxmnYoFOAouIbiilIpKACgDmiikIcKcDTRzwKjury2sIy9w+TjhQec07N6A5JFrciRmSRwqjnmua1jxFJcO0NoxSLoT3aqGoavcX7nLbE7KKoV106VtWYynfYCSTk9TRRRW5mFFFFABRRRQAUUUUAFFFFABQKKKAHA07dTM0Zqrk2LW7igGowwIoDDNaJmdidDjNLu5+9jNRs4wAOlISMU7k2HE88dKTPNM3c0ZyaVx2JmOQKWI4amE/LQpxVElsSZXFKGqEEEdaXdjoaYibfzzQ8mBnqKrtIRxTC3pnmkUSmUZ61Ex2yCQDPqKbnnNG4HvRcNiRnVjle9G7HBqIMVzxQzZqWUjZ8Pa5NoV4rbi1s33l9K9a07UIL21SWN1IcZBBrwwNxg9K2vDviafQpvLYGS1Y9Cfu1hUp31RtGXRnrV3iqYGabaajBrFqLmzkV/wC+gPK0qsQ2CMVy2sbor3kXyk1iTjDGuiuV3R1z9wP3hFYzRcSm1Rk1K/FQNxUIoQmm5pCaQHNMLjsU6kXpTwKB2ExTSMU+mykRx73YKPc0CehGTikLqqlncKB3JrKvNehjZ1iXe2MAjpmsK4vZ7k/vHOPStoUW9zKU0bl94gSLMdsNzD+M+tYE08tw++Vyx96jorqjBR2MW7hRRRViCiiigAooooAKKKKACiiigAooooAKKKKACiiimA8GjPNNFFUibEmadUeacDxVXJaFzikByaTdkGgdaLhYlyaUN2pmaUdapE2JAaTd700nim5ptiSHl89aQvmoyxFG6puPlHFqTJBpuRSbuKRViXORTN2Dg0gag80aBYkUg0E9qiGVNO3A0XCxcstTu9Mm86ymaM4wQDwa7HSviFFLti1aHaehlQfqa4KmsazlBMuMmj2i31XSdQiBtr+Ntw+6Tg1mXsTCRtuGA7givKVZkO5SVPqDU6alfR423UoA7bzXPOhc1jOx3crFTgqRVZ5K5VNe1BTkzF/97mpP+EhvMdE/KsfYSL9ojoTJ7GlUseimubPiC+zkMo/4CKifWb9+s7D6cU1QkHtEdcucZbCj1Jpkl/YW5xNdKPYc1xcl1PL9+Z2+rGoutWsP3ZLqHSXfikKxW0hBHq4rEutRubw/vZCRnOB0qtRW0acY7IhybCiiirJCiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKc+zjYCOOc0ANpc0lFACg04UylBqkxNCmgUh60VSAkU0pNMFLmqJaHZpCe1NJpM0BYdmmk5optJjSFzRSUUrjFzS5ptFTcLC7qSjNFO4Dg5ApCc0lFTcLBRRRSGFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFKKSiqQCnFFJRTuIdRSCloQhCaM0maKLjDNFFFJsYopMUA05jnFHQQ2iiikMKKKKQBRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//2Q==";
		base64 = base64.replace(/^data:image\/\w+;base64,/, "");
		var dataBuffer = new Buffer(base64, "base64");
		// var a = new stream.Readable(dataBuffer);
		// a.pipe(res);
		var file_path = path.join(__dirname, "../empty.txt");
		var stream = fs.createReadStream(file_path);
		var Key = "test/2.jpeg";
		stream.push(dataBuffer);
		uploadFile(stream, dataBuffer.length, Key, function(err, result) {
			res.send(arguments);
		});
	});

	router.get("/qrcode/get", function(req, res, next) {
		var dest = req.query.dest;

		var img = qr.image(dest,{size :20});
        img.pipe(res);

	});

	return router;
};