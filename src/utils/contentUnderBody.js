
const { DOMParser, XMLSerializer } = require("xmldom");


function addBodyTag(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  
    const body = xmlDoc.getElementsByTagName("body")[0];
  
    let currentNode = body.firstChild;
    const newBody = xmlDoc.createElement("body");
  
    while (currentNode) {
      if (currentNode.nodeName !== "title" && currentNode.nodeName !== "shortdesc") {
        const nextNode = currentNode.nextSibling;
        newBody.appendChild(currentNode.cloneNode(true));
        currentNode = nextNode;
      } else {
        currentNode = currentNode.nextSibling;
      }
    }
  
    body.parentNode.replaceChild(newBody, body);
  
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
  }

module.exports= addBodyTag