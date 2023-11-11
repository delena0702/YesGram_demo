import cv2
import numpy as np

class ImagePreprocessing:
    def __init__(self, src) -> None:
        self.src = src

    # 이미지를 size로 축소하는 함수
    def modifyImageSize(_src, width = 100, height = 100, interpolation = cv2.INTER_LINEAR):
        _src = cv2.resize(_src, (width, height), interpolation=interpolation)
        return _src

    def CLAHE(src, clip = 3.0, tsize = 8):
        dst = src.copy()
        
        clahe = cv2.createCLAHE(clipLimit=clip, tileGridSize=(tsize, tsize))
        dst = clahe.apply(dst)
        return dst

    def HE(src):
        dst = src.copy()
        dst= cv2.equalizeHist(src)
        return dst

class ImageVisualization:
    def __init__(self) -> None:
        pass


class ImageOutputProcessor:
    # 흰색(255)값을 1로 변경하는 함수
    def imageOutput(src, path):
        dst = src.astype(float) / 255
        if(path is not None):
            np.savetxt(path, dst, fmt='%d', delimiter=',')
            
        return dst.tolist()

class ImageSegmentation:
    def __init__(self, src) -> None:
        self.src = src

    # Ostu's Method
    def otsuMethod(_src, dist = 5, sigma = 100, clahe = False, width=100, height=100):
        _src = cv2.bilateralFilter(_src, dist, sigma, sigma)
        
        h, w = _src.shape
        if((h < height and w < width) or (h <= 100 and w <= 100)):
            t, res = cv2.threshold(_src, -1, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
            
            res = ImagePreprocessing.modifyImageSize(res, width, height, cv2.INTER_CUBIC)
            
            t, res = cv2.threshold(res, -1, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
            
            return t, res
        else:
            if(clahe):
                _src = ImagePreprocessing.CLAHE(_src)
            
            h, w = _src.shape
            if(h <= height and w <= width):
                h_ratio = height / h
                w_ratio = width / w
                
            
            _src= ImagePreprocessing.modifyImageSize(_src, width, height)

            t, res = cv2.threshold(_src, -1, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
            print('otsu threshold: ', t)

            return t, res

    # blk_size: 이미지를 몇등분 하는가? (n x n)
    # C: threshold 값에서 가감할 상수
    def adaptiveThreshold(_src, blk_size = 7, C = 4, dist = 3, sigma = 10, closing = True, width = 100, height = 100, method=1):
        h, w = _src.shape
        
        # Up scaling
        if(h <= height and w <= width):
            # upsc = ImagePreprocessing.modifyImageSize(_src, width, height, cv2.INTER_CUBIC)
            
            if(method==1):
                res = cv2.adaptiveThreshold(_src, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, blk_size, C)
                
            elif(method==2):
                res = cv2.adaptiveThreshold(_src, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, blk_size, C)

            # Up scaling
            res = ImagePreprocessing.modifyImageSize(res, width, height, cv2.INTER_CUBIC)
            t, res = cv2.threshold(res, -1, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
            
            return res
        
        # Down scaling
        else:
            if(closing):
                if(h>= 1000 and w >= 1000):
                    _src= ImagePreprocessing.modifyImageSize(_src, (int)(w/2), (int)(h/2))

                    w_rat = (int)((w/2) / width)
                    if(w_rat % 2 == 0):
                        w_rat -= 1
                    
                elif(h >= 500 and w >= 500):
                    _src= ImagePreprocessing.modifyImageSize(_src, (int)(w*1.2), (int)(h*1.2))

                    w_rat = (int)((w*1.2) / width)
                    if(w_rat % 2 == 0):
                        w_rat -= 1
                else:
                    _src = ImagePreprocessing.modifyImageSize(_src, 500, 500)
                    
                    w_rat = (int)(500 / width)
                    if(w_rat % 2 == 0):
                        w_rat -= 1
                
                        
                # bilateral filter
                _src = cv2.bilateralFilter(_src, dist, sigma, sigma)

                kernel = np.ones((3, 3), np.uint8)
                
                if(method==1):
                    res = cv2.adaptiveThreshold(_src, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, blk_size * (int)(w_rat), C)
                    
                    # Closing
                    res = cv2.erode(res, kernel, iterations=1)
                    res = cv2.dilate(res, kernel, iterations=1)
                    
                    
                    # Downscale image
                    res = ImagePreprocessing.modifyImageSize(res, width, height)
                    
                    res = cv2.adaptiveThreshold(res, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, blk_size, C)

                elif(method==2):
                    res = cv2.adaptiveThreshold(_src, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, blk_size * (int)(w_rat), C)
                    
                    # Closing
                    res = cv2.erode(res, kernel, iterations=1)
                    res = cv2.dilate(res, kernel, iterations=1)

                    res = ImagePreprocessing.modifyImageSize(res, width, height)
                    
                    res = cv2.adaptiveThreshold(res, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, blk_size, C)

            return res
            

def ImageProcessor(src, width, height):
    src = cv2.imread(src, cv2.IMREAD_COLOR)
    if src is None:
        print("Image load failed!")
        return {}
    
    # Gray Scale
    gray = cv2.cvtColor(src, cv2.COLOR_RGB2GRAY)
    
    #서버에서 적절한 파일명을 가진 src가 전달되었다고 가정,
    t1, otsu = ImageSegmentation.otsuMethod(gray, clahe=True, width=width, height=height)
    aver = ImageSegmentation.adaptiveThreshold(gray, dist = 5, sigma=100, closing=True, width=width, height=height, method=1)
    gaus = ImageSegmentation.adaptiveThreshold(gray, dist = 5, sigma=100, closing=True, width=width, height=height, method=2)

    
    # 255 -> 1
    otsu = ImageOutputProcessor.imageOutput(otsu, None)
    aver = ImageOutputProcessor.imageOutput(aver, None)
    gaus = ImageOutputProcessor.imageOutput(gaus, None)
    
    json_obj = {
        'Otsu\'s method': {
            'desc': "대비가 큰 이미지에 적절하며, 퍼즐의 크기가 클 때 적합한 방법입니다.",
            'data': otsu
            }, 
        'Adaptive threshold-Arithmetic': {
            'desc': "대비가 낮은 이미지에 적절하며, 선이 굵고 진하게 나타나는 방법입니다.",
            'data': aver
            }, 
        'Adaptive threshold-Gaussian': {
            'desc': "대비가 낮은 이미지에 적절하며, 세세한 부분이 잘 나타나는 방법입니다.",
            'data': gaus
            }
        }

    return json_obj


if __name__ == '__main__':
    ImageProcessor("ImageProcessor/image/lenna.png", 100, 100)
    cv2.waitKey()
    cv2.destroyAllWindows()
