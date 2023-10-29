function init() {
    const button_generate = document.getElementById('button-generate');
    const input_large_width = document.getElementById('input-large-width');
    const input_large_height = document.getElementById('input-large-height');
    const input_small_width = document.getElementById('input-small-width');
    const input_small_height = document.getElementById('input-small-height');

    button_generate.addEventListener('click', generate_puzzle);
}

function get_value(element) {
    if (!element.reportValidity())
        throw Error("Invalid Input");
    return 0 | element.value;
}

function generate_puzzle() {
    try {
        const large_width = get_value(document.getElementById('input-large-width'));
        const large_height = get_value(document.getElementById('input-large-height'));
        const small_width = get_value(document.getElementById('input-small-width'));
        const small_height = get_value(document.getElementById('input-small-height'));

        const board = new Board(large_width, large_height, small_width, small_height);
        const pid = LocalStorageManager.get_empty_puzzle_id();
        LocalStorageManager.set_board(pid, board);
        location.href = `/edit/big?pid=${pid}`;
    } catch (e) {
        return;
    }
}

init();