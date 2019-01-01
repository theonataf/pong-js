var canvas = document.getElementById("pong");
var ctx = canvas.getContext("2d");
wholeBrick = new Image();
touchedBrick = new Image();
wholeBrick.src = 'images/whole_brick.png';
touchedBrick.src = 'images/touched_brick.png';
var raf;


var scale = 2;
canvas.width = 1280 * scale;
canvas.height = 739 * scale;

const positions = {
	width: canvas.width,
	height: canvas.height,
	width_center: canvas.width /2,
	height_center: canvas.height /2,
	find_center(){
		ctx.translate(this.width_center, this.height_center);
	},
	replace_center() {
		ctx.translate(-this.width_center, -this.height_center);
	}
}
var code;
var release;
window.addEventListener('keydown', function(event) {
		event.preventDefault();
		code = event.keyCode;
		if (code == 37) { // left
			console.log('left');
			Bar.direction = 'left';
			Bar.leftKeyDown = true;
		} else if (code == 39) { // right
			console.log('right');
			Bar.direction = 'right';
			Bar.rightKeyDown = true;
		} else if (code == 38) { // up
			console.log('up');
		} else if (code == 40) { // down
			console.log('down');
		}
});
window.addEventListener('keyup', function(event) {
	event.preventDefault();
	release = event.keyCode;
	if (release == 37) { // left
			console.log('leftup');
			Bar.leftKeyDown = false;
		} else if (release == 39) { // right
			console.log('rightup');
			Bar.rightKeyDown = false;
		} else if (release == 38) { // up
			console.log('upup');
		} else if (release == 40) { // down
			console.log('downup');
		}
})

function grid() {
	
	for(var i=0; i<canvas.width; i+=35){
		ctx.beginPath();
		ctx.moveTo(i,0);
		ctx.lineTo(i,canvas.height);
		ctx.stroke();
		ctx.font = '20px serif';
  		ctx.fillText(i/35, i, 30);
	}

	for (var i = 0; i<canvas.height; i+=35) {
		ctx.beginPath();
		ctx.moveTo(0,i);
		ctx.lineTo(canvas.width,i);
		ctx.stroke();
		ctx.font = '20px serif';
  		ctx.fillText(i/35, 5, i+32);
	}

}
// arc(x,y,radius, start angle, end angle, anticlockwise)

var Game = {
	status: 'on',
};

function Brick() {
	this.x= null; //14*35
	this.y= null; //5*35
	this.spaceBetween= 3*35;
	this.width= 3*35;
	this.height= 2*35;
	this.brickType= null;
	this.newBrick= wholeBrick;
	this.damagedBrick = touchedBrick;
	this.touched = 0;
	this.drawBrick= function() {
		if (this.touched == 0){
			ctx.drawImage(this.newBrick, this.x, this.y, this.width, this.height);
		} else if (this.touched == 1){
			ctx.drawImage(this.damagedBrick, this.x, this.y, this.width, this.height);
		};
	};

};

var bricks = [];


var Ball = {
	x: positions.width_center,
	y: positions.height - 80,
	vx: -10,
	vy: -10,
	radius: 25,
	color:'blue',
	drawBall: function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	},
	isTouchingBar: function() {
		if (((this.y + this.vy) >= (Bar.y - this.radius))
				&&(((this.x + this.vx - this.radius) > Bar.x)
				&&((this.x + this.vx + this.radius)< (Bar.x + Bar.width/2)))) {
			this.vy = -10;
			this.vx = -10;
			console.log('touched');
		};
		if (((this.y + this.vy) >= (Bar.y - this.radius))
				&&(((this.x + this.vx - this.radius) > Bar.x)
				&&((this.x + this.vx + this.radius)> (Bar.x + Bar.width/2)))) {
			this.vy = -10;
			this.vx = 10;
			console.log('touched');
		};
	},
	isTouchingBorder: function() {
		if ((Ball.y + Ball.vy < Ball.radius)) {
		Ball.vy = -Ball.vy;
		};
		if ((Ball.x + Ball.vx > positions.width - Ball.radius) || (Ball.x + Ball.vx < Ball.radius)) {
		Ball.vx = -Ball.vx;
		}
		if (Ball.y + Ball.vy > positions.height - Ball.radius) {
			Game.status = 'gameover';
			Ball.vx = 0;
			Ball.vy = 0;
			Bar.vx = 0;
			Bar.speed = 0;
			console.log('gameover');
			alert('gameover');
		}
	},
	isTouchingBottom: function(brick) {
		var doesIt = false;
		if (((this.x + this.vx + this.radius) > brick.x)
			&& ((this.x + this.vx + this.radius) < (brick.x + brick.width))
			&& ((this.y + this.vy - this.radius) < (brick.y + brick.height/2))
			&& ((this.y + this.vy - this.radius) > (brick.y))) {
			doesIt = true;
		}
		return doesIt;
	},
	isThouchingTop: function(brick) {
		var doesIt = false;
		if (((this.x + this.vx + this.radius) > brick.x)
			&& ((this.x + this.vx + this.radius) < (brick.x + brick.width))
			&& ((this.y + this.vy + this.radius) > (brick.y - brick.height/2))
			&& ((this.y + this.vy + this.radius) < (brick.y))) {
			doesIt = true;
		}
		return doesIt;
	},
	isTouchingLeftBorder: function(brick) {
		var doesIt = false;
		if (((this.y + this.vy + this.radius) > (brick.y - brick.height/2))
			&& ((this.y + this.vy + this.radius) < (brick.y + brick.height/2))
			&& ((this.x + this.vx + this.radius) > (brick.x))
			&& ((this.x + this.vx + this.radius) < (brick.x + brick.width/2))) {
			doesIt = true;
		}
		return doesIt;
	},
	isTouchingRightBorder: function(brick) {
		var doesIt = false;
		if (((this.y + this.vy - this.radius) > (brick.y - brick.height/2))
			&& ((this.y + this.vy - this.radius) < (brick.y + brick.height/2))
			&& ((this.x + this.vx - this.radius) < (brick.x + brick.width))
			&& ((this.x + this.vx - this.radius) > (brick.x + brick.width/2))) {
			doesIt = true;
		}
		return doesIt;
	},
	isTouchingBrick: function() {
		for (var i = 0; i < bricks.length; i++) {
			var brick = bricks[i];
			if (this.isThouchingTop(brick) || this.isTouchingBottom(brick)) {
				this.vy= -this.vy;
				console.log('touched');
				console.log(brick.touched);
				brick.touched += 1;
				console.log(brick.touched)
				if (brick.touched > 1) {
					bricks.splice(i, 1);
				}
			};
			if (this.isTouchingLeftBorder(brick) || this.isTouchingRightBorder(brick)) {
				this.vx = -this.vx;
				brick.touched += 1;
				if (brick.touched > 1) {
					bricks.splice(i, 1);
					console.log('hello');
				};
			};
	
		}
	},

	
};

var Bar = {
	x: positions.width_center - 150,
	y: positions.height - 55,
	vx: 10,
	speed: 17,
	thickness: 25,
	width: 300,
	color: 'red',
	direction: null,
	leftKeyDown: false,
	rightKeyDown: false,
	drawBar: function(){
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.thickness);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	},
	isTouchingBorder: function() {
		if ((this.x + this.vx > positions.width - this.width) || (this.x + this.vx < 0) ) {
			this.vx = 0;
		};
	},
	motion: function() {
		// must use 'keydown' for arrow keys
		// tomorrow !!!! on 'keyup' stop the bar 
		this.isTouchingBorder();
		if (this.direction == 'left' && this.leftKeyDown == true) {
			this.vx = -this.speed;
			Bar.x += Bar.vx;
		}
		this.isTouchingBorder();
		if (this.direction == 'right' && this.rightKeyDown == true) {
			this.vx = this.speed;
			Bar.x += Bar.vx;
		}

	},
};

// il faudrait avoir un array de position où y'a des brick pour pouvoir bien les dessiner à chaque fois
// faire une array avec une boucle et au fur et à mesure faire sauter des positions

function play() {
	ctx.clearRect(0,0, positions.width, positions.height);
	grid();
	Ball.drawBall();
	Bar.drawBar();
	drawBrickArray();
	Bar.isTouchingBorder();
	Bar.motion();
	Ball.isTouchingBorder();
	Ball.isTouchingBar();
	Ball.isTouchingBrick();
	Ball.x += Ball.vx;
	Ball.y += Ball.vy;
	window.requestAnimationFrame(play);
}

function drawBricks(startX, startY, rows, columns) {

	for (var i = 0; i<rows ;i++ ) {
		for(var j=0; j<columns; j++){
			var brick = new Brick();
			brick.x = startX - brick.width + (j * brick.spaceBetween);
			brick.y = startY + brick.height + (i * brick.height);
			brick.drawBrick(brick.newBrick);
			bricks.push(brick);
		}
	}
}

function drawBrickArray() {
	var brick = new Brick()
	for (var i=0; i< bricks.length; i ++) {
		brick = bricks[i];
		brick.drawBrick();
	}
}
Ball.drawBall();
Bar.drawBar();
drawBricks(5*35, 6*35, 4, 20 );


if (Game.status == 'gameover') {
	console.log('score');
}
play();






















