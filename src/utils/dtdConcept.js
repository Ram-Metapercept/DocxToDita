const { DOMParser, XMLSerializer } = require("xmldom");

function dtdConcept(content) {
  
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, "text/xml");
  const body = xmlDoc.getElementsByTagName("body")[0];

  if (!body) {
    return { content, boolValue: false };
  }

  const childElements = [];
  let node = body.firstChild;
  let count = 0;
  while (node && count < 3) {
    if (node.nodeType === 1) {
      childElements.push(node.nodeName);
      count++;
    }
    node = node.nextSibling;
  }

  if (childElements.length === 3) {
    if (childElements.every((tag) => tag === "p")) {
      const serializer = new XMLSerializer();
      let modifiedContent = serializer
        .serializeToString(xmlDoc)
        .replace(/<topic/g, "<concept")
        .replace(/<\/topic>/g, "</concept>")
        .replace(/<body>/, "<conbody>")
        .replace(/<\/body>/, "</conbody>");

      return { content: modifiedContent, boolValue: true };
    }
  }

  return { content, boolValue: false };
}

module.exports = dtdConcept;
