function init() {
    console.log(image_data);
    console.log(large_width, large_height, small_width, small_height);

    create_element();
}

function create_element() {
    const base_node = document.querySelector("#card-image");
    const container = base_node.parentElement;
    container.removeChild(base_node);

    for (const method in image_data) {
        const description = image_data[method]['desc'];
        const image = image_data[method]['data'];
        const board = Board.import_by_image(large_width, large_height, small_width, small_height, image);
        const node = base_node.cloneNode(true);

        node.querySelector("#button-select").addEventListener('click', () => {
            const text = `${method} 필터를 적용한 이미지를 선택하시겠습니까?`;
            document.querySelector("#modal-confirm > div > div > div.modal-body").textContent = text;
            document.querySelector("#button-submit").onclick = (e)=>{
                if (document.querySelector("#input-title").value.trim())
                    board.title = document.querySelector("#input-title").value.trim();
                save_puzzle(board);
            };
        });
        
        node.querySelector("#card-image > div > div > h5").textContent = method;
        node.querySelector("#card-image > div > div > p").textContent = description;

        const canvas = node.querySelector("#output-puzzle");
        canvas.id = "";
        draw_board(canvas, board);

        node.id = "";
        container.appendChild(node);
    }
}

function save_puzzle(board) {
    const pid = LocalStorageManager.get_empty_puzzle_id();
    LocalStorageManager.set_board(pid, board);
    location.href = `/edit/big?pid=${pid}`;
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