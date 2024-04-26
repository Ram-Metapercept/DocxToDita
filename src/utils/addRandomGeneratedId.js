
const { DOMParser, XMLSerializer } = require("xmldom");




function generateRandomId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
    for (let i = 0; i < 8; i++) {
        randomId += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomId;
}

function addRandomIdToTopics(xmlString) {
    // Parse the XML string
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Select all <topic> elements
    let topics = xmlDoc.getElementsByTagName("topic");

    // Loop through each <topic> element and add a random ID
    for (let i = 0; i < topics.length; i++) {
        // Generate a random ID
        let randomId = generateRandomId();

        // Create a new attribute node for the ID
        let idAttribute = xmlDoc.createAttribute("id");
        idAttribute.value = randomId;

        // Add the ID attribute to the <topic> element
        topics[i].setAttributeNode(idAttribute);
    }

    // Serialize the modified XML document back to string
    let serializer = new XMLSerializer();
    let modifiedXmlString = serializer.serializeToString(xmlDoc);

    return modifiedXmlString;
}


module.exports =addRandomIdToTopics