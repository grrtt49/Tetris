/* 
TODO:

Sound effects:
	on rotation, 
	movement, 
	landing on surface, 
	touching a wall, 
	locking, 
	line clear
	game over
	music:  Korobeiniki

Animation

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
	level;
	score;
	untilGoal;
	gameTimeout;
	isSoftDropping;
	startHardDrop;
	endHardDrop;
	pieceHolding;
	switchedHoldingThisTurn;
	
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
		this.level = 1;
		this.score = 0;
		this.untilGoal = 10;
		this.startHardDrop = 0;
		this.endHardDrop = 0;
		this.isSoftDropping = false;
		this.pieceHolding = null;
		this.switchedHoldingThisTurn = false;
		this.resetGrabBag();
		this.initQueue(6);
		this.createBlock();
		this.drawHeldPiece();
		this.playLoop();
	}

	drawHeldPiece() {
		$("#hold-container").html("Held: <br>" + this.getNextPieceBlock(this.pieceHolding));
	}

	holdCurrentPiece() {
		if(this.pieceHolding == null) {
			this.switchedHoldingThisTurn = true;
			this.pieceHolding = this.grid.currentBlockType;
			this.drawHeldPiece();
			this.grid.setCurrentBlocksBlockType(BlockTypes.none);
			this.createBlock();
			this.grid.drawGrid();
			return;
		}
		
		//already one being held
		if(!this.switchedHoldingThisTurn) {
			this.switchedHoldingThisTurn = true;
			var temp = this.grid.currentBlockType;
			this.grid.setCurrentBlocksBlockType(BlockTypes.none);
			this.grid.createCurrentBlock(this.pieceHolding);
			this.pieceHolding = temp;
			this.drawHeldPiece();
			var moved = this.grid.tic();
			if(!moved) {
				this.gameOver = true;
				console.log("GAME OVER!");
			}
		}
	}

	nextLevel() {
		this.level++;
		var changeCurrentSpeed = (this.currentSpeed == this.normalSpeed);
		this.normalSpeed = Math.pow(0.8-((this.level-1)*0.007), this.level-1) * 1000;
		if(changeCurrentSpeed) {
			this.currentSpeed = this.normalSpeed;
		}
		console.log("Level up! New speed: " + this.normalSpeed);
	}

	numLinesCleared(num) {
		if(num > 0) {
			var goalSubtract = this.goalValueByNumberOfLines(num);
			this.untilGoal -= goalSubtract;
			if(this.untilGoal <= 0) {
				this.untilGoal += 10;
				this.nextLevel();
			}
			//TODO: before or after changing levels
			var scoreValue = goalSubtract * 100 * this.level; 
			this.score += scoreValue;
		}
	}

	goalValueByNumberOfLines(num) {
		return[0, 1, 3, 5, 8][num];
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
			case null:
				blockContent = "<div></div><div></div><div></div><div></div>" +
					"<div></div><div></div><div></div><div></div>";;
				break;
		}
		
		return "<div class='block-queue-item'>"+blockContent+"</div>";
	}

	tic() {
		//if block fails to move down, set it to rest and create a new block
		var moved = this.grid.tic();
		if(!moved) { 
			var numLines = this.grid.checkForLines();
			this.switchedHoldingThisTurn = false;
			this.createBlock();
			this.numLinesCleared(numLines);
		}
		else if(this.isSoftDropping) {
			this.score++;
		}
		this.drawScore();
	}

	drawScore() {
		var html = "Score: " + this.score; 
		html += "<br>Level: " + this.level;
		html += "<br>Goal: " + this.untilGoal;

		$("#score-container").html(html);
	}

	playLoop() {
		var timeLeft = Date.now() - this.lastMoveTime;
		if(this.grid.anyBlocksInDirection(new Pos(0, -1)) && 
		   timeLeft < this.lockDelay) { //account for lock delay
			clearTimeout(this.gameTimeout);
			this.gameTimeout = setTimeout(function() {
				if(!this.gameOver) {
					this.playLoop();
				}
			}.bind(this), timeLeft);
		}
		else { //only tic if it is not in lock delay 
			this.tic();
			clearTimeout(this.gameTimeout);
			this.gameTimeout = setTimeout(function() {
				if(!this.gameOver) {
					this.playLoop();
				}
			}.bind(this), this.currentSpeed);
		}
	}

	createBlock() {
		this.grid.createCurrentBlock(this.popAndReloadQueue());
		var moved1 = this.grid.tic();
		var moved2 = this.grid.tic();
		if(!moved1 || !moved2) {
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
		this.isSoftDropping = true;
		this.currentSpeed = this.fastSpeed;
		this.playLoop();
	}

	stopDroppingBlock() {
		this.isSoftDropping = false;
		this.currentSpeed = this.normalSpeed;
	}

	hardDrop(start = true) {
		if(start) {
			this.startHardDrop = JSON.parse(JSON.stringify(this.grid.currentBlocks)); //clone positions
		}
		
		if(!this.gameOver) {
			var moved = this.grid.tic();
			if(!moved) { 
				this.endHardDrop = JSON.parse(JSON.stringify(this.grid.currentBlocks)); //clone positions
				if(!start) {
					var delay = this.animateDrop();
				}
					
				var numLines = this.grid.checkForLines(delay);
				this.switchedHoldingThisTurn = false;
				this.createBlock();
				this.numLinesCleared(numLines);
			}
			else {
				this.score += 2;
				this.hardDrop(false);
			}
		}
	}

	animateDrop() {
		var boxesHTML = "";
		for(let i = 0; i < this.startHardDrop.length; i++) {
			var offset = $("#block-pos-" + this.startHardDrop[i].x + "-" + this.startHardDrop[i].y).offset();
			if(offset != undefined)
				boxesHTML += "<div id='animate-drop-"+ this.startHardDrop[i].x + "-" + this.startHardDrop[i].y+"' style='left: "+offset.left+"px; top: "+offset.top+"px;' class='animate-drop-block block blocktype-" + this.grid.currentBlockType.name + "'></div>";
			else 
				console.log("Undefined! POS: ", this.startHardDrop[i]);
			var endOffset = $("#block-pos-" + this.endHardDrop[i].x + "-" + this.endHardDrop[i].y).offset();
			boxesHTML += "<div id='animate-drop-"+ this.endHardDrop[i].x + "-" + this.endHardDrop[i].y+"' style='left: "+endOffset.left+"px; top: "+endOffset.top+"px; z-index:6;' class='animate-drop-block block blocktype-" + BlockTypes.none.name + "'></div>";
		}
		$("#game").after(boxesHTML);

		for(let i = 0; i < this.startHardDrop.length; i++) {
			var animateBlock = $("#animate-drop-"+ this.startHardDrop[i].x + "-" + this.startHardDrop[i].y);
			var endBlock = $("#block-pos-"+ this.endHardDrop[i].x + "-" + this.endHardDrop[i].y);
			var endOffset = endBlock.offset();
			var duration = this.grid.getDurationFromHeight(this.startHardDrop[i].y - this.endHardDrop[i].y, 500);
			$(animateBlock).animate({'top': endOffset.top + 'px'}, duration, 'easeInQuad', 
				function() {
					$(this).remove();
				}
			);
		}
		var endHardDropLocal = JSON.parse(JSON.stringify(this.endHardDrop));
		setTimeout(function() {
			this.grid.isDrawingGridBlocked = false;
			this.grid.drawGrid();
			for(var i = 0; i < endHardDropLocal.length; i++) {
				$("#animate-drop-"+ endHardDropLocal[i].x + "-" + endHardDropLocal[i].y).remove();
			}
		}.bind(this), duration);
		return duration;
	}

	pause() {
		this.paused = true;
	}
	
}