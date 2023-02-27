class TetrisGrid {

	gridSelector;
	blocks;
	currentBlocks;
	currentBlockType;
	currentBlockOrigin;
	currentBlockRotation;
	width;
	height;
	isDrawingGridBlocked;
	
	constructor(gridSelector, width, height) {
		this.gridSelector = gridSelector;
		this.width = width;
		this.height = height;
		this.isDrawingGridBlocked = false;
		this.initBlocks();
	}

	initBlocks() {
		this.blocks = [];
		this.currentBlocks = [];
		this.currentBlockType = BlockTypes.none;
		this.currentBlockOrigin = null;
		this.currentBlockRotation = 0;
		for(let y = 0; y < this.height + 2; y++) { //two extra hidden rows
			this.blocks.push([]);
			for(let x = 0; x < this.width; x++) {
				this.blocks[y].push(new TetrisBlock(x, y));
			}
		}
	}

	drawGrid() {
		if(!this.isDrawingGridBlocked) {
			var html = "";
			for(let y = this.height - 1; y >= 0; y--) {
				for(let x = 0; x < this.width; x++) {
					html += this.blocks[y][x].getHTML();
				}
			}
			$(this.gridSelector).html(html);
		}
	}

	anyBlocksInDirection(vector) {
		for(let i = 0; i < this.currentBlocks.length; i++) {
			if(this.isBlockInDirection(this.currentBlocks[i], vector, this.currentBlocks)) return true; 
		}
		return false;
	}

	isBlockInDirection(pos, vector, currentBlocks) {
		let newPos = pos.plus(vector);
		if(newPos.y < 0 || newPos.y > this.height + 1 || //account for two hidden spaces
		   newPos.x < 0 || newPos.x > this.width - 1 ||
		   (!this.isPosInCurrentBlocks(newPos, currentBlocks) &&
		   this.blocks[newPos.y][newPos.x].blockType != BlockTypes.none)) {
			return true;
		}
		return false;
	}

	isPosInCurrentBlocks(pos, currentBlocks) {
		for(let i = 0; i < currentBlocks.length; i++) {
			if(currentBlocks[i].equals(pos)) {
				//console.log("pos is a current block: ", pos, currentBlocks);
				return true;
			}
		}
		return false;
	}

	moveAllBlocksInDirection(vector) {
		for(let i = 0; i < this.currentBlocks.length; i++) {
			this.moveCurrentBlockInDirection(this.currentBlocks[i], vector);
		}
	}

	moveCurrentBlockInDirection(pos, vector) {
		this.blocks[pos.y + vector.y][pos.x + vector.x].blockType = this.currentBlockType;		
		pos.plusEquals(vector);
		this.blocks[pos.y - vector.y][pos.x - vector.x].blockType = (this.isPosInCurrentBlocks(pos.minus(vector), this.currentBlocks) ? this.currentBlockType : BlockTypes.none);
	}

	moveAnyBlockInDirection(pos, vector, type) {
		this.blocks[pos.y + vector.y][pos.x + vector.x].blockType = type;		
		pos.plusEquals(vector);
		this.blocks[pos.y - vector.y][pos.x - vector.x].blockType =  BlockTypes.none;
	}

	createCurrentBlock(blockType) {
		this.currentBlocks = [];
		this.currentBlockType = blockType;
		this.currentBlockOrigin = null;
		this.currentBlockRotation = 0;
		var cBlock = new Pos(this.width / 2, this.height + 1); //start at top hidden row
		
		switch(blockType) {
			case BlockTypes.IBlock:
				this.currentBlocks.push(new Pos(cBlock.x - 1, cBlock.y));
				this.currentBlockOrigin = new Pos(cBlock.x, cBlock.y);
				this.currentBlocks.push(this.currentBlockOrigin);
				this.currentBlocks.push(new Pos(cBlock.x + 1, cBlock.y));
				this.currentBlocks.push(new Pos(cBlock.x + 2, cBlock.y));
				break;
			case BlockTypes.JBlock:
				this.currentBlocks.push(new Pos(cBlock.x - 1, cBlock.y - 1));
				this.currentBlockOrigin = new Pos(cBlock.x, cBlock.y - 1)
				this.currentBlocks.push(this.currentBlockOrigin);
				this.currentBlocks.push(new Pos(cBlock.x + 1, cBlock.y - 1));
				this.currentBlocks.push(new Pos(cBlock.x - 1, cBlock.y));
				break;
			case BlockTypes.LBlock:
				this.currentBlocks.push(new Pos(cBlock.x - 1, cBlock.y - 1));
				this.currentBlockOrigin = new Pos(cBlock.x, cBlock.y - 1);
				this.currentBlocks.push(this.currentBlockOrigin);
				this.currentBlocks.push(new Pos(cBlock.x + 1, cBlock.y - 1));
				this.currentBlocks.push(new Pos(cBlock.x + 1, cBlock.y));
				break;
			case BlockTypes.OBlock:
				this.currentBlocks.push(new Pos(cBlock.x, cBlock.y));
				this.currentBlockOrigin = new Pos(cBlock.x, cBlock.y - 1);
				this.currentBlocks.push(this.currentBlockOrigin);
				this.currentBlocks.push(new Pos(cBlock.x + 1, cBlock.y));
				this.currentBlocks.push(new Pos(cBlock.x + 1, cBlock.y - 1));
				break;
			case BlockTypes.SBlock:
				this.currentBlocks.push(new Pos(cBlock.x + 1, cBlock.y));
				this.currentBlocks.push(new Pos(cBlock.x, cBlock.y));
				this.currentBlockOrigin = new Pos(cBlock.x, cBlock.y - 1);
				this.currentBlocks.push(this.currentBlockOrigin);
				this.currentBlocks.push(new Pos(cBlock.x - 1, cBlock.y - 1));
				break;
			case BlockTypes.TBlock:
				this.currentBlocks.push(new Pos(cBlock.x - 1, cBlock.y - 1));
				this.currentBlockOrigin = new Pos(cBlock.x, cBlock.y - 1)
				this.currentBlocks.push(this.currentBlockOrigin);
				this.currentBlocks.push(new Pos(cBlock.x + 1, cBlock.y - 1));
				this.currentBlocks.push(new Pos(cBlock.x, cBlock.y));
				break;
			case BlockTypes.ZBlock:
				this.currentBlocks.push(new Pos(cBlock.x - 1, cBlock.y));
				this.currentBlocks.push(new Pos(cBlock.x, cBlock.y));
				this.currentBlockOrigin = new Pos(cBlock.x, cBlock.y - 1)
				this.currentBlocks.push(this.currentBlockOrigin);
				this.currentBlocks.push(new Pos(cBlock.x + 1, cBlock.y - 1));
				break;
		}
		//console.log("created block: ", this.currentBlocks);
		this.setCurrentBlocksBlockType(blockType);
	}

	setCurrentBlocksBlockType(blockType) {
		for(let i = 0; i < this.currentBlocks.length; i++) {
			let currentBlock = this.currentBlocks[i];
			this.blocks[currentBlock.y][currentBlock.x].blockType = blockType;
		}
	}

	tic() {
		if(!this.anyBlocksInDirection(new Pos(0, -1))) {
			this.moveAllBlocksInDirection(new Pos(0, -1));
			this.drawGrid();
			return true;
		}
		else {
			this.drawGrid();
			return false;
		}
	}

	moveLeft() {
		if(!this.anyBlocksInDirection(new Pos(-1, 0))) {
			this.moveAllBlocksInDirection(new Pos(-1, 0));
			this.drawGrid();
			return true;
		}
		else {
			this.drawGrid();
			return false;
		}
	}

	moveRight() {
		if(!this.anyBlocksInDirection(new Pos(1, 0))) {
			this.moveAllBlocksInDirection(new Pos(1, 0));
			this.drawGrid();
			return true;
		}
		else {
			this.drawGrid();
			return false;
		}
	}

	rotateCurrentBlocks(isClockwise) {
		this.setCurrentBlocksBlockType(BlockTypes.none);
		var rotatedPositions = [];
		for(let i = 0; i < this.currentBlocks.length; i++) {
			rotatedPositions.push(this.getRotatedPosition(this.currentBlocks[i], isClockwise));
		}
		if(!this.offsetAndCheckRotation(rotatedPositions, isClockwise)) {
			console.log("Cannot rotate");
			this.setCurrentBlocksBlockType(this.currentBlockType);
			return false;
		}
		this.setCurrentBlocksTo(rotatedPositions);
		this.setCurrentBlocksBlockType(this.currentBlockType);
		this.currentBlockRotation = (isClockwise ? this.currentBlockRotation + 1 : (this.currentBlockRotation - 1 < 0 ? 3 : this.currentBlockRotation - 1)) % 4;
		this.drawGrid();
		return true;
	}

	offsetAndCheckRotation(positions, isClockwise) {
		var offsetData = this.getOffsetsByBlockType(this.currentBlockType);
		for(let d = 0; d < offsetData[this.currentBlockRotation].length; d++) {
			var valid = true;
			let nextRotation = (isClockwise ? this.currentBlockRotation + 1 : (this.currentBlockRotation - 1 < 0 ? 3 : this.currentBlockRotation - 1)) % 4;

			var checkOffset = offsetData[this.currentBlockRotation][d].minus(offsetData[nextRotation][d]);
			for(let i = 0; i < positions.length; i++) {
				if(this.isBlockInDirection(positions[i], checkOffset, this.currentBlocks)) {
					valid = false;	
				}
			}
			if(valid) {
				for(let i = 0; i < positions.length; i++) {
					positions[i].plusEquals(checkOffset);
				}
				return true;
			}
		}
		return false;
	}

	getOffsetsByBlockType(blockType) {
		switch(blockType) {
			case BlockTypes.IBlock:
				return BlockOffsetData.IBlockOffsetData.data;
			case BlockTypes.OBlock:
				return BlockOffsetData.OBlockOffsetData.data;
			default:
				return BlockOffsetData.CommonOffsetData.data;
		}
	}

	setCurrentBlocksTo(rotatedPositions) {
		for(let i = 0; i < this.currentBlocks.length; i++) {
			this.currentBlocks[i].assign(rotatedPositions[i]);
		}
	}

	getRotatedPosition(pos, isClockwise) {
		let matrix = (isClockwise ? [[0, 1], [-1, 0]] : [[0, -1], [1, 0]]);
		let localPos = pos.minus(this.currentBlockOrigin);
		
		let dotProductX = (matrix[0][0] * localPos.x) + (matrix[0][1] * localPos.y);
		let dotProductY = (matrix[1][0] * localPos.x) + (matrix[1][1] * localPos.y);

		let localRotatedPos = new Pos(dotProductX, dotProductY);
		return this.currentBlockOrigin.plus(localRotatedPos);
	}

	checkForLines(animationDelay=0) {
		var lines = [];
		for(let y = this.height - 1; y >= 0; y--) {
			let lineAvailable = true;
			for(let x = 0; x < this.width; x++) {
				if(this.blocks[y][x].blockType == BlockTypes.none) {
					lineAvailable = false;
					break;
				}
			}
			if(lineAvailable) {
				lines.push(y);
			}
		}

		this.clearLines(lines, animationDelay);
		return lines.length;
	}

	clearLines(lines, animationDelay=0) {
		this.animateLinesRemoved(lines, animationDelay);
		for(let i = 0; i < lines.length; i++) {
			var y = lines[i];
			for(let x = 0; x < this.width; x++) {
				this.blocks[y][x].blockType = BlockTypes.none;
			}
			this.moveAllRowsDownAbove(y + 1);
		}
	}

	animateLinesRemoved(lines, animationDelay=0) {
		if(lines.length > 0)
			this.isDrawingGridBlocked = true;
		var rowHtml = "";
		for(let i = 0; i < lines.length; i++) {
			var y = lines[i];
			for(let x = 0; x < this.width; x++) {
				var offset = $("#block-pos-" + x + "-" + y).offset();
				rowHtml += "<div style='left: "+offset.left+"px; top: "+offset.top+"px;' class='animate-block block blocktype-" + this.blocks[y][x].blockType.name + "'></div>";
			}
		}
		$("#game").after(rowHtml);
		
		var duration = this.getDurationFromHeight(y);
		$(".animate-block").each(function() {
			var offset = $(this).offset();
			var newLeft = offset.left + (Math.floor(Math.random() * 300) - 150);
			$(this).delay(animationDelay).animate({
					'top':'100%', 
				 	'left':newLeft + 'px'
				}, {
				    duration: duration,
				    specialEasing: {
				      top: "easeInBack",
				      left: "easeInQuad"
				    }, 
					start: function() {
						$(this).animateRotate(Math.floor(Math.random() * 400) - 200, duration, 'linear');
					},
					complete: function() {
						$(this).remove();
					}
				}
			);
		});
	}

	getDurationFromHeight(y, g=10) {
		return Math.sqrt(2 * ((y + 1) / g)) * 1000;
	}

	moveAllRowsDownAbove(startY) {
		for(var y = startY; y < this.height; y++) {
			this.moveRowDown(y);
		}
	}

	moveRowDown(y) {
		for(let x = 0; x < this.width; x++) {
			this.moveAnyBlockInDirection(new Pos(x, y), new Pos(0, -1), this.blocks[y][x].blockType);
		}
	}
	
}

$.fn.animateRotate = function(angle, duration, easing, complete) {
  var args = $.speed(duration, easing, complete);
  var step = args.step;
  return this.each(function(i, e) {
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
      $.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) return step.apply(e, arguments);
    };

    $({deg: 0}).animate({deg: angle}, args);
  });
};