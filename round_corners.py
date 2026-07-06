from PIL import Image, ImageDraw

def add_corners(im, rad):
    circle = Image.new('L', (rad * 2, rad * 2), 0)
    draw = ImageDraw.Draw(circle)
    draw.ellipse((0, 0, rad * 2 - 1, rad * 2 - 1), fill=255)
    alpha = Image.new('L', im.size, 255)
    w, h = im.size
    alpha.paste(circle.crop((0, 0, rad, rad)), (0, 0))
    alpha.paste(circle.crop((0, rad, rad, rad * 2)), (0, h - rad))
    alpha.paste(circle.crop((rad, 0, rad * 2, rad)), (w - rad, 0))
    alpha.paste(circle.crop((rad, rad, rad * 2, rad * 2)), (w - rad, h - rad))
    im.putalpha(alpha)
    return im

if __name__ == "__main__":
    input_path = r"c:\Users\Adnan\Desktop\Ecomm-Demo\aurelia_logo_icon_1783357792361.png"
    
    # Open the image
    img = Image.open(input_path).convert("RGBA")
    
    # Calculate a slight corner radius (e.g., 5% of the width)
    w, h = img.size
    radius = int(min(w, h) * 0.05)
    
    # Round the corners
    img_rounded = add_corners(img, radius)
    
    # Save as logo.png
    img_rounded.save(r"c:\Users\Adnan\Desktop\Ecomm-Demo\frontend\public\logo.png", "PNG")
    
    # Resize and save as favicon.png
    favicon = img_rounded.resize((64, 64), Image.Resampling.LANCZOS)
    favicon.save(r"c:\Users\Adnan\Desktop\Ecomm-Demo\frontend\public\favicon.png", "PNG")
    print("Done")
