var config = {
    'board_max_height_ratio': 0.8,
    'board_context_padding_ratio': 0.1,
}

function init() {
    const pid = 0 | Utility.get_parameter('pid');
    const small_x = 0 | Utility.get_parameter('x');
    const small_y = 0 | Utility.get_parameter('y');
    const board = LocalStorageManager.get_board(pid);
    const solved_data = LocalStorageManager.get_solve_data(pid);

    board_context = new BoardContext('img-board', board, ConfigValue.MODE_SMALL_SOLVE, {
        solve_data: solved_data,
        small_x: small_x,
        small_y: small_y,
        solve_clear: solve_clear
    });

    document.getElementById('button-retry').addEventListener('click', ()=>{
        location.reload();
    });

    document.getElementById('button-return').addEventListener('click', ()=>{
        location.href = `/solve/big?pid=${pid}`;
    });

    function solve_clear() {
        const element = document.getElementById('modal-result');
    
        document.getElementById('modal-title').textContent = `클리어!`;
        document.getElementById('modal-body').textContent = `00:21`;
    
        const solve_data = LocalStorageManager.get_solve_data(pid);
        solve_data[small_y][small_x] = 1;
        LocalStorageManager.set_solve_data(pid, solve_data);

        const canvas = document.getElementById('modal-canvas');
        draw_board(canvas, board_context.board, solve_data, true)
    
        const modal = new bootstrap.Modal(document.getElementById('modal-result'));
        modal.show();
    }
}

function draw_board(canvas, puzzle, solve_data, state) {
    const { min } = Math;
    const { width: c_width, height: c_height } = canvas;
    const { large_width, large_height, small_width, small_height } = puzzle;
    const width = large_width * small_width;
    const height = large_height * small_height;

    const ctx = canvas.getContext('2d');
    ctx.save();

    const gap = min(c_width / width, c_height / height);
    const offset_x = (c_width - gap * width) / 2;
    const offset_y = (c_height - gap * height) / 2;

    ctx.translate(offset_x, offset_y);

    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            ctx.beginPath();
            if (puzzle.data[i][j] == 1)
                ctx.fillStyle = "#000000";
            else
                ctx.fillStyle = "#ffffff";
            ctx.fillRect(
                (j) * gap,
                (i) * gap,
                (1) * gap,
                (1) * gap,
            );
        }
    }

    if (state) {
        for (let i = 0; i < large_height; i++) {
            for (let j = 0; j < large_width; j++) {
                if (solve_data[i][j])
                    continue;

                ctx.beginPath();
                ctx.fillStyle = "#bbbbbb";
                ctx.fillRect(
                    (j) * small_width * gap,
                    (i) * small_height * gap,
                    (1) * small_width * gap,
                    (1) * small_height * gap,
                );
            }
        }
    }

    ctx.restore();
}

init();