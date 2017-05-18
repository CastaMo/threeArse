var processor, stats, detector;
var isStart = false;

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


// WEBGL
//if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var MARGIN = 0;

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;

var container;

var camera, scene, renderer;

var mesh, texture, geometry, materials, material, current_material;

var light, pointLight, ambientLight;

var effect, resolution, numBlobs;


var effectController = {

	material: "colors",

	speed: 1.0,
	numBlobs: 10,
	resolution: 50,
	isolation: 30,

	floor: true,
	wallx: false,
	wallz: false,

	hue: 0.0,
	saturation: 0.8,
	lightness: 1,

	lhue: 0.04,
	lsaturation: 1.0,
	llightness: 0.5,

	lx: 0.5,
	ly: 0.5,
	lz: 1.0,

	postprocessing: false,

	dummy: function() {
	}

};

var time = 0;
var clock = new THREE.Clock();

var Processor = function(canvasid) {
	this.canvas = document.getElementById("mycanvas");
	this.context = this.canvas.getContext('2d');
	this.currentCam = [0, 0, 0, 0, 0, 0];
	this.targetCam = [0, 0, 0, 0, 0, 0];

	this.STATE = {
		"waiting": 0,
		"running": 1,
		"outputing": 2
	};
	this.state = this.STATE.waiting;
	this.startTime = 0;
	this.maxTime = 10000;
	this.emotionsRecord = "";
	this.faceBase64Data = "";
	this.emotionBase64Data = "";
	this.age = 19;
	this.gender = "unknown";
	this.energy = 52356;

	this.currentNoiseWrinke = 0;
	this.targetNoiseWrinke = 0;
	this.currentBrowRaise = 0;
	this.targetBrowRaise = 0;
	this.currentEyeWiden = 0;
	this.targetEyeWiden = 0;
	this.currentEyeClosure = 0;
	this.targetEyeClosure = 0;
	this.currentBrowFurrow = 0;
	this.targetBrowFurrow = 0;
	this.currentCheekRaise = 0;
	this.targetCheekRaise = 0;
	this.currentLipCornerDepressor = 0;
	this.targetLipCornerDepressor = 0;
	this.currentLipStretch = 0;
	this.targetLipStretch = 0;
	this.currentInnerBrowRaise = 0;
	this.targetInnerBrowRaise = 0;

	this.faceRect = [0, 0, 0, 0];
	this.noseImg = new Image();
	this.noseImg.src="./img/nose.png"

	this.init = function() {
		//this.faceImageCanvas = document.getElementById("face_video_canvas");
	    //this.offlineCanvas = document.createElement('canvas');
	    this.faceImageCanvas = document.getElementById('test');
	    this.faceImageCanvas.width = 400;
	    this.faceImageCanvas.height = 400;
	    this.faceImageCtx = this.faceImageCanvas.getContext("2d");
	    // Emtoion Canvas
	    this.emotionImgCanvas = document.getElementById('emotionCanvas');
	    this.emotionImgCanvas.width = 600;
	    this.emotionImgCanvas.height = 600;
	    this.emotionImgCtx = this.emotionImgCanvas.getContext("2d");
	}

	this.getFaceBase64 = function()  {
		this.faceCanvas = document.getElementById("face_video_canvas");
		this.faceImageCtx.drawImage(this.faceCanvas, this.faceRect[0], this.faceRect[1], this.faceRect[2], this.faceRect[3], 0, 0, 400, 400);
		return this.faceImageCanvas.toDataURL('image/jpeg',0.7);
	}

	this.getEmotionBase64 = function()  {
		var emotions = [0, 0, 0, 0, 0, 0, 0];
		for (var i = 0 ; i < this.emotionsRecord.length ; i++) {
			emotions[parseInt(this.emotionsRecord[i])] = emotions[parseInt(this.emotionsRecord[i])] + 1;
		}
		for (var i = 0 ; i < emotions.length ; i++) {
			emotions[i] = emotions[i] / this.emotionsRecord.length;
		}
		console.log(emotions);
		render(emotions);
		return renderer.domElement.toDataURL('image/jpeg');
	}

	this.outputResult = function() {
		this.emotionBase64Data = this.getEmotionBase64();

		var postData = { 
			"time": this.startTime,
			"energy": this.energy,
			"gender": this.gender,
			"age": this.age,
			"emotions": this.emotionsRecord,
			"picurl": this.emotionBase64Data,
			"meurl":  this.faceBase64Data
		}

		console.log(postData)

        $.ajax({
		  method: "POST",
		  url: "http://localhost:3000/task/start",
		  data: postData
		}).done(function( msg ) {
			if (msg.code == 0) {
				alert("OKOKOKOK 得到了本地服务器的成功返回")
				processor.state = processor.STATE.waiting;
			} else {
				alert("得不到成功返回呀")
				processor.state = processor.STATE.waiting;
			}
		});

	}

	this.getCurrentRunTime = function() {
		if (this.state == this.STATE.running) {
			var t = (+ new Date()) - this.startTime;
			return t;
		}
		return -1;
	}

	this.update = function() {
		// 判断 是否到达时间限制，是则停止
		if (this.state == this.STATE.running) {
			if (this.getCurrentRunTime() >= this.maxTime) {
				new fadeSound("bg", true, 0.5);
				console.log("STOP");
				this.state = this.STATE.outputing;
				this.outputResult();
			}
		}
		for (var i = 0 ; i < this.currentCam.length ; i++) {
			this.currentCam[i] +=  (this.targetCam[i] - this.currentCam[i]) * 0.1;
		}
		this.currentNoiseWrinke +=  (this.targetNoiseWrinke - this.currentNoiseWrinke) * 0.2;
		this.currentBrowRaise +=  (this.targetBrowRaise - this.currentBrowRaise) * 0.2;
		this.currentEyeWiden +=  (this.targetEyeWiden - this.currentEyeWiden) * 0.2;
		this.currentEyeClosure +=  (this.targetEyeClosure - this.currentEyeClosure) * 0.2;
		this.currentBrowFurrow +=  (this.targetBrowFurrow - this.currentBrowFurrow) * 0.2;
		this.currentCheekRaise +=  (this.targetCheekRaise - this.currentCheekRaise) * 0.2;
		this.currentLipCornerDepressor +=  (this.targetLipCornerDepressor - this.currentLipCornerDepressor) * 0.2;
		this.currentLipStretch +=  (this.targetLipStretch - this.currentLipStretch) * 0.2;
		this.currentInnerBrowRaise +=  (this.targetInnerBrowRaise - this.currentInnerBrowRaise) * 0.2;
	}

	this.getCam = function() {
		return this.currentCam;
	}

	this.newFace = function(faces) {
		if (this.state == this.STATE.waiting) {
			console.log("RUN");
			new fadeSound("bg", false, 0.5);
			this.state = this.STATE.running;
			// RESET
			this.startTime = + new Date();
			this.emotionsRecord = "";
			this.faceBase64Data = "";
		}
		if (this.state == this.STATE.running ) {
			var face = faces[0];
			this.draw(face);
			if (face.appearance.age != "Unknown") {
				var patt1 = /\d+/g;
				var ages = face.appearance.age.match(patt1)
				if (ages.length == 1)
					this.age = parseInt(ages[0])
				else if (ages.length == 2)
					this.age = (parseInt(ages[0]) + parseInt(ages[1])) / 2
			}
			if (face.appearance.gender != "Unknown") {
				this.age = face.appearance.gender == "Female" ? "woman" : "man"
			}
		}
	}

	this.count  = 0;
	this.hasShow = false;
	this.draw = function(face) {
		this.count++;
		if (this.count % 10 == 0) {
			console.log(face);
			this.hasShow = true;
		}
		this.emotionsRecord += this.analyzeEmotion(face.emotions).maxIndex
		if (this.faceBase64Data == "" && this.getCurrentRunTime() > this.maxTime/2) {
			this.faceBase64Data = this.getFaceBase64();
		}

		this.targetNoiseWrinke = face.expressions.noseWrinkle > 80 ? 100 : 0;
		this.targetBrowRaise = face.expressions.browRaise > 80 ? 100 : 0;
		this.targetEyeWiden = face.expressions.eyeWiden > 80 ? 100 : 0;
		this.targetEyeClosure = face.expressions.eyeClosure > 80 ? 100 : 0;
		this.targetBrowFurrow = face.expressions.browFurrow > 1 ? 100 : 0;
		this.targetCheekRaise = face.expressions.cheekRaise > 80 ? 100 : 0;
		this.targetLipCornerDepressor = face.expressions.lipCornerDepressor > 2 ? 100 : 0;
		//this.currentLipCornerDepressor = Math.log(face.expressions.lipCornerDepressor+1)*40;
		//this.currentLipCornerDepressor = this.currentLipCornerDepressor > 100 ? 100 : this.currentLipCornerDepressor;
		this.targetLipStretch = face.expressions.lipStretch > 50 ? 100 : 0;
		this.targetInnerBrowRaise = face.expressions.innerBrowRaise > 10 ? 100 : 0;

		this.updateFaceRect(face.featurePoints)
		var orient = face['measurements']['orientation'];
		this.targetCam = [orient.pitch, orient.roll, orient.yaw, this.faceRect[0] +  this.faceRect[2] / 2,   this.faceRect[1] +  this.faceRect[3] / 2,   this.faceRect[2]];

		this.context.clearRect(0, 0, 1920, 1080);
		this.drawFaceRect();
		this.drawKeyPoints(face.featurePoints);
		this.drawEmotion(face.emojis.dominantEmoji);

		this.context.save();

		this.context.translate(960, 540);
		this.context.rotate(-this.currentCam[1]*Math.PI/180/5);
		this.context.translate(-960, -540);

		this.drawEyes(face.featurePoints);
		this.drawBrow(face.featurePoints);
		this.drawNose(face.featurePoints);
		this.drawMouse();

		this.context.restore();
	}
	this.analyzeEmotion = function (emotions) {
		var maxVal = 0;
		var sum = 0;
		var result = {
			maxIndex: 0,
			emotionRate: [0, 0, 0, 0, 0, 0, 0]
		};
		var careKey = ['joy', 'sadness', 'disgust', 'anger', 'netural', 'surprise', 'fear']
		for (var key in emotions) {
			sum += emotions[key];
			if (emotions[key] > maxVal && careKey.indexOf(key) != -1) {
				result.maxIndex = careKey.indexOf(key);
				maxVal = emotions[key];
			}
		}
		var i = 0;
		for (var key in emotions) {
			result.emotionRate[i] = emotions[key] / sum;
			i++;
		}
		return result;
	}
	this.drawEyes = function(keyPoints) {
		leftX = (keyPoints["16"].x + keyPoints["17"].x + keyPoints["30"].x + keyPoints["31"].x) / 4;
		leftY = (keyPoints["16"].y + keyPoints["17"].y + keyPoints["30"].y + keyPoints["31"].y) / 4;
		rightX = (keyPoints["18"].x + keyPoints["19"].x + keyPoints["32"].x + keyPoints["33"].x) / 4;
		rightY = (keyPoints["18"].y + keyPoints["19"].y + keyPoints["32"].y + keyPoints["33"].y) / 4;


		if (this.currentEyeClosure > 50) {
			this.context.beginPath();
			this.context.lineJoin="miter";
			this.context.lineWidth=100;
			this.context.strokeStyle="#efefef";
			this.context.moveTo(210,540);
			this.context.lineTo(690,540);
			this.context.moveTo(1210,540);
			this.context.lineTo(1690,540);
			this.context.stroke();
		} else {
			this.context.beginPath();
			this.context.fillStyle="#efefef";
			this.context.arc(450, 540, 240 + this.currentEyeWiden / 5 , 0, 2*Math.PI);
			this.context.arc(1450, 540, 240 + this.currentEyeWiden / 5 , 0, 2*Math.PI);
			this.context.fill();
			this.context.beginPath();
			this.context.fillStyle="#005ec3";
			this.context.arc(450, 540, 145 + this.currentEyeWiden / 4, 0, 2*Math.PI);
			this.context.arc(1450, 540, 145 + this.currentEyeWiden / 4, 0, 2*Math.PI);
			this.context.fill();
			this.context.beginPath();
			this.context.fillStyle="#01437f";
			this.context.arc(450, 540, 120 + this.currentEyeWiden / 3, 0, 2*Math.PI);
			this.context.arc(1450, 540, 120 + this.currentEyeWiden / 3, 0, 2*Math.PI);
			this.context.fill();
		}
	}

	this.drawBrow = function(keyPoints) {
		this.context.beginPath();
		this.context.lineCap="miter";
		this.context.lineJoin="miter";
		this.context.lineWidth=100;
		this.context.strokeStyle="#efefef";

		rate = this.currentEyeClosure / 100.0 - this.currentInnerBrowRaise / 150.0;

		var browFurrow = /*this.currentBrowFurrow*/0;

		this.context.save();
		this.context.translate(browFurrow, 0);
		this.context.moveTo(500 + Math.abs(rate) * 50, 200 - rate*100 - this.currentBrowRaise/3);
		this.context.lineTo(750 - Math.abs(rate) * 50, 200 + rate*100 - this.currentBrowRaise/3);
		this.context.restore();

		this.context.save();
		this.context.translate(-browFurrow, 0);
		this.context.moveTo(1150 + Math.abs(rate) * 50, 200 + rate*100 - this.currentBrowRaise/3);
		this.context.lineTo(1400 - Math.abs(rate) * 50, 200 - rate*100 - this.currentBrowRaise/3);
		this.context.restore();

		this.context.stroke();
	}

	this.drawNose = function(keyPoints) {
		this.context.save();

		this.context.translate(0, -this.currentNoiseWrinke / 2);
		this.context.drawImage(this.noseImg, 900, 356, 120, 198);

		this.context.restore();
	}

	this.drawMouse = function() {
		this.context.lineJoin = "round";
		this.context.lineCap="round";
		this.context.lineWidth = 50;
		this.context.strokeStyle = "#f25c2f";

		this.context.beginPath();
		//this.context.moveTo(800 - this.currentLipStretch,780);
		//this.context.quadraticCurveTo(950, 780 - this.currentLipCornerDepressor*2, 1100 + this.currentLipStretch, 780);
		var radius = 150 + this.currentLipStretch;
		this.context.moveTo(960 - radius,780);
		this.context.quadraticCurveTo(960 - radius, 780 - this.currentLipCornerDepressor*2, 960, 780 - this.currentLipCornerDepressor*2);
		this.context.quadraticCurveTo(960 + radius, 780 - this.currentLipCornerDepressor*2, 960 + radius, 780);
		this.context.stroke();
	}

	this.updateFaceRect = function(keyPoints) {
		var i = 0;
		var minX = 9999, maxX = 0, minY = 9999, maxY = 0;
		for (k in keyPoints) {
			var pos = keyPoints[k];
			minX = pos.x < minX ? pos.x : minX;
			minY = pos.y < minY ? pos.y : minY;
			maxX = pos.x > maxX ? pos.x : maxX;
			maxY = pos.y > maxY ? pos.y : maxY;
		}
		var w = maxX - minX;
		var h = maxY - minY;
		var size = w > h ? w : h;
		this.faceRect = [minX-w/2, minY-h/2, w*2, h*2];
	}
	this.drawFaceRect = function(keyPoints) {
		this.context.strokeStyle="#ff00ff";
		this.context.lineWidth=20;
		this.context.strokeRect(this.faceRect[0], this.faceRect[1], this.faceRect[2], this.faceRect[3]);
	}
	this.drawKeyPoints = function(keyPoints) {
		var i = 0;
		for (k in keyPoints) {
			var pos = keyPoints[k];
			this.context.fillStyle="#00eeaa";
			this.context.font="20px Georgia";
			this.context.fillText("" + i, pos.x, pos.y);
			this.context.fillRect(pos.x, pos.y, 2, 2);
			i += 1;
		}
	}
	this.drawEmotion = function(emotion) {
		this.context.font="100px Georgia";
		this.context.fillText(emotion,1800, 200);
	}
	/*this.getEmotion = function(emotions) {
		maxVal = 0;
		maxKey = "";
		for (k in emotions) {
			if (k == "engagement")
				continue;
			maxKey = emotions[k] > maxVal ? k : maxKey;
			maxVal = emotions[k] > maxVal ? emotions[k] : maxVal;
		}
		return maxKey;
	}*/
	this.init();
}

function initMyAudio() {
    ion.sound({
	    sounds: [
	        {
	            name: "bg",
	    		loop: true
	        }, 
	        {
	            name: "click"
	        }, 
	        {
	            name: "intro"
	        }, 
	        {
	            name: "outro"
	        }, 
	    ],
	    //volume: 0.5,
	    path: "audio/",
	    preload: true,
	    multiplay: true
	});
	console.log("initMyAudio");
	ion.sound.play("bg");
}

function initStats() {
	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	document.getElementById('wrapper').appendChild( stats.domElement );	
}

function initDetector() {
	var divRoot = $("#affdex_elements")[0];
	// The captured frame's width in pixels
	var width = 640;
	// The captured frame's height in pixels
	var height = 480;
	/*
	   Face detector configuration - If not specified, defaults to
	   affdex.FaceDetectorMode.LARGE_FACES
	   affdex.FaceDetectorMode.LARGE_FACES=Faces occupying large portions of the frame
	   affdex.FaceDetectorMode.SMALL_FACES=Faces occupying small portions of the frame
	*/
	var faceMode = affdex.FaceDetectorMode.LARGE_FACES;
	//Construct a CameraDetector and specify the image width / height and face detector mode.
	detector = new affdex.CameraDetector(divRoot, width, height, faceMode);
	detector.addEventListener("onInitializeSuccess", function() {
		console.log("InitializeSuccess");
	});
	detector.addEventListener("onInitializeFailure", function() {
		console.log("onInitializeFailure");

	});
	detector.addEventListener("onImageResultsSuccess", function (faces, image, timestamp) {
		if (faces.length != 0) {
			processor.newFace(faces);
		}
	});

	detector.addEventListener("onImageResultsFailure", function (image, timestamp, err_detail) {
		console.log("ImageResultsFailure");
	});
	detector.addEventListener("onResetSuccess", function() {

	});
	detector.addEventListener("onResetFailure", function() {

	});
	detector.addEventListener("onStopSuccess", function() {
		console.log("onStopSuccess");
	});
	detector.addEventListener("onStopFailure", function() {
		console.log("onStopFailure");
	});

	detector.addEventListener("onWebcamConnectSuccess", function() {
		console.log("I was able to connect to the camera successfully.");
	});

	detector.addEventListener("onWebcamConnectFailure", function() {
		console.log("I've failed to connect to the camera :(");
	});
	detector.detectExpressions.smile = false;
	// Track joy emotion
	detector.detectEmotions.joy = false;

	// Detect person's gender
	detector.detectAppearance.gender = true;

	detector.detectAllExpressions();
	detector.detectAllEmotions();
	detector.detectAllEmojis();
	detector.detectAllAppearance();
}
function fadeSound(name, isOut, time) {
	this.count = 10;
	this.step = 10 / (time / 0.05);
	this.isOut = isOut;
	this.soundName = name;
	this.fadeOut = function() {
		//console.log(this.count);
		if (this.count <= 0) {
			window.clearInterval(this.handler);
			console.log("clear");
		}
		if (this.isOut)
			ion.sound.volume(this.soundName, {volume: this.count / 10});
		else
			ion.sound.volume(this.soundName, {volume: 1 - this.count / 10});
		this.count -= this.step;
	};
	this.handler = setInterval(this.fadeOut.bind(this), 50);
}

function initWebGL() {

	container = document.getElementById( 'container' );

	// CAMERA

	camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.set( 3000, 0, 0 );

	// SCENE

	scene = new THREE.Scene();

	// LIGHTS

	light = new THREE.DirectionalLight( 0x202020 );
	light.position.set( 0.5, 0.5, 1 );
	light2 = new THREE.DirectionalLight( 0x202020 );
	light2.position.set( 0, 0, -1 );
	light3 = new THREE.DirectionalLight( 0x202020 );
	light3.position.set( 1, 0.5, 0.5 );
	scene.add( light );
	scene.add( light2 );
	scene.add( light3 );

	/*pointLight = new THREE.PointLight( 0xff3300 );
	pointLight.position.set( 0, 0, 100 );
	scene.add( pointLight );*/

	ambientLight = new THREE.AmbientLight( 0xaaaaaa , 1);
	scene.add( ambientLight );

	// MATERIALS

	materials = generateMaterials();
	current_material = "colors";

	// MARCHING CUBES

	resolution = 50;
	numBlobs = 7;

	effect = new THREE.MarchingCubes( resolution, materials[ current_material ].m, true, true );
	effect.position.set( 0, 0, 0 );
	effect.scale.set( 700, 700, 700 );

	effect.enableUvs = false;
	effect.enableColors = true;

	scene.add( effect );


	// RENDERER

	renderer = new THREE.WebGLRenderer({ 
		antialias: true,
		preserveDrawingBuffer: true 
	});
	renderer.setClearColor( 0x000000 );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

	renderer.domElement.style.position = "absolute";
	renderer.domElement.style.top = MARGIN + "px";
	renderer.domElement.style.left = "0px";

	container.appendChild( renderer.domElement );

	//

	renderer.gammaInput = true;
	renderer.gammaOutput = true;

	// CONTROLS

	controls = new THREE.OrbitControls( camera, renderer.domElement );


	// EVENTS

	window.addEventListener( 'resize', onWindowResize, false );

}
function onWindowResize( event ) {

	SCREEN_WIDTH = window.innerWidth;
	SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;

	camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
	camera.updateProjectionMatrix();

	renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
	//composer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );


}

function generateMaterials() {

	var materials = {

		"colors" :
		{
			m: new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 1, vertexColors: THREE.VertexColors } ),
			h: 0, s: 0, l: 1
		},

	};

	return materials;

}
function updateCubes( object, time, numblobs, floor, wallx, wallz, emotions ) {

	/*var emotions = [1, 2.86, 2.5, 1.4, 2.55, 3, 36.8];

	
	for (var i = 0 ; i < emotions.length ; i++) {
		sum += emotions[i]
	}*/
	var maxValue = 0, maxIndex = 0;
	for (var i = 0 ; i < emotions.length ; i++) {

		if (emotions[i] > maxValue) {
			maxValue = emotions[i];
			maxIndex  = i;
		}
		if (i == 0) {
			emotions[i] = emotions[i];
		}
		else {
			emotions[i] = emotions[i] + emotions[i-1];
		}

	}
	//console.log("maxIndex", maxIndex);
	var emotionPos = [
		[0.45, 0.55, 0.35], // 开心
		[0.25, 0.35, 0.35], // 伤
		[0.25, 0.55, 0.55], // 厌恶
		[0.45, 0.35, 0.35], // 生气
		[0.45, 0.55, 0.55], // 平
		[0.45, 0.3, 0.55], // 惊
		[0.25, 0.4, 0.55], // 恐
		[0.25, 0.3, 0.55], // 轻蔑
	]
	var cameraPos = [
		[2000, 500, 0], // 开心
		[0, 1500, 1500], // 伤
		[0, 2000, 1500], // 厌恶
		[2000, -500, -1000], // 生气
		[1200, 1200, 1200], // 平
		[1600, 0, 1600], // 惊
		[0, 500, 2000], // 恐
		[0, 800, 2000], // 轻蔑
	]
	camera.position.set( cameraPos[maxIndex][0],cameraPos[maxIndex][1],cameraPos[maxIndex][2]);


	var randomRange = 0.15;

	object.reset();

	// fill the field with some metaballs

	var i, ballx, bally, ballz, subtract, strength;
	subtract = 12;
	strength = 1.2 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 );

	var lookatX = 0,lookatY = 0,lookatZ = 0;
	for ( i = 0; i < /*numblobs*/20; i ++ ) {
		var rand = Math.random()
		subtract = (Math.floor(rand*24)) ;
		strength = subtract/10.0 / ( ( Math.sqrt( numblobs ) - 1 ) / 4 + 1 );

		for (var j = 0 ; j <= emotions.length ; j++) {
			if (emotions[j] > rand) {
				//console.log(j)
				ballx = emotionPos[j][0] + (Math.random()-0.5)*randomRange*2;
				bally = emotionPos[j][1] + (Math.random()-0.5)*randomRange*2;
				ballz = emotionPos[j][2] + (Math.random()-0.5)*randomRange*2;
				lookatX += ballx;
				lookatY += bally;
				lookatZ += ballz;
				break;
			}
		}

		camera.lookAt(new THREE.Vector3(lookatX/emotions.length, lookatY/emotions.length, lookatZ/emotions.length));
		//var time = 99.2;
		/*ballx = Math.sin( i + 1.26 * time * ( 1.03 + 0.5 * Math.cos( 0.21 * i ) ) ) * 0.1+ 0.5;
		bally = Math.abs( Math.cos( i + 1.12 * time * Math.cos( 1.22 + 0.1424 * i ) ) ) * 0.5+0.2; // dip into the floor
		ballz = Math.cos( i + 1.32 * time * 0.1 * Math.sin( ( 0.92 + 0.53 * i ) ) ) * 0.27 + 0.5;
		ballx = 0.6;
		bally = 0.2;
		ballz = 0.2;*/

		object.addBall(ballx, bally, ballz, strength, subtract);

	}

}

function render(emotions) {

	var delta = clock.getDelta();

	time += delta * effectController.speed * 0.5;

	controls.update( delta );

	// marching cubes

	if ( effectController.resolution !== resolution ) {

		resolution = effectController.resolution;
		effect.init( Math.floor( resolution ) );

	}

	if ( effectController.isolation !== effect.isolation ) {

		effect.isolation = effectController.isolation;

	}

	updateCubes( effect, time, effectController.numBlobs, effectController.floor, effectController.wallx, effectController.wallz, emotions );

	effect.material.color.setHSL( effectController.hue, effectController.saturation, effectController.lightness );

	light.position.set( effectController.lx, effectController.ly, effectController.lz );
	light.position.normalize();

	renderer.clear();
	renderer.clear();
	renderer.render( scene, camera );

}
function animate() {
	requestAnimationFrame( animate );
	processor.update();
	stats.update();
}
function init() {
	processor = new Processor();
	initMyAudio();
	initWebGL();
	//render(1);
	initDetector();
	initStats();
	detector.start();
	//detector.stop();
	$("body").click(function() {
		console.log("click");
		ion.sound.play("bg");
	})
	$(window).bind('beforeunload', function(){
		if(detector != null){
			detector.stop();
			console.log("stop");
		}
	});
}
init();
animate();