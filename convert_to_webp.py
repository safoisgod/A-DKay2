import os
from PIL import Image

def convert_to_webp(source_dir, quality=80):
    # Supported image formats
    supported_formats = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'}
    
    # Walk through all directories and subdirectories
    for root, _, files in os.walk(source_dir):
        for file in files:
            # Check if file is an image
            file_ext = os.path.splitext(file)[1].lower()
            if file_ext in supported_formats:
                input_path = os.path.join(root, file)
                # Create output path with .webp extension
                output_path = os.path.join(root, os.path.splitext(file)[0] + '.webp')
                
                try:
                    # Open and convert image
                    with Image.open(input_path) as img:
                        # Convert to RGB if necessary (for images with alpha channel)
                        if img.mode in ('RGBA', 'LA'):
                            background = Image.new('RGB', img.size, (255, 255, 255))
                            background.paste(img, mask=img.split()[-1])
                            img = background
                            
                        # Save as WebP
                        img.save(output_path, 'WEBP', quality=quality)
                    print(f"Converted: {input_path} -> {output_path}")
                    
                    # Optionally, remove original file
                    os.remove(input_path)
                    
                except Exception as e:
                    print(f"Error converting {input_path}: {str(e)}")

if __name__ == "__main__":
    # Specify the source directory
    source_directory = input("Enter the source directory path: ")
    
    # Validate directory
    if not os.path.isdir(source_directory):
        print("Invalid directory path!")
    else:
        # Run conversion
        convert_to_webp(source_directory)
        print("Conversion completed!")