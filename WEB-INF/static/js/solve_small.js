var config = {
    'board_max_height_ratio': 0.7,
    'board_context_padding_ratio': 0.01,
}

function init() {
    try {

        const pid = 0 | Utility.get_parameter('pid');
        const small_x = parseInt(Utility.get_parameter('x'));
        const small_y = parseInt(Utility.get_parameter('y'));
        const board = LocalStorageManager.get_board(pid);

        if (board == null) {
            alert("존재하지 않는 퍼즐입니다.");
            history.back();
            return;
        }

        const solved_data = LocalStorageManager.get_solve_data(pid);
        const start_time = new Date().getTime();
        const interval = setInterval(() => {
            const second = 0 | (new Date().getTime() - start_time) / 1000;
            document.getElementById('output-time').textContent = `${(0 | second / 60).toString().padStart(2, '0')}:${(second % 60).toString().padStart(2, '0')}`;
        }, 1000);

        board_context = new BoardContext('img-board', board, ConfigValue.MODE_SMALL_SOLVE, {
            solve_data: solved_data,
            small_x: small_x,
            small_y: small_y,
            solve_clear: solve_clear
        });

        document.getElementById('button-reset').addEventListener('click', () => {
            board_context.input_data = board_context.input_data.map(x =>
                x.map(x =>
                    0
                )
            );

            board_context.change_stack = [];
            board_context.solve_cnt = 0;
            board_context.resize_element();
        });

        document.getElementById('button-undo').addEventListener('click', () => {
            const change = board_context.change_stack.pop();
            if (change == null)
                return;

            const [input_data, solve_cnt] = JSON.parse(change);
            console.log(change);
            board_context.input_data = input_data;
            board_context.solve_cnt = solve_cnt;

            board_context.resize_element();
        });

        document.getElementById('button-retry').addEventListener('click', () => {
            location.reload();
        });

        document.getElementById('button-return').addEventListener('click', () => {
            location.href = `/solve/big?pid=${pid}`;
        });

        document.getElementById('button-return2').addEventListener('click', () => {
            location.href = `/solve/big?pid=${pid}`;
        });

        function solve_clear() {
            clearInterval(interval);
            const second = 0 | (new Date().getTime() - start_time) / 1000;

            document.getElementById('modal-title').textContent = `클리어!`;
            document.getElementById('modal-body').textContent = `클리어 시간 : ${(0 | second / 60).toString().padStart(2, '0')}:${(second % 60).toString().padStart(2, '0')}`;

            const solve_data = LocalStorageManager.get_solve_data(pid);
            solve_data[small_y][small_x] = 1;
            LocalStorageManager.set_solve_data(pid, solve_data);

            const canvas = document.getElementById('modal-canvas');
            draw_board(canvas, board_context.board, solve_data, true)

            const modal = new bootstrap.Modal(document.getElementById('modal-result'));
            modal.show();
        }
    } catch (e) {
        alert("존재하지 않는 퍼즐입니다.");
        history.back();
        return;
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