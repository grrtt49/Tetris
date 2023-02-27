var game = new TetrisGame("#grid", "#next-pieces", 1000);
var isDropping = false;

$(document).ready(function(){
	game.grid.drawGrid();
	var count = 0;
	$(document).keydown(function(e) {
		e.preventDefault();
		var keyCode = (e.keyCode ? e.keyCode : e.which);
		//console.log(keyCode);
		
		switch(keyCode) {
			case 39: //right
				game.moveRight();	
				break;
			case 37: //left
				game.moveLeft();
				break;
			case 32: //space
				game.hardDrop();
				break;
			case 38: //up
			case 88: //x
				game.rotateCurrentBlock(true);
				break;
			case 40: //down
				if(!isDropping) {
					game.dropBlock();
					isDropping = true;
				}
				break;
			case 90: //z
				game.rotateCurrentBlock(false);
				break;
			case 67: //c
				game.holdCurrentPiece();
		}
	});

	$(document).keyup(function(e) {
		e.preventDefault();
		var keyCode = (e.keyCode ? e.keyCode : e.which);
		
		switch(keyCode) {
			case 40: //down
				game.stopDroppingBlock();
				isDropping = false;
				break;
		}
	});
});