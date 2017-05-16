var processor, stats, detector;
var isStart = false;

var container, stats;
var camera, scene, renderer, particles, geometry, materials = [], parameters, i, h, color, size;
var mouseX = 0, mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
var Processor = function(canvasid) {
	this.canvas = document.getElementById("mycanvas");
	this.context = this.canvas.getContext('2d');
	this.currentCam = [0, 0, 0, 0, 0, 0];
	this.targetCam = [0, 0, 0, 0, 0, 0];

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
	this.update = function() {
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
	this.hasShow = false;
	this.draw = function(faces) {
		var face = faces[0];
		if (!this.hasShow) {
			console.log(face);
			this.hasShow = true;
		}
		//console.log(face.expressions.innerBrowRaise)
		//console.log(this.getEmotion(face.emotions));
		//console.log(face.emotions);

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
		this.faceRect = [minX, minY, maxX - minX, maxY - minY];
	}
	this.drawFaceRect = function(keyPoints) {
		
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
	this.getEmotion = function(emotions) {
		maxVal = 0;
		maxKey = "";
		for (k in emotions) {
			if (k == "engagement")
				continue;
			maxKey = emotions[k] > maxVal ? k : maxKey;
			maxVal = emotions[k] > maxVal ? emotions[k] : maxVal;
		}
		return maxKey;
	}
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
		//console.log(faces);
		if (faces.length != 0) {
			processor.draw(faces);
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
	detector.detectExpressions.smile = true;
	// Track joy emotion
	detector.detectEmotions.joy = true;

	// Detect person's gender
	detector.detectAppearance.gender = true;

	detector.detectAllExpressions();
	detector.detectAllEmotions();
	detector.detectAllEmojis();
	detector.detectAllAppearance();
}
function startVideo() {
	if (isStart) {
		detector.stop();
		var isStart = false;
		document.getElementById("mybutton").value = "start";
	}
	else {
		detector.start();
		var isStart = true;
		document.getElementById("mybutton").value = "stop";
	}
}

function initWEBGL()  {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 1000;
	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0x000000, 0.0007 );
	geometry = new THREE.Geometry();
	for ( i = 0; i < 20000; i ++ ) {
		var vertex = new THREE.Vector3();
		vertex.x = Math.random() * 2000 - 1000;
		vertex.y = Math.random() * 2000 - 1000;
		vertex.z = Math.random() * 2000 - 1000;
		geometry.vertices.push( vertex );
	}
	parameters = [
		[ [1, 1, 0.5], 5 ],
		[ [0.95, 1, 0.5], 4 ],
		[ [0.90, 1, 0.5], 3 ],
		[ [0.85, 1, 0.5], 2 ],
		[ [0.80, 1, 0.5], 1 ]
	];
	for ( i = 0; i < parameters.length; i ++ ) {
		color = parameters[i][0];
		size  = parameters[i][1];
		materials[i] = new THREE.PointsMaterial( { size: size } );
		particles = new THREE.Points( geometry, materials[i] );
		particles.rotation.x = Math.random() * 6;
		particles.rotation.y = Math.random() * 6;
		particles.rotation.z = Math.random() * 6;
		scene.add( particles );
	}
	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
}
function animate() {
	requestAnimationFrame( animate );
	processor.update();
	render();
	stats.update();
}
function render() {
	var time = Date.now() * 0.00005;
	cam = processor.getCam();
	camera.rotation.x = cam[0] / 180 * Math.PI;
	camera.rotation.y = -cam[2] / 180 * Math.PI;
	camera.rotation.z = cam[1] / 180 * Math.PI;
	camera.position.x = -cam[3]*2 + 640;
	camera.position.y = -cam[4]*2 + 480;
	camera.position.z = 700 - cam[5]*2;
	//console.log(camera.position)
	for ( i = 0; i < scene.children.length; i ++ ) {
		var object = scene.children[ i ];
		if ( object instanceof THREE.Points ) {
			object.rotation.y = time * ( i < 4 ? i + 1 : - ( i + 1 ) );
		}
	}
	/*
	camera.position.x += ( mouseX - camera.position.x ) * 0.05;
	camera.position.y += ( - mouseY - camera.position.y ) * 0.05;
	camera.lookAt( scene.position );
	for ( i = 0; i < materials.length; i ++ ) {
		color = parameters[i][0];
		h = ( 360 * ( color[0] + time ) % 360 ) / 360;
		materials[i].color.setHSL( h, color[1], color[2] );
	}*/
	renderer.render( scene, camera );
}
function init() {
	processor = new Processor();
	initDetector();
	initStats();
	initWEBGL();
	detector.start();
}
init();
animate();