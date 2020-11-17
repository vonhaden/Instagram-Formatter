
# Instagram Format
> This is a Photoshop script meant to reformat images for use on Instagram.

![version](https://img.shields.io/badge/version-1.0-blue)
![GitHub all releases](https://img.shields.io/github/downloads/vonhaden/Instagram-Formatter/total)
![GitHub](https://img.shields.io/github/license/vonhaden/Instagram-Formatter)

## About
I wanted a quicker and easier way to format photos for use in Instagram.
This script takes any image and reformats it as:
* A square image with borders
* A square image without borders (cropped)
* A 9:16 image cropped for Stories


## Usage
### Installation
Download the `instagram-format.jsx` file and place it in Photoshop's Scripts folder
PC:
```
C:\Program Files\Adobe\Adobe Photoshop [VERSION]\Presets\Scripts
```
Mac:
```
/Applications/Adobe Photoshop [VERSION]/Presets/Scripts/
```
With a photo open in Photoshop, navigate to the File > Scripts menu and chose the Instagram Format script.

### How it Functions
The Script must be run while an image is open. It will create the three separate formatted versions of the image and place them in the same folder as the original image. 
Both cropped images (Square and Story) will remain open in photoshop. If you are happy with the default crop, you can close these images. If you would like to change the crop on these images, you can use either move or transform the top layer (labeled as `--- ADJUST THIS LAYER ---`). Once done, merge the layer down and save the file.

### Making Adjustments to the Script
If you would like to make adjustment to the behavior of the script, you can do so by altering the global variables. In future updates I plan on moving these to a prompt. For now, the focus was purely on speed.

#### Background Color
The background color by default is white, but by changing the hex value from `ffffff` to a different value, you can change the resulting background color.
```
bgColor.rgb.hexValue = 'ffffff';
```

#### Resolution
The default resolution of the square formatted images is 1500px by 1500px. You can change that by altering the number of the `squareResolution` variable.
```
var squareResolution = 1500; 
```

## Versions
* Version 1.0: Initial Release


## License
[MIT](https://choosealicense.com/licenses/mit/)