const storage_key_board_list = 'YESGRAM_DATA_BOARD_LIST';
const storage_key_board = 'YESGRAM_DATA_BOARD';
const storage_key_solve_data = 'YESGRAM_DATA_SOLVE';

// Default Config Values
var config = {
    'board_max_height_ratio': 1.5,
    'board_context_padding_ratio': 0.1,
}

class ConfigValue {
    static MODE_BIG_SHOW = 1
    static MODE_SMALL_SHOW = 2
    static MODE_BIG_EDIT = 3
    static MODE_SMALL_EDIT = 4
    static MODE_BIG_SOLVE = 5
    static MODE_SMALL_SOLVE = 6

    static FILTER_NONE = 0
    static FILTER_CHECK = 1
    static FILTER_CURSOR = 11
    static FILTER_CURSOR2 = 12

    static isBig(value) {
        if ([this.MODE_BIG_SHOW, this.MODE_BIG_EDIT, this.MODE_BIG_SOLVE].includes(value))
            return true;
        return false;
    }
}

class Board {
    title
    large_width
    large_height
    small_width
    small_height
    data

    constructor(large_width, large_height, small_width, small_height) {
        this.large_width = large_width;
        this.large_height = large_height;
        this.small_width = small_width;
        this.small_height = small_height;
        this.title = "Unnamed Puzzle";

        const width = large_width * small_width;
        const height = large_height * small_height;;
        this.data = Array.from({ length: height }, () =>
            Array.from({ length: width }, () =>
                2
            )
        );
    }

    export() {
        const { title, large_width, large_height, small_width, small_height, data } = this;
        const width = large_width * small_width, height = large_height * small_height;

        let string = [];
        let idx = 0, acc = 0;
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                if (data[i][j] == 1)
                    acc |= (1 << idx);
                idx++;
                if (idx == 8) {
                    string.push(String.fromCharCode(acc));
                    idx = 0, acc = 0;
                }
            }
        }

        if (idx)
            string.push(String.fromCharCode(acc));

        const result = {
            size: [title, large_width, large_height, small_width, small_height],
            data: string.join('')
        };

        return btoa(encodeURI(JSON.stringify(result)));
    }

    static import(string) {
        try {
            const obj = JSON.parse(decodeURI(atob(string)));
            const [title, large_width, large_height, small_width, small_height] = obj.size;
            const board = new Board(large_width, large_height, small_width, small_height);
            const width = large_width * small_width, height = large_height * small_height;

            board.title = title;
            board.data = Array.from({ length: height }, () =>
                Array.from({ length: width }, () =>
                    2
                )
            );

            let original_string = obj.data;
            let idx = 0;
            for (let i = 0; i < original_string.length; i++) {
                for (let j = 0; j < 8; j++) {
                    if ((original_string.charCodeAt(i) & (1 << j)) == 0) {
                        idx++;
                        continue;
                    }

                    const x = idx % width, y = 0 | idx / width;
                    if (y > height)
                        break;
                    board.data[y][x] = 1;
                    idx++;
                }
            }

            return board;
        } catch (e) {
            return null;
        }
    }

    static import_by_image(large_width, large_height, small_width, small_height, image_data) {
        const board = new Board(large_width, large_height, small_width, small_height);
        board.data = image_data.map(x =>
            x.map(x =>
                x + 1
            )
        );
        return board;
    }
}

class Solver {
    board

    constructor(width, height) {
        this.board = new PuzzleBoard(width, height)
    }

    attach_hint(hint) {
        const { board } = this
        board.attach_hint(hint)
    }

    solve() {
        const { board } = this
        board.solve()
    }

    get_result() {
        const { board } = this
        return JSON.parse(JSON.stringify(board.board))
    }

    static make_hint_from_array(arr) {
        const [WIDTH, HEIGHT] = [arr[0].length, arr.length]

        const retval = [[], []]

        for (let i = 0; i < HEIGHT; i++) {
            const params = []

            let cnt = 0
            for (let j = 0; j <= WIDTH; j++) {
                if (j == WIDTH || arr[i][j] != 1) {
                    if (!cnt)
                        continue

                    params.push(cnt)
                    cnt = 0
                }
                else
                    cnt++
            }

            retval[0].push(params)
        }

        for (let j = 0; j < WIDTH; j++) {
            const params = []

            let cnt = 0
            for (let i = 0; i <= HEIGHT; i++) {
                if (i == HEIGHT || arr[i][j] != 1) {
                    if (!cnt)
                        continue

                    params.push(cnt)
                    cnt = 0
                }
                else
                    cnt++
            }

            retval[1].push(params)
        }

        return retval
    }
}

class PuzzleBoard {
    width
    height
    board
    hint
    change_listener

    constructor(width, height) {
        this.width = width
        this.height = height
        this.board = Array.from({ length: this.height }, () =>
            Array.from({ length: this.width }, () => 0)
        )

        this.hint = [
            Array.from({ length: height }, () => []),
            Array.from({ length: width }, () => []),
        ]

        this.change_listener = (_) => { };
    }

    attach_hint(hint) {
        this.hint = hint
    }

    solve_line(hint, board) {
        const { max } = Math;
        const N = board.length;
        const M = hint.length;

        const result = Array.from({ length: 2 }, () =>
            new Array(N).fill(0)
        );

        const psum = Array.from({ length: 2 }, () =>
            new Array(N + 1).fill(0)
        );

        for (let i = 0; i < N; i++)
            psum[1][i + 1] = psum[1][i] + (board[i] == 1 ? 1 : 0);
        for (let i = 0; i < N; i++)
            psum[0][i + 1] = psum[0][i] + (board[i] == 2 ? 1 : 0);

        const idxs = Array.from({ length: M + 1 }, () => [0, 0]);

        idxs[0][0] = 0;
        for (let i = 1; i <= M; i++)
            idxs[i][0] = idxs[i - 1][0] + hint[i - 1] + 1;

        idxs[M][1] = N + 1;
        for (let i = M - 1; i >= 0; i--)
            idxs[i][1] = idxs[i + 1][1] - hint[i] - 1;

        const margin = (M ? idxs[0][1] : N);
        if (margin < 0)
            return new Array(N).fill(-1);

        const dp = Array.from({ length: M + 1 }, () =>
            new Array(margin + 1).fill(-1)
        );

        function solve_line_dfs(idx, start) {
            if (dp[idx][start - idxs[idx][0]] != -1)
                return dp[idx][start - idxs[idx][0]];

            if (idx == M) {
                if (start <= N && (psum[1][N] - psum[1][start]))
                    return dp[idx][start - idxs[idx][0]] = false;
                if (start < N)
                    result[0][start]++;
                return dp[idx][start - idxs[idx][0]] = true;
            }

            const h = hint[idx];
            let retval = false;

            for (let i = max(idxs[idx][0], start); i <= idxs[idx][1]; i++) {
                if (psum[1][i] - psum[1][start])
                    continue;
                if (psum[0][i + h] - psum[0][i])
                    continue;
                if (i + h + 1 <= N && psum[1][i + h + 1] - psum[1][i + h])
                    continue;

                if (!solve_line_dfs(idx + 1, i + h + 1))
                    continue;

                result[0][start]++;
                result[0][i]--;

                result[1][i]++;
                if (i + h < N)
                    result[1][i + h]--;

                if (i + h < N)
                    result[0][i + h]++;
                if (i + h + 1 < N)
                    result[0][i + h + 1]--;
                retval = true;
            }

            return dp[idx][start - idxs[idx][0]] = retval;
        }

        solve_line_dfs(0, 0);

        for (let i = 0; i < 2; i++)
            for (let j = 1; j < N; j++)
                result[i][j] += result[i][j - 1];

        const mapping = [-1, 1, 2, 0];
        const retval = new Array(N).fill(0);

        for (let i = 0; i < N; i++) {
            if (result[0][i])
                retval[i] += 2;
            if (result[1][i])
                retval[i] += 1;

            retval[i] = mapping[retval[i]];
        }

        return retval;
    }

    solve() {
        const { width: M, height: N, board, hint, change_listener: change } = this;

        this.clear_board();

        const queue = Array.from({ length: N + M }, (_, i) => i);
        const in_queue = new Array(N + M).fill(true);
        while (queue.length) {
            const idx = queue.shift()
            in_queue[idx] = false;

            if (idx < N) {
                const i = idx;
                const arr = Array.from({ length: M }, (_, j) => board[i][j]);
                const result = this.solve_line(hint[0][i], arr);

                change([idx, queue]);

                for (let j = 0; j < M; j++) {
                    if (result[j] == -1) {
                        board[i][j] = -1;
                        throw Error('해결 불가능한 노노그램 퍼즐입니다.');
                    }
                    if (board[i][j] == result[j])
                        continue;

                    board[i][j] = result[j];
                    change([idx, queue]);

                    if (!in_queue[N + j]) {
                        queue.push(N + j);
                        in_queue[N + j] = true;
                    }
                }
            }

            else {
                const j = idx - N;
                const arr = Array.from({ length: N }, (_, i) => board[i][j]);
                const result = this.solve_line(hint[1][j], arr);

                for (let i = 0; i < N; i++) {
                    if (result[i] == -1) {
                        board[i][j] = -1;
                        throw Error('해결 불가능한 노노그램 퍼즐입니다.');
                    }
                    if (board[i][j] == result[i])
                        continue;

                    board[i][j] = result[i];
                    change([idx, queue]);

                    if (!in_queue[i]) {
                        queue.push(i);
                        in_queue[i] = true;
                    }
                }
            }
        }
    }

    clear_board() {
        const { board, width, height } = this

        for (let i = 0; i < height; i++)
            for (let j = 0; j < width; j++)
                board[i][j] = 0
    }
}

class BoardContext {
    element
    context
    board
    solve_data

    filter_board

    small_x
    small_y
    mode

    change_stack

    hint
    input_data
    solve_cnt

    mw
    mh

    cx
    cy

    show_answer

    static CANVAS_SIZE = 1000

    constructor(id, board, mode, param) {
        this.element = document.getElementById(id);
        this.context = null;
        this.board = board;
        this.mode = mode;
        this.change_stack = [];

        this.cx = -1;
        this.cy = -1;

        if (param)
            Object.assign(this, param);


        let width = 0, height = 0;
        if (mode == ConfigValue.MODE_SMALL_SOLVE) {
            const { small_x, small_y } = this;
            const { small_width, small_height } = board;

            const puzzle_board = Array.from({ length: small_height }, (_, i) =>
                Array.from({ length: small_width }, (_, j) =>
                    board.data[small_y * small_height + i][small_x * small_width + j]
                )
            );

            this.hint = Solver.make_hint_from_array(puzzle_board);

            this.input_data = Array.from({ length: small_height }, () =>
                Array.from({ length: small_width }, () =>
                    0
                )
            );
            this.solve_cnt = 0;

            this.mw = Math.max(...this.hint[0].map(x => x.length), 1) + 1;
            this.mh = Math.max(...this.hint[1].map(x => x.length), 1) + 1;

            width = small_width + this.mw;
            height = small_height + this.mh;
        } else if (ConfigValue.isBig(mode)) {
            const { large_width, large_height } = board;
            width = large_width;
            height = large_height;
        } else {
            const { small_width, small_height } = board;
            width = small_width;
            height = small_height;
        }

        this.filter_board = Array.from({ length: height }, (_, i) =>
            Array.from({ length: width }, (_, j) =>
                ConfigValue.FILTER_NONE
            )
        );

        this.init();
    }

    init() {
        this.init_canvas();
        this.init_resize();
    }

    get_element() {
        return this.element;
    }

    init_resize() {
        const object = this;

        function resize_element() {
            object.resize_element();
        }

        window.addEventListener(
            'resize', (e) => {
                resize_element();
            }
        );

        this.resize_element();
    }

    resize_element() {
        const element = this.get_element();
        const max_size = 0 | document.documentElement.clientHeight * config['board_max_height_ratio'];
        const size = Math.min(element.parentElement.clientWidth, max_size);

        element.width = BoardContext.CANVAS_SIZE;
        element.height = BoardContext.CANVAS_SIZE;

        element.style.width = `${size}px`;
        element.style.height = `${size}px`;

        this.display();
    }

    init_canvas() {
        const object = this;
        const { element } = this;
        this.context = element.getContext('2d');

        object.element.addEventListener('click', (e) => {
            this.click(e.offsetX, e.offsetY, 1);
        });
        object.element.oncontextmenu = (e) => {
            return this.click(e.offsetX, e.offsetY, 2);
        };
        object.element.addEventListener('mousemove', (e) => {
            this.move_mouse(e.offsetX, e.offsetY);
        });
    }

    fit_ratio(width, height) {
        const { element, context: ctx } = this;
        let { width: c_width, height: c_height } = element;
        const ratio = config['board_context_padding_ratio'];

        ctx.translate(c_width * ratio, c_height * ratio);

        c_width *= (1 - 2 * ratio);
        c_height *= (1 - 2 * ratio);

        const gap = Math.min(c_width / width, c_height / height);
        const offset_x = (c_width - gap * width) / 2;
        const offset_y = (c_height - gap * height) / 2;

        ctx.translate(offset_x, offset_y);;
        return gap;
    }

    display() {
        const { mode } = this;
        switch (mode) {
            case ConfigValue.MODE_BIG_SHOW:
                this.display_big_show();
                break;
            case ConfigValue.MODE_SMALL_SHOW:
                this.display_small_show();
                break;
            case ConfigValue.MODE_BIG_EDIT:
                this.display_big_edit();
                break;
            case ConfigValue.MODE_SMALL_EDIT:
                this.display_small_edit();
                break;
            case ConfigValue.MODE_BIG_SOLVE:
                this.display_big_solve();
                break;
            case ConfigValue.MODE_SMALL_SOLVE:
                this.display_small_solve();
                break;
        }

        if (!ConfigValue.isBig(mode))
            this.display_filter();
    }

    display_big_show() {
        const { element, context: ctx, board } = this;

        const { large_width, large_height, small_width, small_height } = board;
        const width = large_width * small_width;
        const height = large_height * small_height;

        ctx.save();
        ctx.fillStyle = "#aaaaaa";
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;

        const gap = this.fit_ratio(width, height);

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                this.fill_tile(
                    (j) * gap,
                    (i) * gap,
                    gap + 1,
                    gap + 1,
                    board.data[i][j] + 100
                );
            }
        }

        ctx.lineWidth = 2;

        for (let i = 0; i <= large_height; i++) {
            ctx.beginPath();
            ctx.moveTo((0) * width * gap, (i) * small_height * gap);
            ctx.lineTo((1) * width * gap, (i) * small_height * gap);
            ctx.stroke();
        }

        for (let j = 0; j <= large_width; j++) {
            ctx.beginPath();
            ctx.moveTo((j) * small_width * gap, (0) * height * gap);
            ctx.lineTo((j) * small_width * gap, (1) * height * gap);
            ctx.stroke();
        }

        ctx.restore();
    }

    display_small_show() {
        const { element, context: ctx, board, small_x: x, small_y: y } = this;
        const { large_width, large_height, small_width, small_height } = board;

        ctx.save();
        ctx.fillStyle = "#aaaaaa";
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;

        const width = small_width;
        const height = small_height;
        const gap = this.fit_ratio(width, height);

        for (let i = 0; i < small_height; i++) {
            for (let j = 0; j < small_width; j++) {
                this.fill_tile(
                    0 | (j) * gap,
                    0 | (i) * gap,
                    0 | gap,
                    0 | gap,
                    board.data[y * small_height + i][x * small_width + j]
                );
            }
        }

        for (let i = 0; i <= small_height; i++) {
            ctx.beginPath();
            if (i % 5 == 0)
                ctx.lineWidth = 3;
            else
                ctx.lineWidth = 1;
            ctx.moveTo(0 | (0) * small_width * gap, 0 | (i) * gap);
            ctx.lineTo(0 | (1) * small_width * gap, 0 | (i) * gap);
            ctx.stroke();
        }

        for (let j = 0; j <= small_width; j++) {
            if (j % 5 == 0)
                ctx.lineWidth = 3;
            else
                ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(0 | (j) * gap, 0 | (0) * small_height * gap);
            ctx.lineTo(0 | (j) * gap, 0 | (1) * small_height * gap);
            ctx.stroke();
        }

        ctx.restore();
    }

    display_big_edit() {
        this.display_big_show();
    }

    display_small_edit() {
        this.display_small_show();
    }

    display_big_solve() {
        this.display_big_show();

        const { element, context: ctx, board, solve_data, show_answer } = this;

        const { large_width, large_height, small_width, small_height } = board;
        const width = large_width * small_width;
        const height = large_height * small_height;

        ctx.save();
        ctx.fillStyle = "#aaaaaa";
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;

        const gap = this.fit_ratio(width, height);

        ctx.font = `${0 | small_height * gap / 3}px consolas`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        if (!show_answer) {
            for (let i = 0; i < large_height; i++) {
                for (let j = 0; j < large_width; j++) {
                    if (solve_data[i][j])
                        continue;

                    ctx.fillStyle = "#888888";
                    ctx.fillRect(
                        (j) * small_width * gap,
                        (i) * small_height * gap,
                        (1) * small_width * gap,
                        (1) * small_height * gap);

                    ctx.fillStyle = "#ffffff";
                    ctx.fillText("?",
                        (j + 0.5) * small_width * gap,
                        (i + 0.5) * small_height * gap);
                }
            }
        }

        ctx.lineWidth = 2;

        for (let i = 0; i <= large_height; i++) {
            ctx.beginPath();
            ctx.moveTo((0) * width * gap, (i) * small_height * gap);
            ctx.lineTo((1) * width * gap, (i) * small_height * gap);
            ctx.stroke();
        }

        for (let j = 0; j <= large_width; j++) {
            ctx.beginPath();
            ctx.moveTo((j) * small_width * gap, (0) * height * gap);
            ctx.lineTo((j) * small_width * gap, (1) * height * gap);
            ctx.stroke();
        }
    }

    display_small_solve() {
        const { context: ctx, board, small_x: x, small_y: y, mw, mh, hint, input_data } = this;
        const { small_width, small_height } = board;

        ctx.save();
        ctx.fillStyle = "#aaaaaa";
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;

        const width = small_width + mw;
        const height = small_height + mh;
        const gap = this.fit_ratio(width, height);

        for (let i = 0; i < small_height; i++) {
            for (let j = 0; j < small_width; j++) {
                this.fill_tile(
                    0 | (mw + j) * gap,
                    0 | (mh + i) * gap,
                    0 | gap,
                    0 | gap,
                    input_data[i][j]
                );
            }
        }

        ctx.fillStyle = "#000000";
        ctx.font = `${0 | gap / 2}px consolas`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        for (let i = 0; i < hint[0].length; i++) {
            const l = hint[0][i].length;

            for (let j = 0; j < l; j++) {
                ctx.fillText(
                    hint[0][i][j],
                    0 | (mw - l + j + 0.5) * gap,
                    0 | (mh + i + 0.5) * gap
                );
            }
        }

        for (let i = 0; i < hint[1].length; i++) {
            const l = hint[1][i].length;

            for (let j = 0; j < l; j++) {
                ctx.fillText(
                    hint[1][i][j],
                    0 | (mw + i + 0.5) * gap,
                    0 | (mh - l + j + 0.5) * gap
                );
            }
        }

        ctx.lineWidth = 2;

        for (let i = mh; i <= height; i++) {
            ctx.beginPath();
            if ((i - mh) % 5 == 0)
                ctx.lineWidth = 3;
            else
                ctx.lineWidth = 1;
            ctx.moveTo(0 | (0) * gap, 0 | (i) * gap);
            ctx.lineTo(0 | (width) * gap, 0 | (i) * gap);
            ctx.stroke();
        }

        for (let j = mw; j <= width; j++) {
            ctx.beginPath();
            if ((j - mw) % 5 == 0)
                ctx.lineWidth = 3;
            else
                ctx.lineWidth = 1;
            ctx.moveTo(0 | (j) * gap, 0 | (0) * gap);
            ctx.lineTo(0 | (j) * gap, 0 | (height) * gap);
            ctx.stroke();
        }

        ctx.restore();
    }

    display_filter() {
        const { element, board, context: ctx, filter_board, cx, cy, mode, mw, mh } = this;
        const { large_width, large_height, small_width, small_height } = board;

        ctx.save();

        let width = 0, height = 0;
        let dw = 1, dh = 1;
        if (mode == ConfigValue.MODE_SMALL_SOLVE) {
            width = small_width + mw;
            height = small_height + mh;
        } else if (ConfigValue.isBig(mode)) {
            width = large_width * small_width;
            height = large_height * small_height;
            dw = small_width;
            dh = small_height;
        } else {
            width = small_width;
            height = small_height;
        }

        const gap = this.fit_ratio(width, height);

        for (let i = 0; i < filter_board.length; i++) {
            for (let j = 0; j < filter_board[i].length; j++) {
                this.fill_filter(
                    0 | (j) * dw * gap,
                    0 | (i) * dh * gap,
                    0 | dw * gap,
                    0 | dh * gap,
                    filter_board[i][j]
                );
            }
        }

        if (cx >= 0) {
            this.fill_filter(
                0 | (cx) * dw * gap,
                0 | (cy) * dh * gap,
                0 | dw * gap,
                0 | dh * gap,
                ConfigValue.FILTER_CURSOR
            );

            this.fill_filter(
                0 | (cx) * dw * gap,
                0 | (0) * dh * gap,
                0 | (1) * dw * gap,
                0 | (height) * dh * gap,
                ConfigValue.FILTER_CURSOR2
            );

            this.fill_filter(
                0 | (0) * dw * gap,
                0 | (cy) * dh * gap,
                0 | (cx) * dw * gap,
                0 | (1) * dh * gap,
                ConfigValue.FILTER_CURSOR2
            );

            this.fill_filter(
                0 | (cx + 1) * dw * gap,
                0 | (cy) * dh * gap,
                0 | (width - cx - 1) * dw * gap,
                0 | (1) * dh * gap,
                ConfigValue.FILTER_CURSOR2
            );
        }

        ctx.restore();
    }

    click(x, y, t) {
        const { mode } = this;
        switch (mode) {
            case ConfigValue.MODE_BIG_EDIT:
                return this.click_big_edit(x, y, t);
            case ConfigValue.MODE_SMALL_EDIT:
                return this.click_small_edit(x, y, t);
            case ConfigValue.MODE_BIG_SOLVE:
                return this.click_big_solve(x, y, t);
            case ConfigValue.MODE_SMALL_SOLVE:
                return this.click_small_solve(x, y, t);
        }
    }

    click_big_edit(x, y, t) {
        const { element, board } = this;
        const { width: c_width, height: c_height } = element;

        x = x * (0 | element.width) / element.clientWidth;
        y = y * (0 | element.height) / element.clientHeight;

        const { large_width, large_height, small_width, small_height } = board;
        const width = large_width * small_width;
        const height = large_height * small_height;

        const r = config['board_context_padding_ratio'];
        const real_width = c_width * (1 - 2 * r);
        const real_height = c_height * (1 - 2 * r);
        const gap = Math.min(real_width / width, real_height / height);

        const offset_x = r * c_width + (real_width - gap * width) / 2;
        const offset_y = r * c_height + (real_height - gap * height) / 2;

        const cx = Math.floor((x - offset_x) / (gap * small_width));
        const cy = Math.floor((y - offset_y) / (gap * small_height));

        if (!(0 <= cx && cx < large_width))
            return true;
        if (!(0 <= cy && cy < large_height))
            return true;

        const pid = 0 | Utility.get_parameter('pid');
        location.href = `/edit/small?pid=${pid}&x=${cx}&y=${cy}`;
        return false;
    }

    click_small_edit(x, y, t) {
        const { element, board } = this;
        const { width: c_width, height: c_height } = element;

        x = x * (0 | element.width) / element.clientWidth;
        y = y * (0 | element.height) / element.clientHeight;

        const { large_width, large_height, small_width, small_height } = board;
        const width = small_width;
        const height = small_height;

        const r = config['board_context_padding_ratio'];
        const real_width = c_width * (1 - 2 * r);
        const real_height = c_height * (1 - 2 * r);
        const gap = Math.min(real_width / width, real_height / height);

        const offset_x = r * c_width + (real_width - gap * width) / 2;
        const offset_y = r * c_height + (real_height - gap * height) / 2;

        const cx = Math.floor((x - offset_x) / (gap));
        const cy = Math.floor((y - offset_y) / (gap));

        if (!(0 <= cx && cx < small_width))
            return true;
        if (!(0 <= cy && cy < small_height))
            return true;

        const lx = 0 | Utility.get_parameter('x');
        const ly = 0 | Utility.get_parameter('y');
        const value = board.data[ly * small_height + cy][lx * small_width + cx];
        board.data[ly * small_height + cy][lx * small_width + cx] = 3 - value;

        this.change_stack.push([lx * small_width + cx, ly * small_height + cy]);
        this.resize_element();
        return false;
    }

    click_big_solve(x, y, t) {
        const { element, board } = this;
        const { width: c_width, height: c_height } = element;

        x = x * (0 | element.width) / element.clientWidth;
        y = y * (0 | element.height) / element.clientHeight;

        const { large_width, large_height, small_width, small_height } = board;
        const width = large_width * small_width;
        const height = large_height * small_height;

        const r = config['board_context_padding_ratio'];
        const real_width = c_width * (1 - 2 * r);
        const real_height = c_height * (1 - 2 * r);
        const gap = Math.min(real_width / width, real_height / height);

        const offset_x = r * c_width + (real_width - gap * width) / 2;
        const offset_y = r * c_height + (real_height - gap * height) / 2;

        const cx = Math.floor((x - offset_x) / (gap * small_width));
        const cy = Math.floor((y - offset_y) / (gap * small_height));

        if (!(0 <= cx && cx < large_width))
            return true;
        if (!(0 <= cy && cy < large_height))
            return true;

        const pid = 0 | Utility.get_parameter('pid');
        location.href = `/solve/small?pid=${pid}&x=${cx}&y=${cy}`;
        return false;
    }

    click_small_solve(x, y, t) {
        const { element, board, mw, mh, small_x, small_y } = this;
        const { width: c_width, height: c_height } = element;

        x = x * (0 | element.width) / element.clientWidth;
        y = y * (0 | element.height) / element.clientHeight;

        const { small_width, small_height } = board;
        const width = mw + small_width;
        const height = mh + small_height;

        const r = config['board_context_padding_ratio'];
        const real_width = c_width * (1 - 2 * r);
        const real_height = c_height * (1 - 2 * r);
        const gap = Math.min(real_width / width, real_height / height);

        const offset_x = r * c_width + (real_width - gap * width) / 2;
        const offset_y = r * c_height + (real_height - gap * height) / 2;

        const cx = Math.floor((x - offset_x) / (gap) - mw);
        const cy = Math.floor((y - offset_y) / (gap) - mh);

        if (!(0 <= cx && cx < small_width))
            return true;
        if (!(0 <= cy && cy < small_height))
            return true;

        const pre = this.input_data[cy][cx];
        this.input_data[cy][cx] = (this.input_data[cy][cx] + t) % 3;

        if (pre == board.data[small_y * small_height + cy][small_x * small_width + cx])
            this.solve_cnt--;
        if (this.input_data[cy][cx]
            == board.data[small_y * small_height + cy][small_x * small_width + cx])
            this.solve_cnt++;

        if (this.solve_cnt == small_width * small_height)
            this.solve_clear();

        this.resize_element();
        return false;
    }

    move_mouse(x, y) {
        const { element, mode, board, mw, mh } = this;
        const { width: c_width, height: c_height } = element;
        const { large_width, large_height, small_width, small_height } = board;

        x = x * (0 | element.width) / element.clientWidth;
        y = y * (0 | element.height) / element.clientHeight;

        let width = 0, height = 0;
        let dw = 1, dh = 1;
        if (mode == ConfigValue.MODE_SMALL_SOLVE) {
            width = small_width + mw;
            height = small_height + mh;
        } else if (ConfigValue.isBig(mode)) {
            width = large_width * small_width;
            height = large_height * small_height;
            dw = small_width;
            dh = small_height;
        } else {
            width = small_width;
            height = small_height;
        }

        const r = config['board_context_padding_ratio'];
        const real_width = c_width * (1 - 2 * r);
        const real_height = c_height * (1 - 2 * r);
        const gap = Math.min(real_width / width, real_height / height);

        const offset_x = r * c_width + (real_width - gap * width) / 2;
        const offset_y = r * c_height + (real_height - gap * height) / 2;

        const cx = Math.floor((x - offset_x) / (gap));
        const cy = Math.floor((y - offset_y) / (gap));

        if (!(0 <= cx && cx < width))
            return;
        if (!(0 <= cy && cy < height))
            return;

        this.cx = 0 | cx / dw;
        this.cy = 0 | cy / dh;

        this.resize_element();
    }

    fill_tile(x, y, w, h, type) {
        const { context: ctx } = this;

        ctx.save();
        switch (type) {
            case 1:
                ctx.fillStyle = "#aaaaaa";
                ctx.fillRect(x, y, w, h);
                break;
            case 2:
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + w, y + h);
                ctx.moveTo(x + w, y);
                ctx.lineTo(x, y + h);
                ctx.stroke();
                break;
            case 101:
                ctx.fillStyle = "#aaaaaa";
                ctx.fillRect(x, y, w, h);
                break;
            case 102:
                break;
        }
        ctx.restore();
    }

    fill_filter(x, y, w, h, type) {
        const { context: ctx } = this;
        ctx.save();

        switch (type) {
            case ConfigValue.FILTER_NONE:
                break;
            case ConfigValue.FILTER_CHECK:
                ctx.fillStyle = "#ff000044";
                ctx.fillRect(x, y, w, h);
                break;
            case ConfigValue.FILTER_CURSOR:
                ctx.strokeStyle = "#0000ff";
                ctx.lineWidth = 3;
                ctx.strokeRect(x, y, w, h);
                break;
            case ConfigValue.FILTER_CURSOR2:
                ctx.fillStyle = "#aaaaaa33";
                ctx.fillRect(x, y, w, h);
                break;
        }

        ctx.restore();
    }

    get_last_change() {
        const { change_stack } = this;
        if (change_stack.length == 0)
            return null;
        return change_stack.pop();
    }
}

class LocalStorageManager {
    static make_board_key(puzzle_id) {
        return `${storage_key_board}-${puzzle_id}`;
    }

    static make_solved_data_key(puzzle_id) {
        return `${storage_key_solve_data}-${puzzle_id}`;
    }

    static get_puzzle_list() {
        const list = JSON.parse(localStorage.getItem(storage_key_board_list) ?? '[]');
        return list;
    }

    static get_empty_puzzle_id() {
        const list = JSON.parse(localStorage.getItem(storage_key_board_list) ?? '[]');
        for (let i = 1; i <= 1000; i++) {
            if (list.includes(i))
                continue;
            return i;
        }

        return -1;
    }

    static get_board(puzzle_id) {
        const key = LocalStorageManager.make_board_key(puzzle_id);
        const puzzle = localStorage.getItem(key);

        return Board.import(puzzle);
    }

    static set_board(puzzle_id, board) {
        const key = LocalStorageManager.make_board_key(puzzle_id);
        const list = new Set(JSON.parse(localStorage.getItem(storage_key_board_list) ?? '[]'));

        const pre_puzzle = localStorage.getItem(key);
        const puzzle = board?.export();

        if (pre_puzzle == puzzle)
            return;

        const solved_data_key = LocalStorageManager.make_solved_data_key(puzzle_id);

        if (board == null) {
            localStorage.removeItem(key);
            localStorage.removeItem(solved_data_key);
            list.delete(puzzle_id);
        }
        else {
            const solved_data = Array.from({ length: board.large_height }, () =>
                Array.from({ length: board.large_width }, () =>
                    0
                )
            );

            localStorage.setItem(key, puzzle);
            localStorage.setItem(solved_data_key, JSON.stringify(solved_data));
            list.add(puzzle_id);
        }

        localStorage.setItem(storage_key_board_list, JSON.stringify(Array.from(list)));
    }

    static get_solve_data(puzzle_id) {
        const key = LocalStorageManager.make_solved_data_key(puzzle_id);
        const solved_data = localStorage.getItem(key);

        try {
            return JSON.parse(solved_data);
        } catch (e) {
            return null;
        }
    }

    static set_solve_data(puzzle_id, data) {
        const key = LocalStorageManager.make_solved_data_key(puzzle_id);
        localStorage.setItem(key, JSON.stringify(data));
    }
}

class Utility {
    static copy_to_clipboard(element) {
        const textarea = element;
        navigator.clipboard.writeText(textarea.value);
    }

    static get_parameter(key) {
        return new URL(location.href).searchParams.get(key);
    }

    static async delay(ms) {
        function _delay(resolve) {
            setTimeout(() => {
                resolve();
            }, ms)
        }

        await new Promise(_delay);
    }
}