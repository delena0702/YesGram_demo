function init() {
    const pid = 0 | Utility.get_parameter('pid');
    let board = LocalStorageManager.get_board(pid);

    if (board == null) {
        return;
    }
    
    document.getElementById('puzzle-name').value = board.title;
    document.getElementById('button-save').addEventListener('click', save_puzzle);
    document.getElementById('button-export').href = `/export?pid=${pid}`;

    board_context = new BoardContext('img-board', board, ConfigValue.MODE_BIG_EDIT);
}

function save_puzzle() {
    const pid = 0 | Utility.get_parameter('pid');
    const board = LocalStorageManager.get_board(pid);

    board.title = document.getElementById('puzzle-name').value;

    LocalStorageManager.set_board(pid, board);
    alert('저장되었습니다.');
}

init();