var game = new TetrisGame("#grid", 1000);

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
				game.tic();
				break;
			case 88:
				game.rotateCurrentBlock(true);
				break;
			case 90:
				game.rotateCurrentBlock(false);
				break;
		}
	});
});