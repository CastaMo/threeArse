# -*- coding: utf-8-*-  
  
import win32com  
from win32com.client import Dispatch, constants, DispatchEx
import time
#模板文件保存路径，此处使用的是绝对路径，相对路径未测试过  
template_path = r'C:\Users\binl\Desktop\test.doc'   
#另存文件路径，需要提前建好文件夹，不然会出错  
  
#启动word  
w = win32com.client.Dispatch('Word.Application')  
# 或者使用下面的方法，使用启动独立的进程：  
# w = win32com.client.DispatchEx('Word.Application')  
  
# 后台运行，不显示，不警告  
w.Visible = 0  
w.DisplayAlerts = 0  
# 打开新的文件  
# doc = w.Documents.Open( FileName = template_path )  
# worddoc = w.Documents.Add() # 创建新的文档  
# for i in range(2):
# 	doc.PrintOut()

# doc.Close()  
# w.Documents.Close()  
# w.Quit()

# ie=DispatchEx("InternetExplorer.Application")
# ie.Navigate("https://github.com/CastaMo/hw2-table-sorter")
# ie.Visible=1
# while ie.Busy:
#     time.sleep(1)
# body = ie.Document.body

import win32print
import win32ui
printer_name = win32print.GetDefaultPrinter()
print printer_name
hPrinter = win32print.OpenPrinter(printer_name)
print win32print.GetPrinter(hPrinter, 2)

FileName = r'C:\Users\binl\Desktop\printer\test.pdf'
print 'start: ' + FileName
# res = win32print.StartDocPrinter(hPrinter,1,(FileName,None,'RAW'))

HORZRES = 8
VERTRES = 10

LOGPIXELSX = 88
LOGPIXELSY = 90
PHYSICALWIDTH = 110
PHYSICALHEIGHT = 111

PHYSICALOFFSETX = 112
PHYSICALOFFSETY = 113

hDC = win32ui.CreateDC()

printable_area = hDC.GetDeviceCaps (HORZRES), hDC.GetDeviceCaps (VERTRES)
printer_size = hDC.GetDeviceCaps (PHYSICALWIDTH), hDC.GetDeviceCaps (PHYSICALHEIGHT)
printer_margins = hDC.GetDeviceCaps (PHYSICALOFFSETX), hDC.GetDeviceCaps (PHYSICALOFFSETY)



hDC.CreatePrinterDC (printer_name)
hDC.StartDoc (FileName)
hDC.StartPage ()

print 'finish ' + FileName + ' print'

