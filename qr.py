import qrcode 
qr=qrcode("http://localhost:5173/")
qr.save("qrr.png")
print("completed qr generation")