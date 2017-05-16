var express = require('express');
var app = express();
var router = express.Router();

var path = require("path");

// var controllers = require("../controllers");

// var user_controller = controllers.user;
// var film_controller = controllers.film;
// var cinema_controller = controllers.cinema;
// var session_controller = controllers.session;
// var cos_controller = controllers.cos;

module.exports = function() {


	router.get("/template/result", function(req, res, next) {
		res.render("template/demo");
	});

	// router.get("/api/test", user_controller.authUser);

	// router.get("/api/film/list", film_controller.list);
	// router.get("/api/film/detail/:id", film_controller.detail);
	// router.get("/api/film/findBy/:id", film_controller.findBy);

	// router.get("/api/cinema/list", cinema_controller.list);
	// router.get("/api/cinema/detail/:id", cinema_controller.detail);
	// router.get("/api/cinema/findBy/:id", cinema_controller.findBy);

	// router.get("/api/session/findBy/cinema/:id", session_controller.findByCinema);
	// router.get("/api/session/findBy/film/:id", session_controller.findByFilm);
	// router.get("/api/session/findBy/:cinema_id/:film_id", session_controller.findBy);
	// router.get("/api/session/detail/:id", session_controller.detail);

	// router.post("/api/cos/upload/photo", cos_controller.uploadPhoto);
	// router.get("/api/cos/auth/get", cos_controller.getAuth);

	return router;
};