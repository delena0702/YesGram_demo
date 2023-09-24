from flask import Flask, request, render_template, send_from_directory
from werkzeug.utils import secure_filename
import os

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/")
def hello_world():
    return send_from_directory('static', 'upload.html')

@app.route('/upload', methods=['POST'])
def upload_image():
    if 'image' not in request.files:
        return '이미지를 선택해주세요.'
    
    file = request.files['image']

    if file.filename == '':
        return '파일을 선택하지 않았습니다.'
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        return '이미지 업로드 성공!'

    return '허용되지 않는 파일 형식입니다.'
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=80)