

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

class Player extends Rect
{
		constructor() {
		super(0, 0, 20, 100);
	}
}

class Pongo 
{
	constructor(canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext('2d');

		// create ball with velocity
		this.ball = new Ball();
		this.ball.vel.x = 333 * (Math.random() > .5 ? 1 : -1);
		this.ball.vel.y = 333 * (Math.random() > .5 ? 1: -1);
		console.log(this.ball);

		// create players
		this.players = [
			new Player(),
			new Player()
		];
		this.players[1].pos.x = this._canvas.width - this.players[1].size.x;

		var prevUpdatedTime;
		function frameUpdated(ms) {
			if (prevUpdatedTime) {
				// delta between frames
				this.update((ms - prevUpdatedTime) / 1000);
			}
			prevUpdatedTime = ms;
			requestAnimationFrame(frameUpdated.bind(this));
		}
		frameUpdated.call(this);
	}

	update(delta) {
		// detect collision with walls and change direction of velocity
		this.ball.vel.x = this.ball.pos.x + this.ball.size.x > this._canvas.width || this.ball.pos.x < 0 
			? -this.ball.vel.x 
			: this.ball.vel.x;
			
		this.ball.vel.y = this.ball.pos.y + this.ball.size.y > this._canvas.height || this.ball.pos.y < 0
			? -this.ball.vel.y 
			: this.ball.vel.y;

		// change this.ball position in time with deltatime
		this.ball.pos.x += this.ball.vel.x * delta;
		this.ball.pos.y += this.ball.vel.y * delta;

		this.draw();
	}

	draw() {
		// draw background
		this._context.fillStyle = '#551A8B';
		this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);

		// draw this.ball
		this.drawRect(this.ball);

		// draw players
		this.drawRect(this.players[0]);
		this.drawRect(this.players[1]);
	}

	drawRect(rect, color = '#fff') {
		this._context.fillStyle = color;
		this._context.fillRect(
			rect.pos.x, rect.pos.y, 
			rect.size.x, rect.size.y
		);
	}
}

// get canvas el
var canvas = document.getElementById('canvas');
// start the game
var pongo = new Pongo(canvas);

