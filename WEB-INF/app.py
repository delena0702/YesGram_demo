from flask import Flask, request, render_template

app = Flask(__name__, static_url_path='/static', static_folder='static')


# 메인 페이지
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# 퍼즐을 이미지로 생성
@app.route('/generate/image/select', methods=['GET'])    
def generate_image1():
    return render_template('generate_image1.html')


# 해당 부분 <수정>해야 함
@app.route('/generate/image/result', methods=['POST'])    
def imsgeResult():
    return render_template('generate_image2.html')


# 퍼즐을 직접 생성합니다.
@app.route('/generate/manual', methods=['GET'])    
def manual():
    return render_template('generate_manual.html')

# 퍼즐 생성 방식
@app.route('/generate/select', methods=['GET'])    
def select():
    return render_template('generate_select.html')

# 퍼즐 목록
@app.route('/list', methods=['GET'])    
def list():
    return render_template('list.html')

# 퍼즐 수정 (전체)
@app.route('/edit/big', methods=['GET'])    
def editBig():
    pid = request.args.get('pid')
    if(pid is None):
        # 404 Error
        return 'X값이 존재하지 않습니다.'
    return f'pid = {pid}'
    # return render_template('edit_big.html')

# 퍼즐 수정 (부분)
# 이후 <수정>해야 함 - 404 Error
@app.route('/edit/small', methods=['GET'])    
def editSmall():
    pid = request.args.get('pid')
    if(pid is None):
        # 404 Error
        return 'X값이 존재하지 않습니다.'

    x = request.args.get('x')
    if(x is None):
        # 404 Error
        return 'X값이 존재하지 않습니다.'
    
    y = request.args.get('y')
    if(y is None):
        # 404 Error
        return 'y값이 존재하지 않습니다.'

    return f'pid = {pid}, x = {x} , y = {y}'
    # return render_template('edit_small.html')

@app.route('/import')
def importPuzzle():
    return render_template('import.html')

@app.route('/export')
def exportPuzzle():
    return render_template('export.html')

# <수정> - 404 Error
@app.route('/solve/big')
def solveBig():
    pid = request.args.get('pid')
    if(pid is None):
        # 404 Error
        return '유효하지 않는 pid입니다.'

    return render_template('solve_big.html')

# <수정> - 404 Error
@app.route('/solve/small')
def sloveSmall():
    pid = request.args.get('pid')
    if(pid is None):
        return '유효하지 않는 pid입니다.'

    x = request.args.get('x')
    if(x is None):
        # 404 Error
        return 'X값이 존재하지 않습니다.'
    
    y = request.args.get('y')
    if(y is None):
        # 404 Error
        return 'y값이 존재하지 않습니다.'

    return f'pid = {pid}, x = {x}, y = {y}'
    # return render_template('solve_big.html')


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80) 