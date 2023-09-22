function init() {
    img_board = new BoardContext('img-board', Board.testtest(), ConfigValue.MODE_SMALL_SOLVE, {
        small_x: 1,
        small_y: 2
    });
}

init();