const { DOMParser, XMLSerializer } = require('xmldom');
// function moveTgroupClosingTagBeforeTable(xmlString) {

//    let parser = new DOMParser();
//    let xmlDoc = parser.parseFromString(xmlString, "text/xml");

//    // Find the <tgroup> elements
//    let tgroupElements = xmlDoc.getElementsByTagName("tgroup");

//    // Loop through each <tgroup> element and remove the self-closing slash
//    for (let i = 0; i < tgroupElements.length; i++) {
//        let tgroupElement = tgroupElements[i];
//        // Remove the self-closing slash
//        tgroupElement.removeAttribute(" /");
//        // Append a closing tag before the end of the table
//        let tableElement = xmlDoc.getElementsByTagName("table")[0];

//        tableElement.insertBefore(tgroupElement, tableElement.lastChild);
//        tableElement.insertBefore(xmlDoc.createTextNode("\n  "), tableElement.lastChild);
//    }

//    // Serialize the XML document back to a string
//    let serializer = new XMLSerializer();
//    let fixedXmlString = serializer.serializeToString(xmlDoc);

//    return fixedXmlString;
// }

// function moveTgroupClosingTagBeforeTable(inputXML) {
//     // Parse the input XML string
//     var parser = new DOMParser();
//     var xmlDoc = parser.parseFromString(inputXML, "text/xml");

//     // Find all 'table' elements in the XML document
//     var tables = xmlDoc.getElementsByTagName('table');

//     // Iterate over each 'table' element
//     for (var i = 0; i < tables.length; i++) {
//         var table = tables[i];

//         // Find the 'tgroup' element within the 'table' element
//         var tgroup = table.getElementsByTagName('tgroup')[0];
//         if (tgroup) {
//             // Remove the 'tgroup' element from its current position
//             tgroup.parentNode.removeChild(tgroup);
//         }

//         // Create the 'tgroup' element
//         var newTgroup = xmlDoc.createElement('tgroup');
//         newTgroup.setAttribute('cols', '2');

//         // Create 'colspec' elements
//         for (var j = 0; j < 2; j++) {
//             var colspec = xmlDoc.createElement('colspec');
//             colspec.setAttribute('colname', 'c' + (j + 1));
//             newTgroup.appendChild(colspec);
//         }

//         // Find the 'tbody' element within the 'table' element
//         var tbody = table.getElementsByTagName('tbody')[0];

//         // Append the 'tgroup' element just before the 'tbody' element
//         table.insertBefore(newTgroup, tbody);

//         // Move the 'tbody' element within the 'tgroup' element
//         newTgroup.appendChild(tbody);

//         // Append the closing '</tgroup>' tag just before the closing '</table>' tag
//         var closingTgroupTag = xmlDoc.createTextNode('</tgroup>');
//         table.insertBefore(closingTgroupTag, table.lastChild);
//     }

//     // Serialize the modified XML document back to string
//     var serializer = new XMLSerializer();
//     var modifiedXML = serializer.serializeToString(xmlDoc);
//     return modifiedXML;
// }

// function moveTgroupClosingTagBeforeTable(inputXML) {
//     console.log(inputXML)
//     // Parse the input XML string
//     var parser = new DOMParser();
//     var xmlDoc = parser.parseFromString(inputXML, "text/xml");

//     // Find all 'table' elements in the XML document
//     var tables = xmlDoc.getElementsByTagName('table');

//     // Iterate over each 'table' element
//     for (var i = 0; i < tables.length; i++) {
//         var table = tables[i];

//         // Find the 'tgroup' element within the 'table' element
//         var tgroup = table.getElementsByTagName('tgroup')[0];
//         if (tgroup) {
//             // Remove the 'tgroup' element from its current position
//             tgroup.parentNode.removeChild(tgroup);

//             // Create the 'tgroup' element
//             var newTgroup = xmlDoc.createElement('tgroup');
//             newTgroup.setAttribute('cols', '2');

//             // Create 'colspec' elements
//             for (var j = 0; j < 2; j++) {
//                 var colspec = xmlDoc.createElement('colspec');
//                 colspec.setAttribute('colname', 'c' + (j + 1));
//                 newTgroup.appendChild(colspec);
//             }

//             // Find the 'tbody' element within the 'table' element
//             var tbody = table.getElementsByTagName('tbody')[0];

//             // Append the 'tgroup' element just before the 'tbody' element
//             table.insertBefore(newTgroup, tbody);

//             // Move the 'tbody' element within the 'tgroup' element
//             newTgroup.appendChild(tbody);
//         }

//         // Append the closing '</tgroup>' tag just before the closing '</table>' tag
//         var closingTgroupTag = xmlDoc.createElement('tgroup');
//         table.parentNode.insertBefore(closingTgroupTag, table.nextSibling);
//     }

//     // Serialize the modified XML document back to string
//     var serializer = new XMLSerializer();
//     var modifiedXML = serializer.serializeToString(xmlDoc);
//     return modifiedXML;
// }

// ----------------------working tgroup------------------------------------------
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
            // Remove the 'tgroup' element from its current position
            tgroup.parentNode.removeChild(tgroup);

            // Create the 'tgroup' element
            var newTgroup = xmlDoc.createElement('tgroup');
            newTgroup.setAttribute('cols', '2');

            // Create 'colspec' elements
            for (var j = 0; j < 2; j++) {
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
