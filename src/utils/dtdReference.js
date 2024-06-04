const { DOMParser, XMLSerializer } = require("xmldom");

function isFirstTableInBody(content) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(content, "text/xml");
  const body = xmlDoc.getElementsByTagName("body")[0];

  for (let node = body.firstChild; node; node = node.nextSibling) {
    if (node.nodeType === 3 && /^\s*$/.test(node.nodeValue)) {
      continue;
    }

    if (node.nodeType === 1 && node.nodeName === "table") {
      let tbody = node.getElementsByTagName("thead")[0];

      let rowCount = 0;
      if (tbody) {
        for (
          let rowNode = tbody.firstChild;
          rowNode;
          rowNode = rowNode.nextSibling
        ) {
          if (rowNode.nodeName === "row") {
            rowCount++;
          }
        }
      }

      if (rowCount >= 7) {
        const serializer = new XMLSerializer();
        const modifiedContent = serializer
          .serializeToString(xmlDoc)
          .replace(/<topic/g, "<reference")
          .replace(/<\/topic>/g, "</reference>")
          .replace(/<body>/, "<refbody>")
          .replace(/<\/body>/, "</refbody>");
          let  modifiedContentWrappedIntoSection=wrapInSection(modifiedContent)
        return { content: modifiedContentWrappedIntoSection, boolValue: true };
      }

    }

    break;
  }

  return { content, boolValue: false };
}

module.exports = isFirstTableInBody;
function wrapInSection(xmlContent) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlContent, "text/xml");

  const table = xmlDoc.getElementsByTagName("table")[0];
  const postReq = xmlDoc.createElement("section");

  let nextNode = table.nextSibling;
  while (nextNode) {
    const currentNode = nextNode;
    nextNode = currentNode.nextSibling;
    postReq.appendChild(currentNode);
  }

  table.parentNode.insertBefore(postReq, table.nextSibling);

  const serializer = new XMLSerializer();
  const modifiedXmlContent = serializer.serializeToString(xmlDoc);

  return modifiedXmlContent;
}