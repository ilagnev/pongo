

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

	get left() {
		return this.pos.x - this.size.x / 2;
	}
	get right() {
		return this.pos.x + this.size.x / 2;
	}

	get top() {
		return this.pos.y - this.size.y / 2;
	}
	get bottom() {
		return this.pos.y + this.size.y / 2;
	}
}

class Ball extends Rect 
{
	constructor() {
		super(
			(canvas.width / 2), 
			(canvas.height / 2),
			10, 
			10
		);
		// velocity: pixels per sec
		this.vel = {x:0, y:0};
	}
}

class Player extends Rect
{
	constructor(offsetTop, offsetLeft) {
		super(offsetTop, offsetLeft, 20, 100);
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
			new Player(30, this._canvas.height / 2),
			new Player(this._canvas.width - 30, this._canvas.height / 2)
		];
		console.log(this.players);

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
		this.ball.vel.x = this.ball.right > this._canvas.width || this.ball.left < 0 
			? -this.ball.vel.x 
			: this.ball.vel.x;
			
		this.ball.vel.y = this.ball.bottom > this._canvas.height || this.ball.top < 0
			? -this.ball.vel.y 
			: this.ball.vel.y;

		// change this.ball position in time with deltatime
		this.ball.pos.x += this.ball.vel.x * delta;
		this.ball.pos.y += this.ball.vel.y * delta;

		// change players position
		this.players[0].pos.y = this.ball.pos.y;
		this.players[1].pos.y = this.ball.pos.y;

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
			rect.left, rect.top, 
			rect.size.x, rect.size.y
		);
	}
}

// get canvas el
var canvas = document.getElementById('canvas');
// start the game
var pongo = new Pongo(canvas);

