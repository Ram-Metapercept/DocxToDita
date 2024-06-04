

const { DOMParser, XMLSerializer } = require('xmldom');


function addRandomIdToFig(xmlString) {

    function generateRandomId() {
        const letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const digits = '0123456789';
        const id = letters.charAt(Math.floor(Math.random() * letters.length)) + 
                   Array.from({ length: 7 }, () => digits.charAt(Math.floor(Math.random() * digits.length))).join('');
        return id;
    }
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');


    const figElements = xmlDoc.getElementsByTagName('fig');

    for (let i = 0; i < figElements.length; i++) {
        const id = generateRandomId();
        figElements[i].setAttribute('id', id);
    }

    const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

    return modifiedXmlString;
}


module.exports=addRandomIdToFig