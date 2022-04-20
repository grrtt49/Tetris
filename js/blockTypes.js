class BlockTypes {
	
	static IBlock = new BlockTypes("IBlock");
	static JBlock = new BlockTypes("JBlock");
	static LBlock = new BlockTypes("LBlock");
	static OBlock = new BlockTypes("OBlock");
	static SBlock = new BlockTypes("SBlock");
	static TBlock = new BlockTypes("TBlock");
	static ZBlock = new BlockTypes("ZBlock");
	static none = new BlockTypes("none");
	
	constructor(name) {
		this.name = name;
	}
	
}

class BlockOffsetData {
	static CommonOffsetData = new BlockOffsetData([
		[ new Pos(0, 0), new Pos(0, 0), new Pos(0, 0), new Pos(0, 0), new Pos(0, 0) ],
		[ new Pos(0, 0), new Pos(1, 0), new Pos(1, -1), new Pos(0, 2), new Pos(1, 2) ],
		[ new Pos(0, 0), new Pos(0, 0), new Pos(0, 0), new Pos(0, 0), new Pos(0, 0) ],
		[ new Pos(0, 0), new Pos(-1, 0), new Pos(-1, -1), new Pos(0, 2), new Pos(-1, 2) ],
	]);

	static IBlockOffsetData = new BlockOffsetData([
		[ new Pos(0, 0), new Pos(-1, 0), new Pos(2, 0), new Pos(-1, 0), new Pos(2, 0)],
		[ new Pos(-1, 0), new Pos(0, 0), new Pos(0, 0), new Pos(0, 1), new Pos(0, -2) ],
		[ new Pos(-1, 1), new Pos(1, 1), new Pos(-2, 1), new Pos(1, 0), new Pos(-2, 0) ],
		[ new Pos(0, 1), new Pos(0, 1), new Pos(0, 1), new Pos(0, -1), new Pos(0, 2) ],
	]);

	static OBlockOffsetData = new BlockOffsetData([
		[ new Pos(0, 0) ],
		[ new Pos(0, -1) ],
		[ new Pos(-1, -1) ],
		[ new Pos(-1, 0) ],
	]);

	constructor(data) {
		this.data = data;
	}
}