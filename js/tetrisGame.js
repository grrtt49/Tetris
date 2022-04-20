class TetrisGame {

	grid;
	paused;
	gameInterval;
	currentSpeed;
	score;
	blocksQueue;
	
	constructor(gridSelector, startSpeed) {
		this.paused = false;
		this.grid = new TetrisGrid(gridSelector, 10, 20);
		this.currentSpeed = startSpeed;
		this.score = 0;
		this.initQueue(1);
		this.createBlock();
		//this.playLoop();
	}

	getRandomBlockType() {
		let types = [BlockTypes.IBlock, BlockTypes.JBlock, BlockTypes.LBlock, BlockTypes.OBlock, BlockTypes.SBlock, BlockTypes.TBlock, BlockTypes.ZBlock];
		let rand = Math.floor(Math.random() * types.length);
		return types[rand];
	}

	initQueue(size) {
		this.blocksQueue = [];
		for(let i = 0; i < size; i++) {
			this.blocksQueue.push(this.getRandomBlockType());
		}
	}

	popAndReloadQueue() {
		this.blocksQueue.push(this.getRandomBlockType());
		return this.blocksQueue.pop();
	}

	tic() {
		this.grid.tic();
		this.drawScore();
	}

	drawScore() {
		
	}

	playLoop() {
		this.grid.drawGrid();
		this.gameInterval = setInterval(function() {
			this.tic();
		}.bind(this), this.currentSpeed);
	}

	createBlock() {
		this.grid.createCurrentBlock(this.popAndReloadQueue());
	}

	rotateCurrentBlock(isClockwise) {
		this.grid.rotateCurrentBlocks(isClockwise);
	}

	moveLeft() {
		this.grid.moveLeft();
	}

	moveRight() {
		this.grid.moveRight();
	}

	dropCurrentBlock() {
		
	}

	pause() {
		this.paused = true;
	}
	
}