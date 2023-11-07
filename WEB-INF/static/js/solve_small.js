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
        document.getElementById('modal-body').textContent = `123123`;
    
        const solve_data = LocalStorageManager.get_solve_data(pid);
        console.log(JSON.stringify(solve_data));
        solve_data[small_y][small_x] = 1;
        console.log(solve_data);
        LocalStorageManager.set_solve_data(pid, solve_data);
    
        const modal = new bootstrap.Modal(document.getElementById('modal-result'));
        modal.show();
    }
}

init();