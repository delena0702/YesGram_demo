from flask import Flask, request, render_template
from werkzeug.utils import secure_filename
import os

from ImageProcessor import kmean

# 이미지 확장자 제한 - 추후 변경 가능
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}
UPLOAD_FOLDER = 'WEB-INF\\static\\image'

app = Flask(__name__, static_url_path='/static', static_folder='WEB-INF/static', template_folder='WEB-INF/templates')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# 파일 확장자 검사
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


# 메인 페이지
@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')

# 퍼즐을 이미지로 생성
@app.route('/generate/image/select', methods=['GET'])    
def generate_image1():
    return render_template('generate_image1.html')


@app.route('/generate/image/result', methods=['GET'])    
def uploadImage():
    return render_template('upload.html')


@app.route('/generate/image/result', methods=['POST'])    
def uploadImageResult():
    # 파일 이름: <image>를 요청함 - 변수 이름
    img = request.files['image']
    
    #이미지 파일 없음
    if not img:
        return render_template('404.html')
    
    # 이미지 확장자 불일치
    if not allowed_file(img.filename):
        return render_template('404.html')

    img_name = secure_filename(img.filename)
    img_path = os.path.join(app.config['UPLOAD_FOLDER'], img_name)
    img.save(img_path)
    
    large_width = int(request.form['large-width'])
    small_width = int(request.form['small-width'])
    large_height = int(request.form['large-height'])
    small_height = int(request.form['small-height'])
    
    width = large_width * small_width
    height = large_height * small_height
    
    # 이미지 처리 결과
    segmented_image = kmean.ImageProcessor(img_path, width, height)
    
    # solver 모듈과 연결 필요
    
    # 처리된 이미지 전달
    return render_template('generate_image2.html',
                           image_data=segmented_image,
                           large_width = large_width,
                           small_width = small_width,
                           large_height = large_height,
                           small_height = small_height)


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

# 임시 404 Html
@app.route('/edit/big', methods=['GET'])    
def editBig():
    pid = request.args.get('pid')
    if(pid is None):
        return render_template('404.html')
    return render_template('edit_big.html')

# 임시 404 Html
@app.route('/edit/small', methods=['GET'])    
def editSmall():
    pid = request.args.get('pid')
    if(pid is None):
        return render_template('404.html')

    x = request.args.get('x')
    if(x is None):
        return render_template('404.html')
    
    y = request.args.get('y')
    if(y is None):
        return render_template('404.html')
    return render_template('edit_small.html')

@app.route('/import', methods=['GET'])
def importPuzzle():
    return render_template('import.html')

@app.route('/export', methods=['GET'])
def exportPuzzle():
    return render_template('export.html')


@app.route('/solve/big', methods=['GET'])
def solveBig():
    pid = request.args.get('pid')
    if(pid is None):
        return render_template('404.html')
    return render_template('solve_big.html')



@app.route('/solve/small', methods=['GET'])
def sloveSmall():
    pid = request.args.get('pid')
    if(pid is None):
        return render_template('404.html')

    x = request.args.get('x')
    if(x is None):
        return render_template('404.html')
    
    y = request.args.get('y')
    if(y is None):
        return render_template('404.html')
    return render_template('solve_small.html')

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0', port=80) 