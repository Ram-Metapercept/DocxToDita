
const { DOMParser, XMLSerializer } = require('xmldom');
function removeBoldTag(xmlString) {
    // Parse the XML string into a DOM document
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Find the title element
    const topicNode = xmlDoc.getElementsByTagName("topic")[0];
    const titleNodes = topicNode.getElementsByTagName("title");

    // Loop through all title elements
    for (let i = 0; i < titleNodes.length; i++) {
        const titleNode = titleNodes[i];
        const boldNodes = titleNode.getElementsByTagName("b");

        // If <b> tag exists, replace it with its text content
        while (boldNodes.length > 0) {
            const boldNode = boldNodes[0];
            const textContent = boldNode.textContent;
            const textNode = xmlDoc.createTextNode(textContent);
            titleNode.replaceChild(textNode, boldNode);
        }
    }

    // Serialize the modified DOM document back into a string
    const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

    return modifiedXmlString;
}
module.exports=removeBoldTag