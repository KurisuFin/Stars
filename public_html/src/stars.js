var ctx = null;
var canvasWidth = null;
var canvasHeight = null;
var sectionBasePositions = null;

var size = 156;
var tilt = 28;

var aisleAmount = 5;

var track = 500;


function initSectionBasePositions() {
	sectionBasePositions = {};
	for (i = 0; i < aisleAmount; ++i) {
		degrees = (360 * i / aisleAmount) % 360;
		x = canvasWidth / 2 + size * Math.cos(toRadians(degrees - 90));
		y = canvasHeight / 2 + size * Math.sin(toRadians(degrees - 90));
		sectionBasePositions[i] = {x: x, y: y};
	}
}




function calculateCoordinates(distance) {
	transition = track / aisleAmount;
	section = parseInt(distance / transition);
	pos = sectionBasePositions[section];
	distanceFromPos = distance % transition;
	degrees = (360 * section / aisleAmount) % 360;
	
	x = pos.x + distanceFromPos * -Math.cos(toRadians(degrees - 90 - tilt));
	y = pos.y + distanceFromPos * -Math.sin(toRadians(degrees - 90 - tilt));
	return {x: x, y: y};
}


function init() {
	canvas = $("canvas")[0];
	ctx = $("canvas")[0].getContext("2d");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	initSectionBasePositions();
}


function drawLogo() {
	var img = $("#logo")[0];
	dimension = 400;
	x = canvasWidth / 2 - dimension / 2;
	y = canvasHeight / 2 - dimension / 2;
	ctx.drawImage(img, x, y, dimension, dimension);
}



function drawCircle(distance, radius) {
	position = calculateCoordinates(distance);
//	ctx.beginPath();
//	ctx.arc(90, 55, 30, 0, 2 * Math.PI);
//	ctx.stroke();
	ctx.beginPath();
	ctx.arc(position.x, position.y, radius, 0, 2*Math.PI);
	ctx.stroke();
}


$(document).ready(function () {
	init();
	drawLogo();
	
	motor.init();
});



function drawDotLines() {
	for (i = 0; i < track; ++i) {
		radius = 0.001;
//		if (i % 19 === 0) {radius = 5;}
		drawCircle(i + 0.001, radius);
	}
}



motor = {
	tickCount: 0,
	
	init: function() {
		motor.tick();
	},
	logic: function() {
		ball.move(3);
	},
	render: function() {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		drawLogo();
		drawDotLines();
		ball.draw();
	},
	tick: function() {
		++motor.tickCount;
		motor.logic();
		motor.render();
		requestAnimFrame(motor.tick);
	}
};



var ball = {
	position: 0,
	radius: 3,
	
	move: function(speed) {
		ball.position += speed;
		ball.position %= track;
	},
	draw: function() {
		drawCircle(ball.position, ball.radius);
	}
};





toDegree = function(radians) {
  return radians * (180 / Math.PI);
};

toRadians = function(degrees) {
  return degrees * (Math.PI / 180);
};




window.requestAnimFrame = (function () {
	return	window.requestAnimationFrame				|| 
					window.webkitRequestAnimationFrame	|| 
					window.mozRequestAnimationFrame			|| 
					window.oRequestAnimationFrame				|| 
					window.msRequestAnimationFrame			||
					function(callback) {
						window.setTimeout(callback, 1000/60);
					};
					}
)();



function testi() {
	ctx.beginPath();

	x1 = 400;
	y1 = 100;

	x2 = x1 + 30;
	y2 = y1;

	cp1x = 410;
	cp1y = 60;

	cp2x = x2 - (cp1x - x1);
	cp2y = cp1y;

	ctx.moveTo(x1, y1);
	ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);

	ctx.lineWidth = 4;
	ctx.strokeStyle = 'blue';
	ctx.stroke();
}