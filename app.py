from flask import Flask, request, send_from_directory
from werkzeug.utils import secure_filename

from ImageProcessor import kmean

app = Flask(__name__, static_url_path='/WEB-INF/static', static_folder='static')

# 이미지 확장자 제한 - 추후 변경 가능
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# 파일 확장자 검사
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# 메인 페이지
@app.route('/', methods=['GET'])
def index():
    return send_from_directory('WEB-INF/static', 'index.html')

# 퍼즐을 이미지로 생성
@app.route('/generate/image/select', methods=['GET'])    
def generate_image1():
    return send_from_directory('WEB-INF/static', 'generate_image1.html')


@app.route('/generate/image/result', methods=['GET'])    
def uploadImage():
    return send_from_directory('WEB-INF/static', 'upload.html')


@app.route('/generate/image/result', methods=['POST'])    
def uploadImageResult():
    # 파일 이름: <image>를 요청함
    img = request.files['image']
    if not img:
        return send_from_directory('WEB-INF/static', '404.html')
    
    if not allowed_file(img.filename):
        return send_from_directory('WEB-INF/static', '404.html')

    imgname = secure_filename(img.filename)
    img_name = hashlib.md5(str(dt.datetime.now()).encode('utf-8')).hexdigest()
    img_path = os.path.join('static/img', img_name + os.path.splitext(img.filename)[-1])

    
    # 변수 이름: <width, height> 값을 요청함 - 일단 들어온다고 가정하겠습니다.
    # width = int(request.form['width'])
    # height = int(request.form['height'])
    
    # 변수 이름: <row, column> 값을 요청함
    # row = int(request.form['row'])
    # column = int(request.form['column'])
    
    # res: JSON 형식 파일
    # 함수 이름 바꿔야겠다
    segmented_image = kmean.ImageProcessor(img, 100, 100)
    print(segmented_image)
    # 처리된 이미지 전달 어떻게?
    
    return send_from_directory('WEB-INF/static', 'generate_image2.html')


# 퍼즐을 직접 생성합니다.
@app.route('/generate/manual', methods=['GET'])    
def manual():
    return send_from_directory('WEB-INF/static', 'generate_manual.html')

# 퍼즐 생성 방식
@app.route('/generate/select', methods=['GET'])    
def select():
    return send_from_directory('WEB-INF/static', 'generate_select.html')

# 퍼즐 목록
@app.route('/list', methods=['GET'])    
def list():
    return send_from_directory('WEB-INF/static', 'list.html')

# 임시 404 Html
@app.route('/edit/big', methods=['GET'])    
def editBig():
    pid = request.args.get('pid')
    if(pid is None):
        return send_from_directory('WEB-INF/static', '404.html')

    return send_from_directory('WEB-INF/static', 'edit_big.html')

# 임시 404 Html
@app.route('/edit/small', methods=['GET'])    
def editSmall():
    pid = request.args.get('pid')
    if(pid is None):
        return send_from_directory('WEB-INF/static', '404.html')

    x = request.args.get('x')
    if(x is None):
        return send_from_directory('WEB-INF/static', '404.html')
    
    y = request.args.get('y')
    if(y is None):
        return send_from_directory('WEB-INF/static', '404.html')

    return send_from_directory('WEB-INF/static', 'edit_small.html')


@app.route('/import', methods=['GET'])
def importPuzzle():
    return send_from_directory('WEB-INF/static', 'index.html')

@app.route('/export', methods=['GET'])
def exportPuzzle():
    return send_from_directory('WEB-INF/static', 'export.html')

# <수정> - 404 Error
@app.route('/solve/big', methods=['GET'])
def solveBig():
    pid = request.args.get('pid')
    if(pid is None):
        return send_from_directory('WEB-INF/static', '404.html')
    
    return send_from_directory('WEB-INF/static', 'solve_big.html')


# 임시 404 Html
@app.route('/solve/small', methods=['GET'])
def sloveSmall():
    pid = request.args.get('pid')
    if(pid is None):
        return send_from_directory('WEB-INF/static', '404.html')

    x = request.args.get('x')
    if(x is None):
        return send_from_directory('WEB-INF/static', '404.html')
    
    y = request.args.get('y')
    if(y is None):
        return send_from_directory('WEB-INF/static', '404.html')

    return send_from_directory('WEB-INF/static', 'solve_small.html')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80) 