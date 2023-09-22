var config = {
    'board_max_height_ratio': 0.8,
    'board_context_padding_ratio': 0.1,
}

function init() {
    img_board = new BoardContext('img-board', Board.testtest(), ConfigValue.MODE_BIG_SHOW);
}

init();