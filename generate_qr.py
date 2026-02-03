
import qrcode

url = "http://energy-truck-alb-2052459691.ap-northeast-2.elb.amazonaws.com/"
img = qrcode.make(url)
img.save("docs/energy-truck-qr.png")
print("QR code generated at docs/energy-truck-qr.png")
