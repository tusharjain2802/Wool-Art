import os
from PIL import Image
from label_images import LabelerApp

def test_label_generation():
    print("Testing label generation backend...")
    
    # We will instantiate a dummy object or test the class method.
    # To test apply_label_to_image without running tk mainloop:
    # We can create a mock class instance with mock root.
    import tkinter as tk
    root = tk.Tk()
    app = LabelerApp(root)
    
    # Input files are in input_shawls
    input_dir = "input_shawls"
    output_dir = "output_shawls"
    
    # Let's ensure directories exist
    os.makedirs(input_dir, exist_ok=True)
    os.makedirs(output_dir, exist_ok=True)
    
    test_file = "432.jpg"
    img_path = os.path.join(input_dir, test_file)
    out_path = os.path.join(output_dir, test_file)
    
    if not os.path.exists(img_path):
        print(f"Error: {img_path} not found. Running create_mock_images first...")
        from create_mock_images import create_mock_images
        create_mock_images()
        
    img = Image.open(img_path)
    
    # User's default requirements: White background, black text, size 16
    font_file = "arialbd.ttf"
    font_size = 16
    text_color = "#000000" # Black
    bg_color = "#ffffff"   # White
    bg_opacity = 1.0       # Opaque
    position = "Top-Left"
    padding = 10
    margin = 20
    
    print(f"Applying label on {test_file} with:")
    print(f" - Font Size: {font_size}")
    print(f" - Text Color: {text_color}")
    print(f" - Bg Color: {bg_color}")
    
    labeled_img = app.apply_label_to_image(
        img, "432", font_file, font_size, 
        text_color, bg_color, bg_opacity, position, padding, margin
    )
    
    labeled_img.save(out_path)
    print(f"Saved labeled image to: {out_path}")
    
    # Validate file size and existence
    assert os.path.exists(out_path), "Output image was not saved!"
    print("Backend test successfully completed!")
    
    # Clean up tk loop
    root.destroy()

if __name__ == "__main__":
    test_label_generation()
