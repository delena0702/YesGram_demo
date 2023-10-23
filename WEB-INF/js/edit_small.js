var board_context = null;

function init() {
    const pid = 0 | Utility.get_parameter('pid');
    const board = LocalStorageManager.get_board(pid);
    board_context = new BoardContext('img-board', board, ConfigValue.MODE_SMALL_EDIT);

    document.getElementById('button-undo').addEventListener('click', undo);
    document.getElementById('button-reset').addEventListener('click', reset);
    document.getElementById('button-check').addEventListener('click', check);
    document.getElementById('button-save').addEventListener('click', save);
    document.getElementById('button-return').addEventListener('click', return_page);
}

function undo() {
    const change = board_context.get_last_change();

    if (change == null)
        return;

    [x, y] = change;
    const value = board_context.board.data[y][x];
    board_context.board.data[y][x] = 3 - value;
    board_context.resize_element();
}

function reset() {
    const pid = 0 | Utility.get_parameter('pid');
    const board = LocalStorageManager.get_board(pid);

    board_context.board = board;
    board_context.resize_element();
}

function check() {
    // TODO
}

function save() {
    const pid = 0 | Utility.get_parameter('pid');
    LocalStorageManager.set_board(pid, board_context.board);
    alert("저장되었습니다.");
}

function return_page() {
    const pid = 0 | Utility.get_parameter('pid');
    const pre_board = LocalStorageManager.get_board(pid);
    const board = board_context.board;

    const width = board.large_width * board.small_width;
    const height = board.large_height * board.small_height;

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (board.data[i][j] != pre_board.data[i][j]) {
                let answer = confirm("저장되지 않은 정보가 있습니다. 그래도 돌아가겠습니까?");
                if (answer)
                    location.href = `/edit/big?pid=${pid}`;
                return;
            }
        }
    }

    location.href = `/edit/big?pid=${pid}`;
}

init();