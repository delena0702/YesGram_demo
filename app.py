from flask import Flask, request, render_template, send_from_directory

app = Flask(__name__, static_url_path='/static', static_folder='WEB-INF')


# 메인 페이지
@app.route('/', methods=['GET'])
def index():
    return send_from_directory('WEB-INF/static', 'index.html')
    # return render_template('index.html')

# 퍼즐을 이미지로 생성
@app.route('/generate/image/select', methods=['GET'])    
def generate_image1():
    return send_from_directory('WEB-INF/static', 'generate_image1.html')


# 해당 부분 <수정>해야 함
@app.route('/generate/image/result', methods=['POST'])    
def imsgeResult():
    "TODO !!!!!!!!!!!!!!!!!!!!!!!!!! 이미지 처리 필요"
    return send_from_directory('WEB-INF/static', 'generate_image2.html')


# 퍼즐을 직접 생성합니다.
@app.route('/generate/manual', methods=['GET'])    
def manual():
    return send_from_directory('WEB-INF/static', 'generate_image1.html')

# 퍼즐 생성 방식
@app.route('/generate/select', methods=['GET'])    
def select():
    return send_from_directory('WEB-INF/static', 'generate_select.html')

# 퍼즐 목록
@app.route('/list', methods=['GET'])    
def list():
    return send_from_directory('WEB-INF/static', 'list.html')

# 퍼즐 수정 (전체)
@app.route('/edit/big', methods=['GET'])    
def editBig():
    return send_from_directory('WEB-INF/static', 'edit_big.html')

# 퍼즐 수정 (부분)
# 이후 <수정>해야 함 - 404 Error
@app.route('/edit/small', methods=['GET'])    
def editSmall():
    return send_from_directory('WEB-INF/static', 'edit_small.html')

@app.route('/import')
def importPuzzle():
    return send_from_directory('WEB-INF/static', 'import.html')

@app.route('/export')
def exportPuzzle():
    return send_from_directory('WEB-INF/static', 'export.html')

# <수정> - 404 Error
@app.route('/solve/big')
def solveBig():
    return send_from_directory('WEB-INF/static', 'solve_big.html')

# <수정> - 404 Error
@app.route('/solve/small')
def sloveSmall():
    return send_from_directory('WEB-INF/static', 'solve_small.html')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80) 