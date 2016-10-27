

class Pos 
{
	constructor(x = 0, y = 0) {
		this.x = x;
		this.y = y;
	}
}

class Rect 
{
	constructor(offsetLeft, offsetTop, width, height) {
		this.pos = new Pos(offsetLeft, offsetTop);
		this.size = new Pos(width, height);
	}
}

class Ball extends Rect 
{
	constructor() {
		super(
			(canvas.width / 2) -5, 
			(canvas.height / 2) -5,
			10, 
			10
		);
		// velocity: pixels per sec
		this.vel = {x:0, y:0};
	}
}

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

var ball = new Ball();
// set ball velocity in pixels per sec
ball.vel.x = 333 * (Math.random() > .5 ? 1 : -1);
ball.vel.y = 333 * (Math.random() > .5 ? 1: -1);
console.log(ball);

var prevUpdatedTime;
function frameUpdated(ms) {
	if (prevUpdatedTime) {
		// delta between frames
		update((ms - prevUpdatedTime) / 1000);
	}
	prevUpdatedTime = ms;
	requestAnimationFrame(frameUpdated);
}

function update(delta) {
	// detect collision with walls and change direction of velocity
	ball.vel.x = ball.pos.x + ball.size.x > canvas.width || ball.pos.x < 0 
		? -ball.vel.x 
		: ball.vel.x;
		
	ball.vel.y = ball.pos.y + ball.size.y > canvas.height || ball.pos.y < 0
		? -ball.vel.y 
		: ball.vel.y;

	// change ball position in time with deltatime
	ball.pos.x += ball.vel.x * delta;
	ball.pos.y += ball.vel.y * delta;

	// draw background
	context.fillStyle = '#551A8B';
	context.fillRect(0, 0, canvas.width, canvas.height);

	// draw ball
	context.fillStyle = '#fff';
	context.fillRect(ball.pos.x, ball.pos.y, ball.size.x, ball.size.y);
}

// run and slide
frameUpdated();