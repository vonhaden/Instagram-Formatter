// =============================================================================
// Instagram Format Photoshop Script
// =============================================================================
//
// Description: Takes an image and reformats it for Instagram in Photoshop
//
// Credits
// Author: Andrew Von Haden
// Website: andrewvonhaden.com
//
// Requirements: Adobe Photoshop CC or higher




////////////////////////////////////////////////////////////////////////////////
//  Global Variables
////////////////////////////////////////////////////////////////////////////////

// Background Color
var bgColor = new SolidColor();
bgColor.rgb.hexValue = 'ffffff';     // Change to hex value for any color to change BG Color.

// File Resolution
var squareResolution = 1500;        // Change this number if you want to adjust the square resolution

// Suffixes
var fullSuffix = 'Full';            // Suffix for image with pillars
var squareSuffix = 'Square';        // Suffix for image with square crop
var storySuffix = 'Story';          // Suffix for image with 9x16 crop
var separator = ' - '               // separator between file name and suffix

// Base Document
var baseDoc =  app.activeDocument;
var baseName = baseDoc.name;
var baseTitle = baseName.substring(0, baseName.lastIndexOf('.'));




////////////////////////////////////////////////////////////////////////////////
// Main Function
////////////////////////////////////////////////////////////////////////////////

function main(){
    // Duplicate the documents
    // Create the Full Image
    baseDoc.duplicate(baseTitle + separator + fullSuffix);
    // Create the Square Image
    baseDoc.duplicate(baseTitle + separator + squareSuffix);
    // Create the Story Image
    baseDoc.duplicate(baseTitle + separator + storySuffix);

    // Switch active document
    app.activeDocument = app.documents.getByName(baseTitle + separator + fullSuffix);

    // Format full image
    formatImageFull();

    // Switch active document
    app.activeDocument = app.documents.getByName(baseTitle + separator + squareSuffix);

    // Format square image
    formatImageSquare();

    // Switch active document
    app.activeDocument = app.documents.getByName(baseTitle + separator + storySuffix);

    // Format story image
    formatImageStory();

    // Close the main image
    baseDoc.close(SaveOptions.DONOTSAVECHANGES);
}




////////////////////////////////////////////////////////////////////////////////
// Image Format Functions
////////////////////////////////////////////////////////////////////////////////

// Full Image Format
function formatImageFull() {
    var docRef =  app.activeDocument;

    // Set height and width
    var height = docRef.height.value;
    var width = docRef.width.value;


    // Unlock background layer
    unlockLayer();

    // Add new layer
    docRef.artLayers.add();
    docRef.activeLayer.name = "BG";

    // Move layer back
    docRef.artLayers[1].move(docRef.artLayers[0], ElementPlacement.PLACEBEFORE);

    // Resize the document to be square
    resizeSquare(height, width);

    // Fill layer with bgColor
    app.activeDocument.selection.fill(bgColor);

    // Resize the Image
    docRef.resizeImage(squareResolution, squareResolution);

    // Flatten the Image
    docRef.flatten();

    // Save File
    saveImage(docRef);

    // Close the File
    docRef.close(SaveOptions.DONOTSAVECHANGES);
}


// Square Image Format
function formatImageSquare(){
    var docRef =  app.activeDocument;

    // Save and reopen file to allow for file folder location
    // Save File
    saveImage(docRef);

    // Close the File
    docRef.close(SaveOptions.DONOTSAVECHANGES);

    // Open Image
    openImage(squareSuffix);

    // Reset docRef
    var docRef =  app.activeDocument;

    // Set height and width
    var height = docRef.height.value;
    var width = docRef.width.value;

    // Duplicate the Background
    unlockLayer();
    docRef.activeLayer.duplicate();
    docRef.activeLayer.isBackgroundLayer = true;
    // docRef.activeLayer.allLocked = true;
    docRef.activeLayer = docRef.layers[0];
    docRef.layers[0].name = '--- ADJUST THIS LAYER ---';

    // Crop the image
    cropSquare(height, width);

    // Resize the Image
    docRef.resizeImage(squareResolution, squareResolution);

    // Save File
    saveImage(docRef);

    // Close the File
    // docRef.close(SaveOptions.DONOTSAVECHANGES);
}


// Story Image Format
function formatImageStory(){
    var docRef =  app.activeDocument;

    // Save and reopen file to allow for file folder location
    // Save File
    saveImage(docRef);

    // Close the File
    docRef.close(SaveOptions.DONOTSAVECHANGES);

    // Open Image
    openImage(storySuffix);

    // Reset docRef
    var docRef =  app.activeDocument;

    // Duplicate the Background
    unlockLayer();
    docRef.activeLayer.duplicate();
    docRef.activeLayer.isBackgroundLayer = true;
    // docRef.activeLayer.allLocked = true;
    docRef.activeLayer = docRef.layers[0];
    docRef.layers[0].name = '--- ADJUST THIS LAYER ---';

    // Set aspect ratio
    var aspectRatioPhone = 16 / 9;

    // Get image aspect ratio
    var height = docRef.height.value;
    var width = docRef.width.value;
    var aspectRatioImage = height / width;

    // Size of Cropped Image
    var resizeHeight = 2560;
    var resizeWidth = 1440;

    // Resize image based on aspect ratio
    if (aspectRatioPhone >= aspectRatioImage ) {
        docRef.resizeImage(null, resizeHeight);
    } else {
        docRef.resizeImage(resizeWidth);
    }

    // Crop Image
    docRef.resizeCanvas(resizeWidth, resizeHeight);

    // Save File
    saveImage(docRef);

    // Close the File
    // docRef.close(SaveOptions.DONOTSAVECHANGES);
}




////////////////////////////////////////////////////////////////////////////////
// Auxiliary functions
////////////////////////////////////////////////////////////////////////////////

// Unlock current layer
function unlockLayer(){
    var activeLayer = app.activeDocument.activeLayer;

    if (activeLayer.isBackgroundLayer) {
        // Name Layer
        activeLayer.name = "Photo";

        // Unlock Layer
        if (activeLayer.allLocked){
            activeLayer.allLocked = false;
        } else if (activeLayer.pixelsLocked) {
            activeLayer.pixelsLocked = false;
        } else if (activeLayer.positionLocked) {
            activeLayer.positionLocked = false;
        }
    }
}

// Check document format (returns: vertical, horizontal, square)
function checkFormat(height, width) {
    if (height > width) {
        return "vertical";
    } else if (width > height) {
        return "horizontal";
    } else {
        return "square";
    }
}

// Change canvas size to be square (based on largest edge)
function resizeSquare(height, width){
    var format = checkFormat(height, width);

    if(format === "vertical") {
        app.activeDocument.resizeCanvas(height, height);
    } else if (format === "horizontal") {
        app.activeDocument.resizeCanvas(width, width);
    }
}

// Crop Image to be square (based on shortest edge)
function cropSquare(height, width){
    var format = checkFormat(height, width);

    if(format === "vertical") {
        app.activeDocument.resizeCanvas(width, width);
    } else if (format === "horizontal") {
        app.activeDocument.resizeCanvas(height, height);
    }
}

// Save the image
function saveImage(file){
    // Savefile name with Path
    var saveName = new File(decodeURI(baseDoc.path) + '/' + file.name);

    // Save Options
    var jpgSaveOptions = new JPEGSaveOptions();
    jpgSaveOptions.formatOptions = FormatOptions.OPTIMIZEDBASELINE;
    jpgSaveOptions.embedColorProfile = true;
    jpgSaveOptions.matte = MatteType.NONE;
    jpgSaveOptions.quality = 12;

    file.saveAs(saveName, jpgSaveOptions, true, Extension.LOWERCASE)

}

// Open an Image based on suffix
function openImage(suffix){
    // Set filename
    var filename = baseTitle + ' - ' + suffix + '.jpg';

    // Savefile name with Path
    var filePath = new File(decodeURI(baseDoc.path) + '/' + filename );

    // Open Image
    app.open(filePath);
}




////////////////////////////////////////////////////////////////////////////////
// Run the Function
////////////////////////////////////////////////////////////////////////////////

// Run the main function
main();