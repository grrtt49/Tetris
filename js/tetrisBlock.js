class TetrisBlock {

	blockType;

	constructor() {
		this.blockType = BlockTypes.none;
	}

	getHTML() {
		return "<div class='block blocktype-"+this.blockType.name+"'></div>";
	}
	
}