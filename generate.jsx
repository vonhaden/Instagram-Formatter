// Main Function
function main(){
    // Run Image Formatter
    var docRef =  app.activeDocument;

    // Duplicate the document
    docRef.duplicate(docRef.name);
    docRef.duplicate(docRef.name);

    // Format full image
    formatImageFull();

    // Format square image
    formatImageSquare();

    // Format story image
    formatImageStory();
}



// Full Image Format
function formatImageFull() {

    var docRef =  app.activeDocument;

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


    // Fill layer with white
    whiteFill();


    // Resize the Image
    docRef.resizeImage(1500, 1500);


    // Flatten the Image
    docRef.flatten();


    // Save File
    var fileSuffix = "full"
    saveImage(fileSuffix);

    // Close the File
    docRef.close(SaveOptions.DONOTSAVECHANGES);
}



// Square Image Format
function formatImageSquare(){
    var docRef =  app.activeDocument;

    var height = docRef.height.value;
    var width = docRef.width.value;

    // Crop the image
    cropSquare(height, width);

    // Resize the Image
    docRef.resizeImage(1500, 1500);

    // Save File
    var fileSuffix = "square"
    saveImage(fileSuffix);

    // Close the File
    docRef.close(SaveOptions.DONOTSAVECHANGES);
}


// Story Image Format
function formatImageStory(){
    var docRef =  app.activeDocument;

    // Set aspect ratio
    var aspectRatioPhone = 16 / 9;

    // Get image aspect ration
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
    var fileSuffix = "story"
    saveImage(fileSuffix);

    // Close the File
    docRef.close(SaveOptions.DONOTSAVECHANGES);
}


// Auxiliary functions
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

function checkFormat(height, width) {
    if (height > width) {
        return "vertical";
    } else if (width > height) {
        return "horizontal";
    } else {
        return "square";
    }
}

function resizeSquare(height, width){
    var format = checkFormat(height, width);

    if(format === "vertical") {
        app.activeDocument.resizeCanvas(height, height);
    } else if (format === "horizontal") {
        app.activeDocument.resizeCanvas(width, width);
    }
}

function cropSquare(height, width){
    var format = checkFormat(height, width);

    if(format === "vertical") {
        app.activeDocument.resizeCanvas(width, width);
    } else if (format === "horizontal") {
        app.activeDocument.resizeCanvas(height, height);
    }
}

function saveImage(suffix){
    var docRef = app.activeDocument;

    // Get document name without extension
    var docName = docRef.name.substring(0, docRef.name.lastIndexOf('.'));

    // Set document name
    var filename = docName + ' - ' + suffix;

    // Savefile name with Path
    var saveName = new File(decodeURI(app.documents[0].path) + '/' + filename + '.jpg');

    // Save Options
    var jpgSaveOptions = new JPEGSaveOptions();
    jpgSaveOptions.formatOptions = FormatOptions.OPTIMIZEDBASELINE;
    jpgSaveOptions.embedColorProfile = true;
    jpgSaveOptions.matte = MatteType.NONE;
    jpgSaveOptions.quality = 12;

    docRef.saveAs(saveName, jpgSaveOptions, true, Extension.LOWERCASE)

}

function whiteFill(){
    var white = new SolidColor();

    white.rgb.red = 255;
    white.rgb.blue = 255;
    white.rgb.green = 255;

    app.activeDocument.selection.fill(white);
}




// Run the main function
main();