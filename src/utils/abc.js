
const { DOMParser, XMLSerializer } = require("xmldom");
function transformHTML(inputHTML) {
    // Split the input HTML by "<p>" tag
    var parts = inputHTML.split('<p>');

    // Initialize variables to store the output parts
    var outputHTML = '';
    var imageHTML = '';

    // Iterate through each part
    parts.forEach(function(part) {
       
        if (part.includes('<image')) {
            // If the part contains "<image", it's the part with the image
            imageHTML = '<p>' + part.trim();
            console.log(imageHTML);
        } else {
            // Otherwise, append the part to the output
            outputHTML += '<li>' + part.trim() + '</li>';
        }
    });

    // Construct the desired output HTML
    outputHTML = outputHTML.replaceAll('</li>', imageHTML + '</li>');

    return outputHTML;
}

module.exports=transformHTML