
const { DOMParser, XMLSerializer } = require('xmldom');
function removeBoldTag(xmlString) {

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");

    const topicNode = xmlDoc.getElementsByTagName("topic")[0];
    const titleNodes = topicNode.getElementsByTagName("title");

    for (let i = 0; i < titleNodes.length; i++) {
        const titleNode = titleNodes[i];
        const boldNodes = titleNode.getElementsByTagName("b");

        while (boldNodes.length > 0) {
            const boldNode = boldNodes[0];
            const textContent = boldNode.textContent;
            const textNode = xmlDoc.createTextNode(textContent);
            titleNode.replaceChild(textNode, boldNode);
        }
    }

    const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

    return modifiedXmlString;
}
module.exports=removeBoldTag