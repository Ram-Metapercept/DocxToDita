

function replaceXmlStructure(xmlString) {
    // Define the regular expression pattern to match the specific structure
    const regex = /<\/ol><\/li>\s*<note>([\s\S]*?)<\/note>\s*<li><ol>/g;
    
    // Use the replace function with a callback to preserve the content inside the <note> tags
    const result = xmlString.replace(regex, (match, noteContent) => {
        return `<note>${noteContent}</note>`;
    });

    return result;
}

module.exports=replaceXmlStructure


// function cleanXMLString(xml) {
//     // Regex to match <li> tags that have certain tags between them
//     let olContent = /<\/li>\s*(<(p|note|table|image)[^>]*>.*?<\/\2>)\s*<li>/gs;

//     let matches = [...xml.matchAll(olContent)];
//     for (let match of matches) {
//         let fullMatch = match[0];
//         let innerContent = match[1];

//         // Remove <li> tags around the inner content
//         let cleanedContent = innerContent.replace(/<\/?li>/g, '');

//         // Replace the full match in the original XML with the cleaned content
//         xml = xml.replace(fullMatch, cleanedContent);
//     }

//     // Remove empty <ol> tags
//     xml = xml.replace(/<ol>\s*<\/ol>/g, '');

//     return xml;
// }

// module.exports = cleanXMLString;













// module.exports=cleanXMLString