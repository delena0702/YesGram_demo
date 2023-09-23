function init() {
    const pid = 0 | Utility.get_parameter('pid');
    const board = LocalStorageManager.get_board(pid);
    img_board = new BoardContext('img-board', board, ConfigValue.MODE_SMALL_EDIT);
}

init();

{/* <a id="button-check" class="list-group-item list-group-item-action">유일성 체크하기</a>
<a id="button-undo" class="list-group-item list-group-item-action">Undo</a>
<a id="button-reset" class="list-group-item list-group-item-action">Reset</a>
<a id="button-return" href="" class="list-group-item list-group-item-action">전체 퍼즐로 돌아가기</a> */}