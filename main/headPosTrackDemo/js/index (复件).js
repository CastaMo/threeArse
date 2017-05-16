var isUpload = false;
var vid = document.getElementById('videoel');
var overlay = document.getElementById('main_canvas');
var overlayCC = overlay.getContext('2d');
var tempCanvas = document.getElementById('temp_canvas');
var tempCC = tempCanvas.getContext('2d');

var ctrack = new clm.tracker({useWebGL : true});
ctrack.init(pModel);

stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.top = '0px';
document.getElementById('wrapper').appendChild( stats.domElement );

function enablestart() {
	var startbutton = document.getElementById('startbutton');
	startbutton.value = "start";
	startbutton.disabled = null;
}

navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.msURL || window.mozURL;

// check for camerasupport
if (navigator.getUserMedia) {

	navigator.getUserMedia({video:true}, function( stream ) {
		if (vid.mozCaptureStream) {
			vid.mozSrcObject = stream;
		} else {
			vid.src = (window.URL && window.URL.createObjectURL(stream)) || stream;
		}
		vid.play();
	}, function() {
		alert("There was some problem trying to fetch video from your webcam, using a fallback video instead.");
	});

} else {

	insertAltVideo(vid);
	document.getElementById('gum').className = "hide";
	document.getElementById('nogum').className = "nohide";
	alert("Your browser does not seem to support getUserMedia, using a fallback video instead.");

}

vid.addEventListener('canplay', enablestart, false);

function startVideo() {
	// start video
	vid.play();
	// start tracking
	ctrack.start(vid);
	// start loop to draw face
	drawLoop();
}

function uploadFace() {
	isUpload = !isUpload;
	var uploadbutton = document.getElementById('uploadbutton');
	if (isUpload) {
		uploadbutton.value = "stop upload";
	} else {
		uploadbutton.value = "upload";
	}
}

function drawLoop() {
	
	stats.update();
	requestAnimFrame(drawLoop);
	//setTimeout(drawLoop, 100);
	//psrElement.innerHTML = "score :" + ctrack.getScore().toFixed(4);
	if (ctrack.getCurrentPosition()) {
		if (ctrack.getScore() <0.5)
			return
		overlayCC.clearRect(0, 0, 1920, 1080);
		var positions = ctrack.getCurrentPosition();
		for (var i = 0 ; i < positions.length ; i++) {
			var pos = positions[i];
			overlayCC.font="20px Georgia";
			overlayCC.fillText("" + i,pos[0]*1920/640,pos[1]*1080/480);
			overlayCC.fillRect(pos[0]*1920/640,pos[1]*1080/480,1,1);
		}
		var rect = face.getRect(positions);
		overlayCC.strokeRect(rect[0], rect[1], rect[2], rect[3]);
		//  use face 
		tempCC.drawImage(vid,  rect[0]-10, rect[1]-10, rect[2]+20, rect[2]+20, 0, 0, 256, 256);
		if (isUpload) {
			var base64Data = tempCanvas.toDataURL("image/jpeg")
			$.ajax({
			  type: 'POST',
			  url: "/face",
			  data: {
			  	face: base64Data,
			  	emotion: getRadioVal( document.getElementById('emotion_wrapper'), 'emotion' )
			  },
			  success: function(data) {
			  	radio = getRadio(document.getElementById('emotion_wrapper'), 'emotion' );
			  	radio.nextSibling.innerHTML = radio.value + " "  + data;
			  }
			});
		}
		ctrack.draw(overlay);
	}
}
function getRadioVal(form, name) {
    
    return getRadio(form, name).value; // return value of checked radio or undefined if none checked
}
function getRadio(form, name) {
    var radios = form.elements[name];
    
    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            return radios[i]
        }
    }
}

// update stats on every iteration
document.addEventListener('clmtrackrIteration', function(event) {
}, false);

var Face = function() {
	this.isUpload = false;
	this.lastAngle = 0;
	this.lastFacePos = null;
	this.faceImg = new Image();  
    this.faceImg.onload =function(){
    }  
    this.faceImg.src = "img/face.png";

	this.drawFace = function(positions) {
		/*if (this.isJumpFrame(positions)) {
			positions = this.lastFacePos;
		}*/
		leftEyePos = positions[27];
		rightEyePos = positions[32];
		angle = Math.atan((leftEyePos[1] - rightEyePos[1]) / (leftEyePos[0] - rightEyePos[0]));
		angle = this.lastAngle + (angle - this.lastAngle)*0.1;

		overlayCC.translate(1920/2,1080/2);
		overlayCC.rotate(-angle/4);
		overlayCC.drawImage(this.faceImg, -1920/2, -1080/2, 1920, 1080);
		overlayCC.rotate(angle/4);
		overlayCC.translate(-1920/2,-1080/2);

		this.lastFacePos = positions;
		this.lastAngle = angle;
		/*overlayCC.fillStyle="#fff";
		overlayCC.arc(100,75,50,0,2*Math.PI);
		overlayCC.fillStyle="#005ec3";
		overlayCC.arc(100,75,50,0,2*Math.PI);
		overlayCC.fillStyle="#01437f";
		overlayCC.arc(100,75,50,0,2*Math.PI);*/
	}
	this.isJumpFrame = function(positions) {
		if (this.lastFacePos == null)
			return false;
		lastFaceX = (this.lastFacePos[0][0] + this.lastFacePos[7][0] + this.lastFacePos[14][0])/3;
		lastFaceY = (this.lastFacePos[0][1] + this.lastFacePos[7][1] + this.lastFacePos[14][1])/3;
		currentFaceX = (positions[0][0] + positions[7][0] + positions[14][0])/3;
		currentFaceY = (positions[0][1] + positions[7][1] + positions[14][1])/3;
		if (this.dist([lastFaceX, lastFaceY], [currentFaceX, currentFaceY]) > 100)
			return true;
	}
	this.dist = function(point1, point2) {
		var x = point1[0] - point2[0];
		var y = point1[1] - point2[1];
		return Math.sqrt(x*x + y*y);
	}
	this.getRect = function(positions) {
		indexs = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
		var xmin = 9999, xmax = 0, ymin = 9999, ymax = 0;
		for (var i = 0 ; i < indexs.length ; i++) {
			var index = indexs[i];
			if (positions[index][0] < xmin)
				xmin = positions[index][0];
			if (positions[index][0] > xmax)
				xmax = positions[index][0];
			if (positions[index][1] < ymin)
				ymin = positions[index][1];
			if (positions[index][1] > ymax)
				ymax = positions[index][1];
		}
		return [xmin, ymin, xmax - xmin, ymax - ymin];
	}
	this.upload = function() {
	}
};
var face = new Face();