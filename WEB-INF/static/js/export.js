var config = {
    'board_max_height_ratio': 0.5,
    'board_context_padding_ratio': 0.1,
}

function init() {
    // init popover
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
    const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl, {
        trigger: 'focus'
    }));

    // Copy Button
    document.getElementById('button-copy').onclick = ()=>{
        Utility.copy_to_clipboard(document.getElementById('output-puzzle-code'));
    };
    
    const pid = 0 | (Utility.get_parameter('pid') ?? -1);
    let board = LocalStorageManager.get_board(pid);
    
    if (board == null) {
        alert("존재하지 않는 퍼즐입니다.");
        history.back();
        return;
    }

    const img_board = new BoardContext('img-board', board, ConfigValue.MODE_BIG_SHOW);

    const output = document.getElementById('output-puzzle-code');
    output.value = board.export();
}

init();