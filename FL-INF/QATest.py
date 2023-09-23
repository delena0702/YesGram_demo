import cv2
import sys
import numpy as np
import matplotlib.pylab as plt

class ImageVisualization:
    def __init__(self) -> None:
        pass

    # 히스토그램 출력 함수
    def printHist(_src):
        hist = cv2.calcHist([_src], [0], None, [256], [0, 256])
        plt.plot(hist)

    # 0과 1의 비율을 출력하는 함수
    def printPercentage(_src):
        _src = _src.ravel()
        count_0 = 0
        count_1 = 0
        for i in range(0, _src.size):
            if(_src[i] == 0):
                count_0 += 1
            elif(_src[i] == 255):
                count_1 += 1
        
        
        p = count_0 / (count_0 + count_1)

        print("0: ", count_0)
        print("1: ", count_1)
        print("Percentage: ", count_0 / (count_0 + count_1) * 100 ,"%")

        return p

    def print3Srcs(name1, _src1, name2, _src2, name3, _src3, size = 100, Hist_num = True, otsu_t = 0):
        _src1, h, w = ImagePreprocessing.reduceImageSize(_src1)
        _src1 = cv2.cvtColor(_src1, cv2.COLOR_RGB2GRAY)

        res = {name1 : _src1, name2 : _src2, name3: _src3}
        for i , (key, value) in enumerate(res.items()):
            plt.subplot(221 + i)
            plt.title(key)
            plt.imshow(value, cmap= 'gray')
            plt.xticks([]);plt.yticks([]) 
        
        if(Hist_num):
            plt.subplot(224)
            plt.text(otsu_t, 0,
                    '|',
                    color = 'r',
                    horizontalalignment = 'center',
                    verticalalignment = 'top')
            
            ImageVisualization.printHist(_src1)
                
        plt.show()



class ImageThresholding:
    def OstuMethod(_src, dist = 5, sigma = 100):
        _src = cv2.bilateralFilter(_src, dist, sigma, sigma)
        _src = cv2.cvtColor(_src, cv2.COLOR_RGB2GRAY)

        t, res = cv2.threshold(_src, -1, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)
        print('otsu threshold: ', t)

        return t, res


class ImageEdgeDetection:
    def CannyOperator(_src, size, low = 0, high = 255, dist = 5, sigma = 100):
        _src = cv2.bilateralFilter(_src, dist, sigma, sigma)
        _src = cv2.cvtColor(_src, cv2.COLOR_RGB2GRAY)

        canny = cv2.Canny(_src, low, high)
        mask = canny == 0

        # dst = _src * (mask[:, :, None].astype(_src.dtype))

        return mask


if __name__ == '__main__':
    src = cv2.imread("./images/nature1.jpg", cv2.IMREAD_COLOR)
    if src is None:
        print("Image load failed!")
        sys.exit()


