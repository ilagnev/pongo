

class Pos 
{
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
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
		var self = this;

		this._canvas = canvas;
		this._context = canvas.getContext('2d');

		this._canvas.width = window.innerWidth
		this._canvas.height = window.innerHeight

		// create ball with velocity
		this.ball = new Ball(this._canvas.width / 2, this._canvas.height / 2);

		// create players
		this.players = [
			new Player(30, this._canvas.height / 2),
			new Player(this._canvas.width - 30, this._canvas.height / 2)
		];

		this.players[0].vel.y = this._canvas.height / 1.5 * this.randDir();
		this.players[1].vel.y = this._canvas.height / 1.5 * this.randDir();

		// score chars
		this.charWidth = 3,
		this.charHeight = 5,
		this.charPixelSize = 10;

		// chars canvases
		this.chars = [
			'111101101101111',
			'010010010010010',
			'111001111100111',
			'111001111001111',
			'101101111001001',
			'111100111001111',
			'111100111101111',
			'111001001001001',
			'111101111101111',
			'111101111001111'
		].map(function(str){
			var canvas = document.createElement('canvas');
			canvas.width = self.charWidth * self.charPixelSize;
			canvas.height = self.charHeight * self.charPixelSize;
			var context = canvas.getContext('2d');
			context.fillStyle = '#fff';

			// print each pixel to char canvas
			str.split('').forEach(function(char, index){
				if (char === '1') {
					context.fillRect(
						(index * self.charPixelSize) % canvas.width, 
						~~(index / self.charWidth) * self.charPixelSize, 
						self.charPixelSize, self.charPixelSize
					)
				}
			});

			return canvas;
		})

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

		window.addEventListener('resize', this.resize.bind(this), true);
	}
	randDir(chance) {
		chance = chance || .5;
		return Math.random() > chance ? 1 : -1;
	}

	reset() {
		this.ball.pos.x = this._canvas.width / 2;
		this.ball.pos.y = this._canvas.height / 2;
		this.ball.vel.x = 333 * this.randDir();
		this.ball.vel.y = 333 * this.randDir();
	}

	resize() {
		var self = this;
		setTimeout(function(){
			self._canvas.width = window.innerWidth;
			self._canvas.height = window.innerHeight;

			self.players[0].pos.y = self._canvas.height / 2;
			self.players[1].pos.y = self._canvas.height / 2;
			self.players[1].pos.x = self._canvas.width - 30;

			self.reset();
		}, 20);
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
		this.players.forEach(function(player){
			this.playerCollide(player, this.ball)
		}.bind(this));

		// randomly change player direction
		this.players[0].vel.y *= this.randDir(0.006);
		this.players[1].vel.y *= this.randDir(0.004);

		this.draw();
	}

	playerCollide(player, ball) {
		if (
			ball.right > player.left && ball.left < player.right
			&& ball.bottom > player.top && ball.top < player.bottom
		) {
			ball.vel.x = -ball.vel.x;

			// change ball direction to the top if ball on the top
			if (ball.bottom > player.top && ball.top < player.top) {
				ball.vel.y = - Math.abs(ball.vel.y);
				// revert horizontal direction
				ball.vel.x = -ball.vel.x;
			}
			// change ball direction to the bottom if ball on the bottom
			if (ball.top < player.bottom && ball.bottom > player.bottom) {
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

		this.drawScore();
	}

	drawScore() {
		var self = this;
		//this._context.drawImage(this.chars[4], 10, 10);
		//this._context.drawImage(this.chars[1], 50, 10);
		var offset = this._canvas.width / 3;
		this.players.forEach(function(player, index){
			var chars = player.score.toString().split('')

			// shift offset for second player
			var pos = offset + offset * index 
				- chars.length * (self.charWidth * self.charPixelSize + self.charPixelSize) / 2;
			
			chars.forEach(function(char, i){
				self._context.drawImage(
					self.chars[char], 
					pos + i * (self.charWidth * self.charPixelSize + self.charPixelSize),
					self.charPixelSize * 2
				);
			});
		});
	}

	drawRect(rect, color) {
		this._context.fillStyle = color || '#fff';
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