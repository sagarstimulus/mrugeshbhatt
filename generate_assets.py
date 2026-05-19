import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('assets', exist_ok=True)

# Generate Portrait Placeholder
portrait = Image.new('RGBA', (800, 1000), (0, 0, 0, 0))
draw = ImageDraw.Draw(portrait)
draw.ellipse([200, 100, 600, 500], fill=(100, 100, 100, 200)) # Head
draw.ellipse([100, 500, 700, 1200], fill=(100, 100, 100, 200)) # Body
portrait.save('assets/portrait.png')

# Generate 30 Signature Frames
for i in range(1, 31):
    img = Image.new('RGBA', (800, 300), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    progress = i / 30.0
    # Draw a line that grows
    draw.line([(50, 150), (50 + 700 * progress, 150 - 50 * progress)], fill=(255, 255, 255, 255), width=5)
    img.save(f'assets/sig_frame_{i:02d}.png')

print("Assets generated.")
