
const { DOMParser, XMLSerializer } = require("xmldom");
function removeXrefFromRowEntry(inputXML) {
    // Parse the input XML string
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(inputXML, "text/xml");

    // Find all 'row' elements in the XML document
    var rows = xmlDoc.getElementsByTagName('row');

    // Iterate over each 'row' element
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];

        // Find all 'entry' elements within the current 'row' element
        var entries = row.getElementsByTagName('entry');

        // Iterate over each 'entry' element
        for (var j = 0; j < entries.length; j++) {
            var entry = entries[j];

            // Find all 'xref' elements within the current 'entry' element
            var xrefs = entry.getElementsByTagName('xref');

            // Iterate over each 'xref' element and remove it
            for (var k = 0; k < xrefs.length; k++) {
                var xref = xrefs[k];
                xref.parentNode.removeChild(xref);
            }
        }
    }

    // Serialize the modified XML document back to string
    var serializer = new XMLSerializer();
    var modifiedXML = serializer.serializeToString(xmlDoc);
    return modifiedXML;
}


module.exports=removeXrefFromRowEntry