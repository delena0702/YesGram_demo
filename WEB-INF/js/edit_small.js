function init() {
    img_board = new BoardContext('img-board', Board.testtest(), ConfigValue.MODE_SMALL_EDIT, {
        small_x: 1,
        small_y: 2
    });
}

init();

{/* <a id="button-check" class="list-group-item list-group-item-action">유일성 체크하기</a>
<a id="button-undo" class="list-group-item list-group-item-action">Undo</a>
<a id="button-reset" class="list-group-item list-group-item-action">Reset</a>
<a id="button-return" href="" class="list-group-item list-group-item-action">전체 퍼즐로 돌아가기</a> */}