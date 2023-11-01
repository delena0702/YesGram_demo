function init() {
    const button_import = document.getElementById('button-import');
    button_import.addEventListener('click', import_puzzle);
}

function import_puzzle() {
    const text = document.getElementById('input-puzzle').value;
    const pid = LocalStorageManager.get_empty_puzzle_id();
    const board = Board.import(text);

    if (!board) {
        alert("Puzzle Code가 올바르지 않습니다.");
        return;
    }

    LocalStorageManager.set_board(pid, board);
    location.href = `/edit/big?pid=${pid}`;
}

init();