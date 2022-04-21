/* 
TODO:

Levels
	speed increase

Scoring

Hold Piece
Sound effects:
	on rotation, 
	movement, 
	landing on surface, 
	touching a wall, 
	locking, 
	line clear
	game over
	music:  Korobeiniki

Recognize T-spins

Pause

Start screen

*/

class TetrisGame {

	grid;
	nextPiecesSelector;
	paused;
	currentSpeed;
	normalSpeed;
	fastSpeed;
	lockDelay;
	currentLockDelay;
	lastMoveTime;
	score;
	blocksQueue;
	grabBag;
	gameOver;
	
	constructor(gridSelector, nextPiecesSelector, startSpeed) {
		this.paused = false;
		this.grid = new TetrisGrid(gridSelector, 10, 20);
		this.nextPiecesSelector = nextPiecesSelector;
		this.normalSpeed = startSpeed;
		this.fastSpeed = 50;
		this.currentSpeed = this.normalSpeed;
		this.lockDelay = 500; //0.5 seconds
		this.lastMoveTime = 0;
		this.score = 0;
		this.gameOver = false;
		this.resetGrabBag();
		this.initQueue(6);
		this.createBlock();
		this.playLoop();
	}

	shuffleArray(array) {
	    for (var i = array.length - 1; i > 0; i--) {
	        var j = Math.floor(Math.random() * (i + 1));
	        var temp = array[i];
	        array[i] = array[j];
	        array[j] = temp;
	    }
	}

	resetGrabBag() {
		this.grabBag = [BlockTypes.IBlock, BlockTypes.JBlock, BlockTypes.LBlock, BlockTypes.OBlock, BlockTypes.SBlock, BlockTypes.TBlock, BlockTypes.ZBlock];
		this.shuffleArray(this.grabBag);
	}

	getRandomBlockType() {
		if(this.grabBag.length == 0) {
			this.resetGrabBag();
		}
		return this.grabBag.pop();//BlockTypes.IBlock;//this.grabBag.pop();
	}

	initQueue(size) {
		this.blocksQueue = [];
		for(let i = 0; i < size; i++) {
			this.blocksQueue.push(this.getRandomBlockType());
		}
	}

	popAndReloadQueue() {
		this.blocksQueue.unshift(this.getRandomBlockType());
		return this.blocksQueue.pop();
	}

	drawNextPieces() {
		//console.log("Drawing: ", this.blocksQueue);
		var html = "Next: ";
		for(let i = this.blocksQueue.length - 1; i >= 0; i--) {
			html += this.getNextPieceBlock(this.blocksQueue[i]);
		}
		$(this.nextPiecesSelector).html(html);
	}

	getNextPieceBlock(blockType) {
		var blockContent = "";
		switch(blockType) {
			case BlockTypes.IBlock:
				blockContent = "<div></div><div></div><div></div><div></div>" + 
					"<div class='block blocktype-IBlock'></div><div class='block blocktype-IBlock'></div><div class='block blocktype-IBlock'></div><div class='block blocktype-IBlock'></div>";
				break;
			case BlockTypes.JBlock:
				blockContent = "<div class='block blocktype-JBlock'></div><div></div><div></div><div></div>" +
					"<div class='block blocktype-JBlock'></div><div class='block blocktype-JBlock'></div><div class='block blocktype-JBlock'></div><div></div>";
				break;
			case BlockTypes.LBlock:
				blockContent = "<div></div><div></div><div class='block blocktype-LBlock'></div><div></div>" +
					"<div class='block blocktype-LBlock'></div><div class='block blocktype-LBlock'></div><div class='block blocktype-LBlock'></div><div></div>";
				break;
			case BlockTypes.OBlock:
				blockContent = "<div></div><div class='block blocktype-OBlock'></div><div class='block blocktype-OBlock'></div><div></div>" +
					"<div></div><div class='block blocktype-OBlock'></div><div class='block blocktype-OBlock'></div><div></div>";
				break;
			case BlockTypes.SBlock:
				blockContent = "<div></div><div class='block blocktype-SBlock'></div><div class='block blocktype-SBlock'></div><div></div>" +
					"<div class='block blocktype-SBlock'></div><div class='block blocktype-SBlock'></div><div></div><div></div>";
				break;
			case BlockTypes.TBlock:
				blockContent = "<div></div><div class='block blocktype-TBlock'></div><div></div><div></div>" +
					"<div class='block blocktype-TBlock'></div><div class='block blocktype-TBlock'></div><div class='block blocktype-TBlock'></div><div></div>";;
				break;
			case BlockTypes.ZBlock:
				blockContent = "<div class='block blocktype-ZBlock'></div><div class='block blocktype-ZBlock'></div><div></div><div></div>" +
					"<div></div><div class='block blocktype-ZBlock'></div><div class='block blocktype-ZBlock'></div><div></div>";;
				break;
		}
		
		return "<div class='block-queue-item'>"+blockContent+"</div>";
	}

	tic() {
		//if block fails to move down, set it to rest and create a new block
		var moved = this.grid.tic();
		if(!moved) { 
			this.grid.checkForLines();
			this.createBlock();
		}
		this.drawScore();
	}

	drawScore() {
		
	}

	playLoop() {
		var timeLeft = Date.now() - this.lastMoveTime;
		if(this.grid.anyBlocksInDirection(new Pos(0, -1)) && 
		   timeLeft < this.lockDelay) { //account for lock delay
			setTimeout(function() {
				if(!this.gameOver) {
					this.playLoop();
				}
			}.bind(this), timeLeft);
		}
		else { //only tic if it is not in lock delay 
			this.tic();
			setTimeout(function() {
				if(!this.gameOver) {
					this.playLoop();
				}
			}.bind(this), this.currentSpeed);
		}
	}

	createBlock() {
		this.grid.createCurrentBlock(this.popAndReloadQueue());
		var moved = this.grid.tic();
		if(!moved) {
			this.gameOver = true;
			console.log("GAME OVER!");
		}
		this.drawNextPieces();
	}

	rotateCurrentBlock(isClockwise) {
		if(this.grid.rotateCurrentBlocks(isClockwise)) {
			this.lastMoveTime = Date.now();
		}
	}

	moveLeft() {
		if(this.grid.moveLeft()){
			this.lastMoveTime = Date.now();
		}
	}

	moveRight() {
		if(this.grid.moveRight()){
			this.lastMoveTime = Date.now();
		}
	}

	dropBlock() {
		this.currentSpeed = this.fastSpeed;
	}

	stopDroppingBlock() {
		this.currentSpeed = this.normalSpeed;
	}

	hardDrop() {
		if(!this.gameOver) {
			var moved = this.grid.tic();
			if(!moved) { 
				this.grid.checkForLines();
				this.createBlock();
			}
			else {
				this.hardDrop();
			}
		}
	}

	pause() {
		this.paused = true;
	}
	
}