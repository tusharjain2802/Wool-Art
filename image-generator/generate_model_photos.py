import os
import sys
import time
import argparse
from pathlib import Path
from io import BytesIO
from PIL import Image
from dotenv import load_dotenv

# Try to load environment variables from a .env file if it exists
load_dotenv()

# Check for required SDK
try:
    from google import genai
    from google.genai import types
except ImportError:
    print("Error: The 'google-genai' package is not installed.")
    print("Please run: pip install google-genai pillow python-dotenv")
    sys.exit(1)


def parse_arguments():
    parser = argparse.ArgumentParser(
        description="Bulk generate model photos wearing custom shawls using the Gemini API."
    )
    parser.add_argument(
        "--model",
        type=str,
        default="gemini-2.5-flash-image",
        help="The Gemini image-generation model to use (default: gemini-2.5-flash-image).",
    )
    parser.add_argument(
        "--delay",
        type=float,
        default=10.0,
        help="Delay in seconds between API calls to prevent rate limiting (default: 10.0).",
    )
    parser.add_argument(
        "--api-key",
        type=str,
        default=os.environ.get("GEMINI_API_KEY"),
        help="Your Gemini API key (can also be set via GEMINI_API_KEY env variable).",
    )
    return parser.parse_args()


def find_pose_images(models_path: Path):
    """
    Intelligently find the 4 pose images in the models directory.
    Matches filenames containing 'front', 'side', 'back', 'close' or 'holding' or 'hand' or 'closeip'.
    """
    pose_files = {}
    valid_extensions = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    
    if not models_path.exists():
        return pose_files
        
    all_files = [f for f in models_path.iterdir() if f.is_file() and f.suffix.lower() in valid_extensions]
    
    for f in all_files:
        name = f.stem.lower()
        if "front" in name:
            pose_files["front"] = f
        elif "side" in name:
            pose_files["side"] = f
        elif "back" in name:
            pose_files["back"] = f
        elif any(keyword in name for keyword in ["close", "holding", "hand", "closeip"]):
            pose_files["closeup"] = f
            
    return pose_files


def get_closest_aspect_ratio(width, height):
    """
    Calculate the closest supported aspect ratio for the image config.
    Supported: "1:1", "3:4", "4:3", "9:16", "16:9"
    """
    ratio = width / height
    ratios = {
        "1:1": 1.0,
        "3:4": 0.75,
        "4:3": 1.33,
        "16:9": 1.78,
        "9:16": 0.56
    }
    closest_ratio = min(ratios.keys(), key=lambda k: abs(ratios[k] - ratio))
    return closest_ratio


def main():
    args = parse_arguments()
    
    # Define directories
    base_dir = Path(__file__).resolve().parent
    input_dir = base_dir / "input"
    models_dir = base_dir / "models"
    output_dir = base_dir / "output"
    
    # Create directories if they don't exist
    input_dir.mkdir(exist_ok=True)
    models_dir.mkdir(exist_ok=True)
    output_dir.mkdir(exist_ok=True)
    
    # Resolve API Key
    api_key = args.api_key
    if not api_key:
        print("Error: Gemini API Key is missing.")
        print("Please set the GEMINI_API_KEY environment variable, create a .env file, or pass it using --api-key.")
        api_key = input("Please enter your Gemini API Key: ").strip()
        if not api_key:
            print("Exit: No API Key provided.")
            sys.exit(1)
            
    # Set up client
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"Error initializing Gemini client: {e}")
        sys.exit(1)
    
    print(f"=== Directory Setup ===")
    print(f"Input shawl directory:  {input_dir}")
    print(f"Models pose directory:  {models_dir}")
    print(f"Output directory:       {output_dir}\n")
    
    # Find pose images
    pose_files = find_pose_images(models_dir)
    required_poses = ["front", "side", "back", "closeup"]
    missing_poses = [p for p in required_poses if p not in pose_files]
    
    if missing_poses:
        print(f"Warning: Missing pose images in the 'models/' folder: {missing_poses}")
        print("Please ensure your models folder has files containing the names:")
        print(" - 'front' (e.g., front.jpg)")
        print(" - 'side' (e.g., side.jpg)")
        print(" - 'back' (e.g., back.jpg)")
        print(" - 'closeip' or 'closeup' (e.g., closeip.jpg)")
        print("\nFiles currently in models folder:")
        for f in models_dir.iterdir():
            if f.is_file():
                print(f" - {f.name}")
        
        # If no poses are found at all, we cannot proceed
        if len(pose_files) == 0:
            print("Error: No valid pose images found in 'models/' folder. Exiting.")
            sys.exit(1)
            
    # Find input shawl images
    valid_extensions = {".jpg", ".jpeg", ".png", ".webp", ".bmp"}
    shawl_files = [
        f for f in input_dir.iterdir() 
        if f.is_file() and f.suffix.lower() in valid_extensions
    ]
    
    if not shawl_files:
        print(f"No shawl images found in the 'input/' folder.")
        print("Please place your shawl product images (e.g. 321.jpg) in the 'input/' folder.")
        sys.exit(0)
        
    print(f"Found {len(shawl_files)} shawl images in 'input/'.")
    print(f"Found {len(pose_files)} of {len(required_poses)} pose templates in 'models/'.")
    print(f"Starting bulk generation using model: {args.model}\n")
    
    total_images_to_generate = len(shawl_files) * len(pose_files)
    generated_count = 0
    skipped_count = 0
    
    for i, shawl_file in enumerate(shawl_files, 1):
        shawl_name = shawl_file.stem
        print(f"[{i}/{len(shawl_files)}] Processing shawl: {shawl_file.name}")
        
        try:
            shawl_img = Image.open(shawl_file)
        except Exception as e:
            print(f"  Error opening shawl image {shawl_file.name}: {e}. Skipping this shawl.")
            continue
            
        for pose_name, model_file in pose_files.items():
            output_file = output_dir / f"{shawl_name}_{pose_name}.png"
            
            if output_file.exists():
                print(f"  - Pose '{pose_name}': Output already exists at {output_file.name}. Skipping.")
                skipped_count += 1
                continue
                
            print(f"  - Pose '{pose_name}': Generating from model pose '{model_file.name}'...")
            
            try:
                model_img = Image.open(model_file)
            except Exception as e:
                print(f"    Error opening model image {model_file.name}: {e}. Skipping this pose.")
                continue
                
            # Determine appropriate aspect ratio based on the model image shape
            aspect_ratio = get_closest_aspect_ratio(model_img.width, model_img.height)
            
            # Prepare instructions
            if pose_name == "front":
                bg_instruction = "The background of the generated image must be a solid, clean, pure white (#ffffff) color."
            else:
                bg_instruction = "The background should match the realistic background of the model image."
                
            prompt = f"""
Here are two images:
1. Model Image: A model in a {pose_name} pose wearing a shawl.
2. Shawl Image: A target shawl product image containing the design, pattern, and color of the shawl that should be worn by the model.

Your task is to generate a new, highly realistic image of the model.
In this new image:
- Replace the shawl the model is wearing with the shawl design from the Shawl Image.
- The shawl's design, weave pattern, print, and colors must be preserved as closely and accurately as possible.
- The model must look Indian and fair-skinned.
- The model's face, facial features, body shape, hair, pose, and clothing/accessories (other than the shawl) must be kept exactly the same as in the Model Image.
- {bg_instruction}

Output only the generated image. Do not add any text.
"""
            
            # Attempt to call Gemini API
            max_retries = 3
            success = False
            
            for attempt in range(1, max_retries + 1):
                try:
                    # Configure request
                    config = types.GenerateContentConfig(
                        response_modalities=["IMAGE"],
                        image_config=types.ImageConfig(
                            aspect_ratio=aspect_ratio
                        )
                    )
                    
                    # Request generation
                    # Passing both images and the text prompt to the multimodal model
                    response = client.models.generate_content(
                        model=args.model,
                        contents=[model_img, shawl_img, prompt],
                        config=config
                    )
                    
                    # Extract image data
                    image_saved = False
                    
                    # Look for inline_data containing image bytes
                    if response.candidates and len(response.candidates) > 0:
                        candidate = response.candidates[0]
                        if candidate.content and candidate.content.parts:
                            for part in candidate.content.parts:
                                if part.inline_data and part.inline_data.data:
                                    # Load raw bytes
                                    generated_pil = Image.open(BytesIO(part.inline_data.data))
                                    generated_pil.save(output_file)
                                    image_saved = True
                                    break
                                # If SDK provides helper as_image
                                elif hasattr(part, 'as_image'):
                                    try:
                                        generated_pil = part.as_image()
                                        generated_pil.save(output_file)
                                        image_saved = True
                                        break
                                    except Exception:
                                        pass
                                        
                    if image_saved:
                        print(f"    Successfully generated and saved as {output_file.name}")
                        generated_count += 1
                        success = True
                        break
                    else:
                        print(f"    Attempt {attempt}: No image data returned in API response.")
                        if response.text:
                            print(f"    Model output text instead of image: {response.text}")
                            
                except Exception as e:
                    print(f"    Attempt {attempt} failed: {e}")
                    
                if attempt < max_retries:
                    print("    Retrying in 5 seconds...")
                    time.sleep(5)
            
            if not success:
                print(f"    Failed to generate pose '{pose_name}' after {max_retries} attempts.")
                
            # Apply rate limiting delay
            if args.delay > 0:
                time.sleep(args.delay)
                
    print("\n=== Generation Complete ===")
    print(f"Total processed: {generated_count + skipped_count + (total_images_to_generate - generated_count - skipped_count)} possible images")
    print(f"Successfully generated: {generated_count}")
    print(f"Skipped (already exists): {skipped_count}")
    print(f"Find your outputs in the 'output/' folder.")


if __name__ == "__main__":
    main()
