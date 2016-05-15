var ctx = null;
var canvasWidth = null;
var canvasHeight = null;
var sectionBasePositions = null;

var size = 156;
var tilt = 27;

var aisleAmount = 5;

var track = 0;
var defaultColor = "#000000";



var star = {
	x: 500,
	y: 240,
	size: 156,
	getCenterPosition: function () {
		return {x: star.x, y: star.y};
	},
	drawStuff: function () {
		drawLogo();
		drawDotLines();
		drawSectionBasePositionts();
		drawCenterCircle();

		drawLineFromCentreToAisle(0);
		drawLineFromCentreToAisle(1);

		drawL(0);
		d();
	}
};



function d() {
	var a = sectionBasePositions[0];
	var b = sectionBasePositions[1];

	var x = Math.abs(a.x - b.x);
	var y = Math.abs(a.y - b.y);
	var l = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
	// console.log(x);

	var posX = x / 2 + star.x;
	var posY = y / 2 + sectionBasePositions[0].y;
	var pos = {x: posX, y: posY};
	drawCircle(posX, posY, 3);

	drawLine(a, b, "yellow");

	drawLine(pos, star.getCenterPosition(), "blue");
}



function drawL(i) {
	i %= aisleAmount;
	var pos = sectionBasePositions[i];

	var degrees = 360 / aisleAmount;
	var length = Math.cos(toRadians(72 - 90)) * star.size;

	var x = pos.x + length * Math.cos(toRadians(degrees));
	var y = pos.y + length * Math.sin(toRadians(degrees));

	var p = {x: x, y: y};
	drawLine(pos, p, "#FF9999");
}


function initTrack() {
	track = 400;
}


function initSectionBasePositions() {
	sectionBasePositions = {};
	for (var i = 0; i < aisleAmount; ++i) {
		var degrees = (360 * i / aisleAmount) % 360;
		x = star.x + star.size * Math.cos(toRadians(degrees - 90));
		y = star.y + star.size * Math.sin(toRadians(degrees - 90));
		sectionBasePositions[i] = {x: x, y: y};
	}
}


function calculateCoordinates(distance) {
	var transition = track / aisleAmount;
	var section = parseInt(distance / transition);
	var pos = sectionBasePositions[section];
	var distanceFromPos = distance % transition;
	var degrees = (360 * section / aisleAmount) % 360;
	var correction = 90;

	var x = pos.x + distanceFromPos * -Math.cos(toRadians(degrees - correction - tilt));
	var y = pos.y + distanceFromPos * -Math.sin(toRadians(degrees - correction - tilt));
	return {x: x, y: y};
}


$(document).ready(function () {
	init();
	drawLogo();
	motor.init();
});



function drawDotLines() {
	for (i = 0; i < track; ++i) {
		var radius = 0.001;
		drawCircleOnPath(i + 0.001, radius);
	}
}


function drawSectionBasePositionts() {
	for (i in sectionBasePositions) {
		var pos = sectionBasePositions[i];
		drawCircle(pos.x, pos.y, 5);
	}
}


motor = {
	tickCount: 0,
	init: function () {
		motor.tick();
	},
	logic: function () {
		ball.move(0.5);
	},
	render: function () {
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
		star.drawStuff();
		ball.draw();
	},
	tick: function () {
		++motor.tickCount;
		motor.logic();
		motor.render();
		requestAnimFrame(motor.tick);
	}
};







function init() {
	var canvas = $("canvas")[0];
	ctx = $("canvas")[0].getContext("2d");
	canvasWidth = canvas.width;
	canvasHeight = canvas.height;
	initTrack();
	initSectionBasePositions();
}


function drawLogo() {
	var img = $("#logo")[0];
	var dimension = size * 2.72;
	var x = star.x - dimension / 2;
	var y = star.y - dimension / 2;
	ctx.drawImage(img, x, y, dimension, dimension);
}


function drawCenterCircle() {
	drawCircle(star.x, star.y, 1);
	drawCircle(star.x, star.y, 10);
}



function drawCircleOnPath(distance, radius) {
	var position = calculateCoordinates(distance);
	drawCircle(position.x, position.y, radius);
}


function drawCircle(x, y, radius, color) {
	ctx.strokeStyle = color || defaultColor;
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, 2 * Math.PI);
	ctx.stroke();
}


function drawLineFromCentreToAisle(i) {
	i %= aisleAmount;
	drawLine(star.getCenterPosition(), sectionBasePositions[i], "#FF0000");

}


function drawLine(from, to, color) {
	ctx.strokeStyle = color || defaultColor;
	ctx.beginPath();
	ctx.moveTo(from.x, from.y);
	ctx.lineTo(to.x, to.y);
	ctx.stroke();
}










var ball = {
	position: 0,
	radius: 3,
	move: function (speed) {
		ball.position += speed;
		ball.position %= track;
	},
	draw: function () {
		drawCircleOnPath(ball.position, ball.radius);
	}
};





toDegree = function (radians) {
	return radians * (180 / Math.PI);
};

toRadians = function (degrees) {
	return degrees * (Math.PI / 180);
};




window.requestAnimFrame = (function () {
	return	window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function (callback) {
				window.setTimeout(callback, 1000 / 60);
			};
}
)();
