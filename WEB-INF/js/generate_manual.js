function init() {
    const button_generate = document.getElementById('button-generate');

    button_generate.addEventListener('click', generate_puzzle)
}

function generate_puzzle() {
    const large_width = 0 | document.getElementById('input-large-width').value;
    const large_height = 0 | document.getElementById('input-large-height').value;
    const small_width = 0 | document.getElementById('input-small-width').value;
    const small_height = 0 | document.getElementById('input-small-height').value;

    const board = new Board(large_width, large_height, small_width, small_height);
    const pid = LocalStorageManager.get_empty_puzzle_id();
    LocalStorageManager.set_board(pid, board);
    location.href = `/edit/big?pid=${pid}`;
}

init();