class Pos {
	x;
	y;
	
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	equals(pos) {
		return (this.x == pos.x && this.y == pos.y);
	}

	minus(pos) {
		return new Pos(this.x - pos.x, this.y - pos.y);
	}

	plus(pos) {
		return new Pos(this.x + pos.x, this.y + pos.y);
	}

	plusEquals(pos) {
		this.x += pos.x;
		this.y += pos.y;
	}

	minusEquals(pos) {
		this.x -= pos.x;
		this.y -= pos.y;
	}

	assign(pos) {
		this.x = pos.x;
		this.y = pos.y;
	}
}