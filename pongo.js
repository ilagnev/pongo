

class Pos 
{
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
}

class Rect 
{
	constructor(width, height) {
		this.pos = new Pos();
		this.size = new Pos(width, height);
	}
}

class Ball extends Rect 
{
	constructor() {
		super(10, 10);
		this.vel = new Pos();
	}
}

var ball = new Ball();
ball.pos.x = 111;
ball.pos.y = 111;
console.log(ball);

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

context.fillStyle = '#551A8B';
context.fillRect(0, 0, canvas.width, canvas.height);

context.fillStyle = '#fff';
context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);