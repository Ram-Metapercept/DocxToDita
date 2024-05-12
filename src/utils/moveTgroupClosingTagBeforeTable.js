const { DOMParser, XMLSerializer } = require('xmldom');

function moveTgroupClosingTagBeforeTable(inputXML) {
    // Parse the input XML string
   
    var parser = new DOMParser();
    var xmlDoc = parser.parseFromString(inputXML, "text/xml");

    // Find all 'table' elements in the XML document
    var tables = xmlDoc.getElementsByTagName('table');

    // Iterate over each 'table' element
    for (var i = 0; i < tables.length; i++) {
        var table = tables[i];

        // Find the 'tgroup' element within the 'table' element
        var tgroup = table.getElementsByTagName('tgroup')[0];
        if (tgroup) {
        let  newTgroup=tgroup
            // newTgroup.setAttribute('cols', "2");
            let item=tgroup.getAttribute('cols')
         
            for (var j = 0; j < item; j++) {
                var colspec = xmlDoc.createElement('colspec');
                colspec.setAttribute('colname', 'c' + (j + 1));
                newTgroup.appendChild(colspec);
            }

            // Find the 'tbody' element within the 'table' element
            var tbody = table.getElementsByTagName('tbody')[0];

            // Append the 'tgroup' element just before the 'tbody' element
            table.insertBefore(newTgroup, tbody);

            // Move the 'tbody' element within the 'tgroup' element
            newTgroup.appendChild(tbody);
        }
    }
    // Serialize the modified XML document back to string
    var serializer = new XMLSerializer();
    var modifiedXML = serializer.serializeToString(xmlDoc);
    return modifiedXML;
}
module.exports = moveTgroupClosingTagBeforeTable;
