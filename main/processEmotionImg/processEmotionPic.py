from PIL import Image
from PIL import ImageFont, ImageDraw
from time import gmtime, strftime
import sys
import os

originImg = sys.argv[1]
saveImg = sys.argv[2]
startTime = sys.argv[3]


current_dir = os.path.dirname(os.path.realpath(__file__))

scale = 0.5
padding = 80
img = Image.open(originImg)
lab = Image.open(os.path.join(current_dir, "./lab.png"))
plus = Image.open(os.path.join(current_dir, "./plus.png"))
resize_img = img.resize((int(img.size[0]*scale), int(img.size[1]*scale)))
tex = Image.open(os.path.join(current_dir, "./texture.jpg"))

width = resize_img.size[0]  
height = resize_img.size[1]

xmin = 9999
ymin = 9999
xmax = 0
ymax = 0

for i in range(0, width):  
	for j in range(0, height):  
		pixel = resize_img.getpixel((i, j))
		b = pixel[0] + pixel[1] + pixel[2]
		if (b / 3 != 0):
			if (i < xmin):
				xmin = i
			if (i > xmax):
				xmax = i
			if (j < ymin):
				ymin = j
			if (j > ymax):
				ymax = j
print type(img)
xmin = int(xmin/scale) - 20
ymin = int(ymin/scale) - 20
xmax = int(xmax/scale) + 20
ymax = int(ymax/scale) + 20
w = xmax - xmin
h = ymax - ymin

crop_img = img.crop((xmin, ymin, xmax, ymax))

new_size = (1000, 1000)
pad_img = Image.new("RGB", new_size)   ## luckily, this is already black!
pad_img.paste(crop_img, ((new_size[0]-crop_img.size[0])/2, (new_size[1]-crop_img.size[1])/2))


resized_tex = tex.resize(new_size)

pixels = pad_img.load()
tex_pixels = resized_tex.load()
plus_pixels = plus.load()

for i in range(0, new_size[0]):  
	for j in range(0, new_size[1]): 
		pixel = pad_img.getpixel((i, j))
		texPixel = resized_tex.getpixel((i, j))

		r = int(float(texPixel[0]) * float(pixel[0]) / 255.0)
		g = int(float(texPixel[1]) * float(pixel[1]) / 255.0)
		b = int(float(texPixel[2]) * float(pixel[2]) / 255.0)

		if pixel[0] < 15 and pixel[1]  < 15 and pixel[2]  < 15 and i >= 172 and i < 303 and j >= 126 and j < 257:
			plusPixel = plus.getpixel((i - 172, j - 126))
			pixels[i,j] = (int(plusPixel[0]*0.6), int(plusPixel[1]*0.6), int(plusPixel[2]*0.6))
		else:
			pixels[i,j] = (r, g, b)
 
pad_img.paste(lab, (172, 522), lab)
#pad_img.paste(plus, (172, 126), plus)

draw = ImageDraw.Draw(pad_img)
font = ImageFont.truetype(os.path.join(current_dir, "./BNB60.otf"), 80)
draw.text((650, 100), "2017/", font=font)
draw.text((650, 180), "5.17", font=font)
font = ImageFont.truetype(os.path.join(current_dir, "./BNB60.otf"), 40)
draw.text((650, 280), startTime, font=font)
draw.text((650, 700), strftime("%H:%M:%S", gmtime()), font=font)
print "finish process"
pad_img.save(saveImg)
print "finish save"
