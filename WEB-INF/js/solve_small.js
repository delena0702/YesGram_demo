var config = {
    'board_max_height_ratio': 0.9,
    'board_context_padding_ratio': 0.1,
}

function init() {
    const pid = 0 | Utility.get_parameter('pid');
    const small_x = 0 | Utility.get_parameter('x');
    const small_y = 0 | Utility.get_parameter('y');
    const board = LocalStorageManager.get_board(pid);
    const solved_data = LocalStorageManager.get_solve_data(pid);

    board_context = new BoardContext('img-board', board, ConfigValue.MODE_SMALL_SOLVE, {
        'solve_data': solved_data,
        'small_x': small_x,
        'small_y': small_y,
    });
}

init();