var board_context = null;

function init() {
    const pid = 0 | Utility.get_parameter('pid');
    const board = LocalStorageManager.get_board(pid);
    const small_x = 0 | Utility.get_parameter('x');
    const small_y = 0 | Utility.get_parameter('y');
    board_context = new BoardContext('img-board', board, ConfigValue.MODE_SMALL_EDIT, {
        small_x : small_x,
        small_y : small_y,
    });

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

async function check() {
    const { board, small_x: x, small_y: y } = board_context;
    const { data, small_width: width, small_height: height } = board;

    const puzzle_board = Array.from({ length: height }, (_, i) =>
        Array.from({ length: width }, (_, j) => 
            data[height * y + i][width * x + j]
        )
    );
    
    const solver = new Solver(width, height);
    const hint = Solver.make_hint_from_array(puzzle_board);
    solver.attach_hint(hint);
    await solver.solve();
    const result = solver.get_result();

    for (let i=0; i<height; i++) {
        for (let j=0; j<width; j++) {
            if (result[i][j])
                result[i][j] = 0;
            else
                result[i][j] = 1;
        }
    }

    board_context.filter_board = result;
    board_context.resize_element();
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