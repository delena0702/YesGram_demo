from PIL import Image, ImageDraw, ImageFont
import pandas as pd
import json
import random
import string
import kmean
import numpy as np

import cv2
import image_similarity_measures
from image_similarity_measures.quality_metrics import rmse, fsim

def JSON2CSV(json_data):
    df = pd.json_normalize(json_data)
    csv_name = 'realTestResult.csv'
    
    # 파일 탐색
    try:
        # 기존 CSV 파일 불러오기
        df_csv = pd.read_csv(csv_name)
        
        # 새로운 데이터를 기존 데이터프레임에 추가
        df_csv = pd.concat([df_csv, df], ignore_index=True)

    except FileNotFoundError:
        df_csv = df
    
    df_csv.to_csv(csv_name, index=False)
    
def generateRandomXY(width, height):
    return [random.randint(0, width//2), random.randint(0, height//2), random.randint(width//2, width), random.randint(height//2, height)]

def generateRandomText(width, height):
    txt = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(txt)
    
    _xy = generateRandomXY(width, height)


    color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

    char_pool = string.ascii_lowercase
    _str = ''
        
    font_size = random.randint(20, 500)
    _font_pool = ["arial.ttf"]
    
    # Debug
    _f = random.choice(_font_pool)
    
    _font = ImageFont.truetype(_f, font_size)

    _length = random.randint(5, 20)
    for i in range(_length):
        _str += random.choice(char_pool)
        
    draw.text(_xy, _str, fill=color, font=_font, align="center")
    txt.save("random_text.png")
    return _f

def generateRandomImage(width, height):
    # 빈 이미지 생성
    image = Image.new("RGB", (width, height), "white")
    draw = ImageDraw.Draw(image)

    # 무작위로 색상 선택
    color = (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

    # 무작위로 도형 그리기
    shape_type = random.choice(['rectangle', 'ellipse', 'arc', 'pieslice', 'polygon', 'regular_polygon'])
    
    _xy = generateRandomXY(width, height)
    
    if shape_type == 'rectangle':
        draw.rectangle(_xy, fill=color)
        
    elif shape_type == 'ellipse':
        draw.ellipse(_xy, fill=color)
        
    elif shape_type == 'arc':
        _start = random.randint(0, 180)
        _end = random.randint(180,360)
        _width = random.randint(20,40)
        draw.arc(_xy, _start, _end, fill=color, width=_width)
        
    elif shape_type == 'pieslice':
        _start = random.randint(0, 180)
        _end = random.randint(180,360)
        _width = random.randint(20,40)
        draw.pieslice(_xy, _start, _end, fill=color, width=_width)
        
    elif shape_type == 'polygon':
        _points = random.randint(0, 20)
        for i in range(_points):
            _xy.append(random.randint(0, width))
            _xy.append(random.randint(0, height))
        draw.polygon(_xy, fill=color)
        
    elif shape_type == 'regular_polygon':
        _short = min(width, height)
        _rad = random.randint(_short // 10, _short // 2)
        _side = random.randint(3, 10)
        _rot = random.randint(0, 360)
        
        draw.regular_polygon((width//2, height//2, _rad), _side, _rot, fill=color)
        
    # 이미지 저장
    image.save("random_image.png")
    return shape_type

def testRandomImage(shape_type, gray):
    # src = cv2.imread("ImageProcessor/image/game1.jpg", cv2.IMREAD_COLOR)
    resize_gray = cv2.resize(gray, (100, 100), cv2.INTER_CUBIC)
        
    
    # 실행 시간
    json_data, otsu, aver, gaus = kmean.ImageTest.imageSegPreview(gray, 100, 100, vis=True)
    
    json_data = json.loads(json_data)
    

    otsu = np.expand_dims(otsu, axis=-1)
    aver = np.expand_dims(aver, axis=-1)
    gaus = np.expand_dims(gaus, axis=-1)
    resize_gray = np.expand_dims(resize_gray, axis=-1)
    
    json_data["otsu rate"] = round(fsim(resize_gray, otsu), 3)
    json_data["aver rate"] = round(fsim(resize_gray, aver), 3)
    json_data["gaus rate"] = round(fsim(resize_gray, gaus), 3)
    
    h, w = gray.shape
    
    json_data["shape type"] = shape_type
    json_data["width"] = w
    json_data["height"] = h

    return json_data

# 랜덤 이미지 생성
if __name__ == '__main__':
    
    # 1000 장의 무작위 이미지에 대하여?
    for i in range(30, 31):
        # 이미지 범위 내 임의 설정
        # width = random.randrange(5000, 10000, 1)
        # height = random.randrange(5000, 10000, 1)
        
        # shape_type = generateRandomImage(width, height)
        # text_type = generateRandomText(width, height)
        
        url = f"testImage/rand{i}.jpg"
        src = cv2.imread("testImage/rand23.jpg", cv2.IMREAD_COLOR)
        if src is None:
            print("Image load failed!")
            sys.exit()
        
        gray = cv2.cvtColor(src, cv2.COLOR_RGB2GRAY)

        j = testRandomImage('Image', gray)
        JSON2CSV(j)