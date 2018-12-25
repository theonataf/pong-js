var canvas = document.getElementById("pong");
var ctx = canvas.getContext("2d");
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
window.addEventListener('keydown', function(event) {
		event.preventDefault();
		code = event.keyCode;
		// if (code == 37) { // left
		// 	console.log('left');
		// } else if (code == 39) { // right
		// 	console.log('right');
		// } else if (code == 38) { // up
		// 	console.log('up');
		// } else if (code == 40) { // down
		// 	console.log('down');
		// }
});

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


var Ball = {
	x: positions.width_center,
	y: positions.height - 80,
	vx: -6,
	vy: -6,
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
				&&((this.x + this.vx + this.radius)< (Bar.x + Bar.width)))) {
			this.vy = -this.vy;
			console.log('touched');
		};
	},
	isTouchingBorder: function() {
		if ((Ball.y + Ball.vy > positions.height - Ball.radius) || (Ball.y + Ball.vy < Ball.radius)) {
		Ball.vy = -Ball.vy;
		}
		if ((Ball.x + Ball.vx > positions.width - Ball.radius) || (Ball.x + Ball.vx < Ball.radius)) {
		Ball.vx = -Ball.vx;
		}
	},
};

var Bar = {
	x: positions.width_center - 150,
	y: positions.height - 55,
	vx: 10,
	thickness: 25,
	width: 300,
	color: 'red',
	drawBar: function(){
		ctx.beginPath();
		ctx.rect(this.x, this.y, this.width, this.thickness);
		ctx.closePath();
		ctx.fillStyle = this.color;
		ctx.fill();
	},
	isTouchingBorder: function() {
		if ((Bar.x + Bar.vx > positions.width - Bar.width) || (Bar.x + Bar.vx < 0) ) {
			Bar.vx = -Bar.vx;
		};
	},
	motion: function() {
		// must use 'keydown' for arrow keys
		if (code == 37) {
			if(this.vx > 0){
				this.vx = -this.vx;
			}
			if(this.vx < 0){
				this.vx = this.vx;
			}
		}
		if (code == 39) {
			if(this.vx < 0){
				this.vx = -this.vx;
			}
			if(this.vx > 0){
				this.vx = this.vx;
			}
		}
	},
};

function play() {
	ctx.clearRect(0,0, positions.width, positions.height);
	grid();
	Ball.drawBall();
	Bar.drawBar();
	Bar.motion();
	Bar.isTouchingBorder();
	Ball.isTouchingBorder();
	Ball.isTouchingBar();
	Ball.x += Ball.vx;
	Ball.y += Ball.vy;
	Bar.x += Bar.vx;
	raf = window.requestAnimationFrame(play);
}


canvas.addEventListener('mouseover', function(event) {
	raf = window.requestAnimationFrame(play);
})

canvas.addEventListener('mouseout', function(event) {
  window.cancelAnimationFrame(raf);
});

Ball.drawBall();
Bar.drawBar();



















