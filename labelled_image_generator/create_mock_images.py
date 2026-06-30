import os
from PIL import Image, ImageDraw

def create_mock_images():
    os.makedirs("input_shawls", exist_ok=True)
    os.makedirs("output_shawls", exist_ok=True)
    
    # Create 3 mock shawl images of different colors
    shawls = {
        "432.jpg": (180, 50, 50),     # Dark Red shawl
        "109.jpg": (50, 80, 180),     # Blue shawl
        "887.jpg": (60, 150, 100),    # Greenish teal shawl
    }
    
    for filename, color in shawls.items():
        # Create a mock shawl image with a simple fabric-like pattern or gradient
        img = Image.new("RGB", (800, 600), color=color)
        draw = ImageDraw.Draw(img)
        
        # Draw some lines to simulate shawl folds/patterns
        for i in range(0, 800, 40):
            draw.line([(i, 0), (i + 100, 600)], fill=(color[0]+20, color[1]+20, color[2]+20), width=2)
            
        img.save(os.path.join("input_shawls", filename))
        print(f"Created mock shawl: input_shawls/{filename}")

if __name__ == "__main__":
    create_mock_images()
