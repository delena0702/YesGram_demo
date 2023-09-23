// Default Config Values
const storage_key_board = 'YESGRAM_DATA_BOARD';
const storage_key_solve_data = 'YESGRAM_DATA_SOLVE';

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
}

class Board {
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

        const width = large_width * small_width;
        const height = large_height * small_height;;
        this.data = Array.from({ length: height }, () =>
            Array.from({ length: width }, () =>
                2
            )
        );
    }

    export() {
        const { large_width, large_height, small_width, small_height, data } = this;
        const result = {
            size: [large_width, large_height, small_width, small_height],
            data: data
        };

        return btoa(JSON.stringify(result));
    }

    static import(string) {
        try {
            const obj = JSON.parse(atob(string));
            const [large_width, large_height, small_width, small_height] = obj.size;
            const board = new Board(large_width, large_height, small_width, small_height);
            board.data = obj.data;

            return board
        } catch (e) {
            return null;
        }
    }

    static testtest() {
        // TEST!!!!!!!!!!!!!!!!!!!!!!!!!!!
        const board = new Board(5, 10, 6, 5);
        board.data = [[2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2], [2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2], [2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2], [2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2], [2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2], [2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2], [2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2], [2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2], [1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1], [1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1], [2, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 2], [2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2], [2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2], [1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1], [2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2], [2, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2], [2, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2], [2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2], [1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1], [2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2], [2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2], [2, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 2], [1, 1, 1, 1, 1, 1, 2, 2, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 1, 1, 1, 1, 1, 1], [1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1], [1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 2, 2, 2, 2, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1], [2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2], [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2], [2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2], [2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 2, 1, 2, 2, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2], [2, 2, 1, 1, 2, 2, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2], [2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2], [2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2], [2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2], [2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2]];
        return board;
    }
}

class BoardContext {
    element
    context
    board
    small_x
    small_y
    mode
    solve_data

    static CANVAS_SIZE = 500

    constructor(id, board, mode, param) {
        this.element = document.getElementById(id);
        this.context = null;
        this.board = board;
        this.mode = mode;

        if (param) {
            Object.assign(this, param);
        }

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
            const element = object.get_element();
            const max_size = 0 | document.documentElement.clientHeight * config['board_max_height_ratio'];
            const size = Math.min(element.parentElement.clientWidth, max_size);

            element.width = BoardContext.CANVAS_SIZE;
            element.height = BoardContext.CANVAS_SIZE;

            element.style.width = `${size}px`;
            element.style.height = `${size}px`;

            object.display();
        }

        window.addEventListener(
            'resize', (e) => {
                resize_element();
            }
        );

        resize_element();
    }

    init_canvas() {
        const object = this;
        const { element } = this;
        this.context = element.getContext('2d');
    }

    fit_ratio() {
        const { element, context: ctx } = this;
        const { width: c_width, height: c_height } = element;
        const ratio = config['board_context_padding_ratio'];

        ctx.translate(c_width * ratio, c_height * ratio);
        return [c_width * (1 - 2 * ratio), c_height * (1 - 2 * ratio)];
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
            // case ConfigValue.MODE_SMALL_SOLVE:
            //     this.display_small_edit();
            //     break;
        }
    }

    display_big_show() {
        const { element, context: ctx, board } = this;
        let { width: c_width, height: c_height } = element;

        const { large_width, large_height, small_width, small_height } = board;
        const width = large_width * small_width;
        const height = large_height * small_height;

        ctx.save();
        ctx.fillStyle = "#aaaaaa";
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;

        [c_width, c_height] = this.fit_ratio();
        const gap = Math.min(0 | c_width / width, 0 | c_height / height);
        const offset_x = 0 | (c_width - gap * width) / 2;
        const offset_y = 0 | (c_height - gap * height) / 2;

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                this.fillTile(
                    (j) * gap + offset_x,
                    (i) * gap + offset_y,
                    gap,
                    gap,
                    board.data[i][j] + 100
                );
            }
        }

        ctx.lineWidth = 2;

        for (let i = 0; i <= large_height; i++) {
            ctx.beginPath();
            ctx.moveTo(offset_x + (0) * width * gap, offset_y + (i) * small_height * gap);
            ctx.lineTo(offset_x + (1) * width * gap, offset_y + (i) * small_height * gap);
            ctx.stroke();
        }

        for (let j = 0; j <= large_width; j++) {
            ctx.beginPath();
            ctx.moveTo(offset_x + (j) * small_width * gap, offset_y + (0) * height * gap);
            ctx.lineTo(offset_x + (j) * small_width * gap, offset_y + (1) * height * gap);
            ctx.stroke();
        }

        ctx.restore();
    }

    display_small_show() {
        const { element, context: ctx, board, small_x: x, small_y: y } = this;
        let { width: c_width, height: c_height } = element;

        const { large_width, large_height, small_width, small_height } = board;
        const width = large_width * small_width;
        const height = large_height * small_height;

        ctx.save();
        ctx.fillStyle = "#aaaaaa";
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;

        [c_width, c_height] = this.fit_ratio();
        const gap = Math.min(0 | c_width / small_width, 0 | c_height / small_height);
        const offset_x = 0 | (c_width - gap * small_width) / 2;
        const offset_y = 0 | (c_height - gap * small_height) / 2;

        for (let i = 0; i < small_height; i++) {
            for (let j = 0; j < small_width; j++) {
                this.fillTile(
                    offset_x + (j) * gap,
                    offset_y + (i) * gap,
                    gap,
                    gap,
                    board.data[y * small_height + i][x * small_width + j]
                );
            }
        }

        ctx.lineWidth = 2;

        for (let i = 0; i <= small_height; i++) {
            ctx.beginPath();
            ctx.moveTo(offset_x + (0) * small_width * gap, offset_y + (i) * gap);
            ctx.lineTo(offset_x + (1) * small_width * gap, offset_y + (i) * gap);
            ctx.stroke();
        }

        for (let j = 0; j <= small_width; j++) {
            ctx.beginPath();
            ctx.moveTo(offset_x + (j) * gap, offset_y + (0) * small_height * gap);
            ctx.lineTo(offset_x + (j) * gap, offset_y + (1) * small_height * gap);
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

        const { element, context: ctx, board, solve_data } = this;
        let { width: c_width, height: c_height } = element;

        const { large_width, large_height, small_width, small_height } = board;
        const width = large_width * small_width;
        const height = large_height * small_height;

        ctx.save();
        ctx.fillStyle = "#aaaaaa";
        ctx.strokeStyle = "#333333";
        ctx.lineWidth = 1;

        [c_width, c_height] = this.fit_ratio();

        const gap = Math.min(0 | c_width / width, 0 | c_height / height);
        const offset_x = 0 | (c_width - gap * width) / 2;
        const offset_y = 0 | (c_height - gap * height) / 2;

        ctx.font = `${0 | small_height * gap / 3}px consolas`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";


        for (let i = 0; i < large_height; i++) {
            for (let j = 0; j < large_width; j++) {
                if (solve_data[i][j])
                    continue;

                ctx.fillStyle = "#888888";
                ctx.fillRect(
                    offset_x + (j) * small_width * gap,
                    offset_y + (i) * small_height * gap,
                    (1) * small_width * gap,
                    (1) * small_height * gap);

                ctx.fillStyle = "#ffffff";
                ctx.fillText("?",
                    offset_x + (j + 0.5) * small_width * gap,
                    offset_y + (i + 0.5) * small_height * gap);
            }
        }

        ctx.lineWidth = 2;

        for (let i = 0; i <= large_height; i++) {
            ctx.beginPath();
            ctx.moveTo(offset_x + (0) * width * gap, offset_y + (i) * small_height * gap);
            ctx.lineTo(offset_x + (1) * width * gap, offset_y + (i) * small_height * gap);
            ctx.stroke();
        }

        for (let j = 0; j <= large_width; j++) {
            ctx.beginPath();
            ctx.moveTo(offset_x + (j) * small_width * gap, offset_y + (0) * height * gap);
            ctx.lineTo(offset_x + (j) * small_width * gap, offset_y + (1) * height * gap);
            ctx.stroke();
        }
    }

    fillTile(x, y, w, h, type) {
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
}

class LocalStorageManager {
    static make_board_key(puzzle_id) {
        return `${storage_key_board}-${puzzle_id}`;
    }

    static get_empty_puzzle_id() {
        for (let i = 1; i <= 100; i++) {
            if (localStorage.getItem(this.make_board_key(i)))
                continue;

            return i;
        }

        return -1;
    }

    static get_board(puzzle_id) {
        const key = LocalStorageManager.make_board_key(puzzle_id);
        const puzzle = localStorage.getItem(key);
        if (!puzzle)
            return null;

        return Board.import(puzzle);
    }

    static set_board(puzzle_id, board) {
        const key = LocalStorageManager.make_board_key(puzzle_id);
        localStorage.setItem(key, board.export());
    }

    static get_solve_data(puzzle_id) {
        // todo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        return LocalStorageManager.testtest()
    }

    static set_solve_data(puzzle_id, data) {
        // todo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    }

    static testtest() {
        const retval = Array.from({ length: 10 }, (_, i) =>
            Array.from({ length: 5 }, (_, j) =>
                ((i + j) % 2 == 1)
            )
        );
        console.log(retval);
        return retval;
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
}