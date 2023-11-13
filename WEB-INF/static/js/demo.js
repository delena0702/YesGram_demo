function init() {
    new DemoSimulator();
}

class DemoSimulator {
    state
    image_data
    solver
    board
    origin_board

    constructor() {
        this.state = 0;

        this.init();
    }

    init() {
        document.getElementById('input-image').onchange = this.select_image.bind(this);
    }

    next() {
        document.getElementById('move-next').click();
    }

    async select_image(e) {
        const { target: element } = e;
        if (!/\.(jpeg|jpg|png|gif|bmp)$/i.test(element.value)) {
            alert('이미지 파일만 업로드 가능합니다.');
            element.value = '';
            element.focus();
            return false;
        }

        const form_data = new FormData(document.getElementById('form-upload-image'));

        fetch('/demo/upload', {
            method: "POST",
            body: form_data
        }).then((res) =>
            res.json()
        ).then((image_data) => {
            this.image_data = image_data;
            this.print_binary_image();
            this.next();
        });

        return false;
    }

    async print_binary_image() {
        const { image_data } = this;

        const element = document.getElementById('card-method');
        const container = element.parentElement;
        const base = element.cloneNode(true);

        container.removeChild(element);
        base.id = '';

        for (const key in image_data) {
            const node = base.cloneNode(true);
            const { data, desc } = image_data[key];

            node.querySelector('#card-title').textContent = key;
            node.querySelector('#card-title').id = '';
            node.querySelector('#card-text').textContent = desc;
            node.querySelector('#card-text').id = '';

            const canvas = node.querySelector('#card-canvas');
            const puzzle = await Board.import_by_image(1, 1, data[0].length, data.length, data, true);
            draw_board(canvas, puzzle);
            node.querySelector('#card-canvas').id = '';

            node.querySelector('#button-select-binary-image').onclick = () => {
                this.board = new PuzzleBoard(puzzle.small_width, puzzle.small_height);
                this.board.board = puzzle.data;

                this.origin_board = new PuzzleBoard(puzzle.small_width, puzzle.small_height);
                this.origin_board.board = puzzle.data.map(x => x.map(x => x));

                this.select_binary_image();
            };
            node.querySelector('#button-select-binary-image').id = '';

            container.appendChild(node);
        }
    }

    async select_binary_image() {
        const { board } = this;
        this.next();

        this.ctx = document.getElementById('canvas-make-puzzle').getContext('2d');
        this.ctx.canvas.width = 1500;
        this.ctx.canvas.height = 1000;

        const solver = new Solver(board.width, board.height);
        this.solver = solver;
        await this.draw_change_solve();

        solver.board.change_listener = async (change_data) => {
            this.draw_change_solve(change_data);
            await Utility.delay(0);
        };

        this.ctx.canvas.onclick = async function _click () {
            this.ctx.canvas.onclick = null;
            
            solver.board.board = board.board.map(x => x.map(x => x));
            await solver.make_solvable_puzzle();
            this.draw_change_solve();
    
            document.getElementById('button-solve').classList.remove('invisible');
            document.getElementById('button-solve').onclick = this.show_solve.bind(this);

            this.ctx.canvas.onclick = _click.bind(this);
        }.bind(this);
    }

    async show_solve() {
        this.next();

        this.ctx = document.getElementById('canvas-solve-puzzle').getContext('2d');
        this.ctx.canvas.width = 1500;
        this.ctx.canvas.height = 1000;

        const hint = Solver.make_hint_from_array(this.solver.board.board);
        this.solver.attach_hint(hint);
        this.solver.board.clear_board();
        await this.solver.solve();
        this.draw_change_solve();
    }

    draw_change_solve(change_data) {
        const ratio = 0.01;
        const { min, max } = Math;

        const { solver, ctx } = this;
        const { board } = solver;
        let { width: canvas_width, height: canvas_height } = ctx.canvas;

        const { width, height, hint, board: arr } = board;
        const [hint_width, hint_height] = Array.from({ length: 2 }, (_, i) =>
            max(...hint[i].map(x => x.length), 1)
        );
        const [real_width, real_height] = [width + hint_width, height + hint_height];

        ctx.save();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas_width, canvas_height);

        ctx.translate(canvas_width * ratio, canvas_height * ratio);

        canvas_width = canvas_width * (1 - 2 * ratio);
        canvas_height = canvas_height * (1 - 2 * ratio);

        const gap = min(canvas_width / real_width, canvas_height / real_height);
        ctx.translate(
            (canvas_width - gap * real_width) / 2,
            (canvas_height - gap * real_height) / 2,
        );
        canvas_width = gap * real_width;
        canvas_height = gap * real_height;

        ctx.fillStyle = "#000000";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${0 | gap * 0.6}px consolas`;

        for (let i = 0; i < height; i++) {
            let h = hint[0][i];
            if (h.length == 0)
                h = [0];

            for (let j = 0; j < h.length; j++) {
                ctx.fillText(
                    h[j],
                    (hint_width - h.length + j + 0.5) * gap,
                    (hint_height + i + 0.5) * gap
                );
            }
        }

        for (let i = 0; i < width; i++) {
            let h = hint[1][i];
            if (h.length == 0)
                h = [0];

            for (let j = 0; j < h.length; j++) {
                ctx.fillText(
                    h[j],
                    (hint_width + i + 0.5) * gap,
                    (hint_height - h.length + j + 0.5) * gap
                );
            }
        }

        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
                ctx.save();
                ctx.translate((hint_width + j) * gap, (hint_height + i) * gap);
                this.draw_tile(arr[i][j], gap);
                ctx.restore();
            }
        }

        ctx.strokeStyle = "#000000";
        for (let i = hint_height; i <= real_height; i++) {
            ctx.beginPath();
            ctx.moveTo((0) * real_width * gap, (i) * gap);
            ctx.lineTo((1) * real_width * gap, (i) * gap);
            ctx.stroke();
        }

        for (let j = hint_width; j <= real_width; j++) {
            ctx.beginPath();
            ctx.moveTo((j) * gap, (0) * real_height * gap);
            ctx.lineTo((j) * gap, (1) * real_height * gap);
            ctx.stroke();
        }

        if (!change_data) {
            ctx.restore();
            return;
        }

        const [now, data] = change_data;
        const queue = [now, ...data];

        for (let i = queue.length - 1; i >= 0; i--) {
            const line = queue[i];
            if (i)
                ctx.fillStyle = "#ffff0044";
            else
                ctx.fillStyle = "#00ff0044";

            if (line < height) {
                ctx.fillRect(
                    (0) * gap,
                    (hint_height + line) * gap,
                    (real_width) * gap,
                    (1) * gap
                );
            }
            else {
                ctx.fillRect(
                    (hint_width + line - height) * gap,
                    (0) * gap,
                    (1) * gap,
                    (real_height) * gap
                );
            }
        }

        ctx.restore();
    }

    draw_tile(tile, size) {
        const { ctx } = this;

        ctx.save();

        switch(tile) {
            case 0:
                break;

            case 1:
                ctx.fillStyle = `#444444`;
                ctx.fillRect(0, 0, size, size);
                break;

            case 2:
                ctx.strokeStyle = `#aaaaaa`;
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.moveTo(0 * size, 0 * size);
                ctx.lineTo(1 * size, 1 * size);
                ctx.moveTo(1 * size, 0 * size);
                ctx.lineTo(0 * size, 1 * size);
                ctx.stroke();
                break;

            case 3:
                ctx.fillStyle = `#abcdef`;
                ctx.fillRect(0, 0, size, size);
                ctx.fillStyle = `#000000`;
                ctx.fillText("?", size / 2, size / 2);
                break;

            case -1:
                ctx.fillStyle = `#ff0000`;
                ctx.fillRect(0, 0, size, size);
                break;
        }

        ctx.restore();
    }
}

function draw_board(canvas, puzzle) {
    const { min } = Math;
    const { width: c_width, height: c_height } = canvas;
    const { large_width, large_height, small_width, small_height } = puzzle;
    const width = large_width * small_width;
    const height = large_height * small_height;

    const ctx = canvas.getContext('2d');
    ctx.save();
    ctx.fillStyle = "#dddddd";
    ctx.fillRect(0, 0, c_width, c_height);

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

    ctx.restore();
}

init();