function init() {
    new DemoSimulator();
}

class DemoSimulator {
    state
    image_data

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
            this.print_image();
            this.next();
        });

        return false;
    }

    print_image() {
        const { image_data } = this;

        const element = document.getElementById('card-method');
        const container = element.parentElement;
        const base = element.cloneNode(true);

        container.removeChild(element);
        base.id = '';

        console.log(image_data);
        for (const key in image_data) {
            const node = base.cloneNode(true);
            const { data, desc } = image_data[key];

            node.querySelector('#card-title').textContent = key;
            node.querySelector('#card-title').id = '';
            node.querySelector('#card-text').textContent = desc;
            node.querySelector('#card-text').id = '';

            const canvas = node.querySelector('#card-canvas');
            const puzzle = Board.import_by_image(1, 1, data[0].length, data.length, data, true);
            draw_board(canvas, puzzle);
            node.querySelector('#card-canvas').id = '';

            container.appendChild(node);
        }
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