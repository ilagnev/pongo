

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
	constructor(offsetTop, offsetLeft) {
		super(offsetTop, offsetLeft, 10, 10);
		// velocity: pixels per sec
		this.vel = {x:0, y:0};
	}
}

class Player extends Rect
{
	constructor(offsetTop, offsetLeft) {
		super(offsetTop, offsetLeft, 20, 100);
		// velocity: pixels per sec
		this.vel = {x:0, y:0};
		this.score = 0;
	}
}

class Pongo 
{
	constructor(canvas) {
		this._canvas = canvas;
		this._context = canvas.getContext('2d');

		// create ball with velocity
		this.ball = new Ball(this._canvas.width / 2, this._canvas.height / 2);
		
		console.log(this.ball);

		// create players
		this.players = [
			new Player(30, this._canvas.height / 2),
			new Player(this._canvas.width - 30, this._canvas.height / 2)
		];

		this.players[0].vel.y = 300 * this.randDir();
		this.players[1].vel.y = 300 * this.randDir();

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

		this.reset();
	}
	randDir(chance = .5){
		return Math.random() > chance ? 1 : -1;
	}

	reset() {
		this.ball.pos.x = this._canvas.width / 2;
		this.ball.pos.y = this._canvas.height / 2;
		this.ball.vel.x = 333 * this.randDir();
		this.ball.vel.y = 333 * this.randDir();
	}

	update(delta) {
		// detect collision with walls and update score then reset
		if (this.ball.right > this._canvas.width) {
			this.players[0].score++;
			this.ball.vel.x = -this.ball.vel.x;
			this.reset();
		} else if (this.ball.left < 0) {
			this.players[1].score++;
			this.ball.vel.x = -this.ball.vel.x;
			this.reset();
		}
			
		this.ball.vel.y = this.ball.bottom > this._canvas.height || this.ball.top < 0
			? -this.ball.vel.y 
			: this.ball.vel.y;

		// change this.ball position in time with deltatime
		this.ball.pos.x += this.ball.vel.x * delta;
		this.ball.pos.y += this.ball.vel.y * delta;


		// detect players with wall collision
		this.players[0].vel.y = this.players[0].bottom > this._canvas.height || this.players[0].top < 0
			? -this.players[0].vel.y
			: this.players[0].vel.y;

		this.players[1].vel.y = this.players[1].bottom > this._canvas.height || this.players[1].top < 0
			? -this.players[1].vel.y
			: this.players[1].vel.y;

		// change players position
		this.players[0].pos.y += this.players[0].vel.y * delta;
		this.players[1].pos.y += this.players[1].vel.y * delta;

		// detect collision with players and change move dirrection of the ball
		this.players.forEach(player => this.playerCollide(player, this.ball));

		// randomly change player direction
		this.players[0].vel.y *= this.randDir(0.006);
		this.players[1].vel.y *= this.randDir(0.004);

		this.draw();
	}

	wallCollide(rect) {

	}

	playerCollide(player, ball) {
		if (
			ball.right > player.left && ball.left < player.right
			&& ball.bottom > player.top && ball.top < player.bottom
		) {
			ball.vel.x = -ball.vel.x;

			if (ball.bottom > player.top && ball.top < player.top) {
				//console.log('top collision');
				ball.vel.y = - Math.abs(ball.vel.y);
				// revert horizontal direction
				ball.vel.x = -ball.vel.x;
			}
			if (ball.top < player.bottom && ball.bottom > player.bottom) {
				//console.log('bottom collision');
				ball.vel.y = Math.abs(ball.vel.y);
				// revert horizontal direction
				ball.vel.x = -ball.vel.x;
			}
		}
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

