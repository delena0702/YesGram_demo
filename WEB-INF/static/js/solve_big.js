var config = {
    'board_max_height_ratio': 0.7,
    'board_context_padding_ratio': 0.1,
}

function init() {
    const pid = 0 | Utility.get_parameter('pid');
    const board = LocalStorageManager.get_board(pid);
    const solve_data = LocalStorageManager.get_solve_data(pid);
    console.log(solve_data);

    board_context = new BoardContext('img-board', board, ConfigValue.MODE_BIG_SOLVE, {
        solve_data: solve_data,
        show_answer: false,
    });

    const show_answer = document.getElementById('input-show-answer');
    show_answer.addEventListener('click', (e) => {
        board_context.show_answer = e.target.checked;
        board_context.resize_element();
    });
}

init();