

const { DOMParser, XMLSerializer } = require('xmldom');


function addRandomIdToFig(xmlString) {
    // Function to generate a random ID starting with a letter
    function generateRandomId() {
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const id = letters.charAt(Math.floor(Math.random() * letters.length)) + 
                   Array.from({ length: 7 }, () => digits.charAt(Math.floor(Math.random() * digits.length))).join('');
        return id;
    }

    // Parse the XML string
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Find all fig elements
    const figElements = xmlDoc.getElementsByTagName('fig');
    // Add id attribute with random ID to each fig element
    for (let i = 0; i < figElements.length; i++) {
        const id = generateRandomId();
        figElements[i].setAttribute('id', id);
    }

    // Convert the modified XML back to string
    const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

    return modifiedXmlString;
}


module.exports=addRandomIdToFig