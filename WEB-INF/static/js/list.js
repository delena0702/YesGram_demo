function init() {
    list_all();
}

function list_all() {
    const list_column = document.getElementById('list-column');
    const list_container = list_column.parentElement;
    const base_node = list_column.cloneNode(true);
    list_column.parentElement.removeChild(list_column);

    const puzzle_list = LocalStorageManager.get_puzzle_list();

    const all_switch = [];
    for (const puzzle_id of puzzle_list) {
        const node = base_node.cloneNode(true);
        const puzzle = LocalStorageManager.get_board(puzzle_id);
        const solve_data = LocalStorageManager.get_solve_data(puzzle_id);

        node.querySelector("#list-column > div").addEventListener('click', () => {
            location.href = `/solve/big?pid=${puzzle_id}`;
        });
        node.querySelector("#list-column .card-title").textContent = puzzle.title;
        node.querySelector("#list-column .card-text").textContent
            = `Puzzle Size : ${puzzle.small_width} x ${puzzle.small_height} (Total : ${puzzle.large_width} x ${puzzle.large_height})`;

        node.querySelector("#list-column > div > div > div > div > div > a:nth-child(1)").href = `/export?pid=${puzzle_id}`;
        node.querySelector("#list-column > div > div > div > div > div > a:nth-child(2)").href = `/edit/big?pid=${puzzle_id}`;
        node.querySelector("#list-column > div > div > div > div > div > a:nth-child(3)").addEventListener('click', (e) => {
            e.stopPropagation();
            LocalStorageManager.set_board(puzzle_id, null);
            location.href = "/list";
        });

        const check = node.querySelector("#list-column > div > div > div > div > div:nth-child(2) > div > input");
        const canvas = node.querySelector("#list-column > div > div > canvas");

        check.addEventListener('click', (e) => {
            console.log(e.target.checked);
            draw_board(canvas, puzzle, solve_data, e.target.checked);
            e.stopPropagation();
        });

        draw_board(canvas, puzzle, solve_data, true);

        node.id = "";
        list_container.appendChild(node);
        all_switch.push(check);
    }

    const total_switch = document.getElementById('input-total-blind');
    total_switch.addEventListener('click', (e) => {
        for (check of all_switch) {
            check.checked = !e.target.checked;
            check.dispatchEvent(new MouseEvent('click'));
        }

        e.stopPropagation();
    });
}

function draw_board(canvas, puzzle, solve_data, state) {
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

                ctx.lineWidth = 1;
                ctx.strokeStyle = "#00000044";
                ctx.strokeRect(
                    (j) * small_width * gap,
                    (i) * small_height * gap,
                    (1) * small_width * gap,
                    (1) * small_height * gap,
                );
                
                ctx.fillStyle = "#000000";
                ctx.font = `${0 | (small_height * gap) / 2}px consolas`;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(
                    "?",
                    (j + 0.5) * small_width * gap,
                    (i + 0.5) * small_height * gap
                );
            }
        }
    }

    ctx.restore();
}

init();