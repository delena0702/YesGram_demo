var config = {
    'board_max_height_ratio': 0.7,
    'board_context_padding_ratio': 0.1,
}

function init() {
    const pid = 0 | Utility.get_parameter('pid');
    const board = LocalStorageManager.get_board(pid);
    const solved_data = LocalStorageManager.get_solve_data(pid);

    board_context = new BoardContext('img-board', board, ConfigValue.MODE_SMALL_SOLVE, {
        'solve_data': solved_data
    });
}

init();