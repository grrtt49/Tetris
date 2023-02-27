class TetrisBlock {

	blockType;
	x;
	y;

	constructor(x, y) {
		this.blockType = BlockTypes.none;
		this.x = x;
		this.y = y;
	}

	getHTML() {
		return "<div id='block-pos-"+this.x+"-"+this.y+"' class='block blocktype-"+this.blockType.name+"'></div>";
	}
	
}