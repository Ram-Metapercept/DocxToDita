
const { DOMParser, XMLSerializer } = require('xmldom');
function addRandomIdsToTags(xmlString) {
    try {
        // Parse the XML string
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(xmlString, "text/xml");

        // Define a function to generate a random ID
        function generateRandomId() {
            const alphabet = 'abcdefghijklmnopqrstuvwxyz';
            const randomLetter = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
            const randomNumber = Math.floor(Math.random() * 1000000);
            return randomLetter + randomNumber;
        }

        // Targeted tags
        let targetTags = ['table', 'ol', 'ul', 'li', 'p', 'title','conbody'];

        // Iterate over target tags and add random IDs
        targetTags.forEach(tagName => {
            let elements = xmlDoc.getElementsByTagName(tagName);
            for (let i = 0; i < elements.length; i++) {
                let element = elements[i];
                if (!element.hasAttribute('id')) {
                    element.setAttribute('id', generateRandomId());
                }
            }
        });

        // Serialize the modified XML back to string
        let serializer = new XMLSerializer();
        let updatedXmlString = serializer.serializeToString(xmlDoc);

        return updatedXmlString;
    } catch (error) {
        console.error("Error parsing XML:", error);
        return null;
    }
}

module.exports = addRandomIdsToTags;