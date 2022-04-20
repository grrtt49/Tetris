class TetrisGrid {

	gridSelector;
	blocks;
	currentBlocks;
	currentBlockType;
	currentBlockOrigin;
	currentBlockRotation;
	width;
	height;
	
	constructor(gridSelector, width, height) {
		this.gridSelector = gridSelector;
		this.width = width;
		this.height = height;
		this.initBlocks();
	}

	initBlocks() {
		this.blocks = [];
		this.currentBlocks = [];
		this.currentBlockType = BlockTypes.none;
		this.currentBlockOrigin = null;
		this.currentBlockRotation = 0;
		for(let y = 0; y < this.height; y++) {
			this.blocks.push([]);
			for(let x = 0; x < this.width; x++) {
				this.blocks[y].push(new TetrisBlock());
			}
		}
	}

	drawGrid() {
		var html = "";
		for(let y = this.blocks.length - 1; y >= 0; y--) {
			for(let x = 0; x < this.blocks[y].length; x++) {
				html += this.blocks[y][x].getHTML();
			}
		}
		$(this.gridSelector).html(html);
	}

	anyBlocksInDirection(vector) {
		for(let i = 0; i < this.currentBlocks.length; i++) {
			if(this.isBlockInDirection(this.currentBlocks[i], vector, this.currentBlocks)) return true; 
		}
		return false;
	}

	isBlockInDirection(pos, vector, currentBlocks) {
		if(pos.y + vector.y < 0 || pos.y + vector.y > this.height - 1 ||
		   pos.x + vector.x < 0 || pos.x + vector.x > this.width - 1 ||
		   (!this.isPosInCurrentBlocks(pos.plus(vector), currentBlocks) &&
		   this.blocks[pos.y + vector.y][pos.x + vector.x].blockType != BlockTypes.none)) {
			return true;
		}
		return false;
	}

	isPosInCurrentBlocks(pos, currentBlocks) {
		for(let i = 0; i < currentBlocks.length; i++) {
			if(currentBlocks[i].equals(pos)) {
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
		pos.y += vector.y;
		pos.x += vector.x;
		this.blocks[pos.y - vector.y][pos.x - vector.x].blockType = (this.isPosInCurrentBlocks(pos.minus(vector), this.currentBlocks) ? this.currentBlockType : BlockTypes.none);
	}

	createCurrentBlock(blockType) {
		this.currentBlocks = [];
		this.currentBlockType = blockType;
		this.currentBlockOrigin = null;
		this.currentBlockRotation = 0;
		var cBlock = new Pos(this.width / 2, this.height - 1);
		
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
		}
		this.drawGrid();
	}

	moveLeft() {
		if(!this.anyBlocksInDirection(new Pos(-1, 0))) {
			this.moveAllBlocksInDirection(new Pos(-1, 0));
		}
		this.drawGrid();
	}

	moveRight() {
		if(!this.anyBlocksInDirection(new Pos(1, 0))) {
			this.moveAllBlocksInDirection(new Pos(1, 0));
		}
		this.drawGrid();
	}

	rotateCurrentBlocks(isClockwise) {
		this.setCurrentBlocksBlockType(BlockTypes.none);
		var rotatedPositions = [];
		for(let i = 0; i < this.currentBlocks.length; i++) {
			rotatedPositions.push(this.getRotatedPosition(this.currentBlocks[i], isClockwise));
		}
		if(!this.offsetAndCheckRotation(rotatedPositions, isClockwise)) {
			console.log("Cannot rotate");
			return;
		}
		this.setCurrentBlocksTo(rotatedPositions);
		this.setCurrentBlocksBlockType(this.currentBlockType);
		this.currentBlockRotation = (isClockwise ? this.currentBlockRotation + 1 : (this.currentBlockRotation - 1 < 0 ? 3 : this.currentBlockRotation - 1)) % 4;
		this.drawGrid();
	}

	offsetAndCheckRotation(positions, isClockwise) {
		var offsetData = this.getOffsetsByBlockType(this.currentBlockType);
		for(let d = 0; d < offsetData[this.currentBlockRotation].length; d++) {
			var valid = true;
			let nextRotation = (isClockwise ? this.currentBlockRotation + 1 : (this.currentBlockRotation - 1 < 0 ? 3 : this.currentBlockRotation - 1)) % 4;

			var checkOffset = offsetData[this.currentBlockRotation][d].minus(offsetData[nextRotation][d]);
			for(let i = 0; i < positions.length; i++) {
				if(this.isBlockInDirection(positions[i], checkOffset, positions)) {
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
	
}