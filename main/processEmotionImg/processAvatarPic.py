from PIL import Image
from PIL import ImageFont, ImageDraw
from time import gmtime, strftime
import sys

originImg = sys.argv[1]
saveImg = sys.argv[2]

img = Image.open(originImg)

img = img.convert('1')

img.save(saveImg)