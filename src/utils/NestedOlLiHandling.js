
const { DOMParser, XMLSerializer } = require('xmldom');
// function cleanAndBalanceHTML(html) {
//     // Move <p><img> into the nearest preceding <li> using regex
//     html = html.replace(/<p>(<img[^>]*>)<\/p>/g, (match, imgTag) => {
//         // Find the nearest preceding <li> and insert the <p><img></p> inside it
//         return html.replace(/<li>([^<]*?)<\/li>/g, (liMatch, liContent, offset) => {
            
//             if (offset + liMatch.length > html.indexOf(match)) {
//                 return `<li>${liContent}<p>${imgTag}</p></li>`;
               
//             }
//             return liMatch;
//         });
//     });

//     // Remove <p> tags that have been emptied by the previous operation
//     html = html.replace(/<p>\s*<\/p>/g, '');

//     // Remove existing </ol> tags
//     html = html.replace(/<\/ol>/g, '');

//     // Correctly place </ol> tags after </li> tags
//     html = html.replace(/(<\/li>)(?=<ol>)/g, '$1<ol>');
//     html = html.replace(/(<\/li>)(?!<ol>)/g, '$1</ol>');

//     // Ensure the last <ol> is closed if it's open
//     if (html.match(/<ol>(?!.*<\/ol>)/)) {
//         html += '</ol>';
//     }

//     return html;
// }

// function cleanXmlString(xmlString) {
//     // Function to remove unnecessary tags and move <p><image> into <li> with content
//     const removeUnnecessaryTags = (node, imageTag) => {
//       if (node.nodeType === 3) return; // Ignore text nodes
//       if (node.nodeName === 'LI' && node.textContent.trim()) {
//         // If <li> has content, move the <p><image> inside this <li>
//         node.appendChild(imageTag.cloneNode(true));
//       } else {
//         const children = Array.from(node.childNodes);
//         children.forEach(child => {
//           if (child.nodeName === 'OL' || child.nodeName === 'LI') {
//             removeUnnecessaryTags(child, imageTag);
//           } else {
//             node.removeChild(child);
//           }
//         });
//       }
//     };
  
//     const parser = new DOMParser();
//     const serializer = new XMLSerializer();
//     const xmlDoc = parser.parseFromString(xmlString, 'application/xml');
  
//     // Find the <p><image> tag
//     let imageTag;
//     const pTags = xmlDoc.getElementsByTagName('p');

//     for (let p of Array.from(pTags)) {
    
//       if (p.getElementsByTagName('image').length > 0) {
//         imageTag = p;
//         break;
//       }
//     }

//     if (imageTag) {
//       // Remove <p><image> from its original location
//       imageTag.parentNode.removeChild(imageTag);
  
//       const root = xmlDoc.documentElement;
//       removeUnnecessaryTags(root, imageTag);
  
//       return serializer.serializeToString(root);
//     } else {
//         console.log();
//       return xmlString; // No <p><image> tag found
//     }
//   }

// function cleanXMLString(xml) {
//     let olContent = /<\/ol>\s*<p>(.*?)<\/p>\s*<ol>/g;

// // Find all matches of the pattern in the XML string
// let a = xml.match(olContent);
// console.log(a)
// // Check if a match is found before proceeding

//     // Extract the matched content and remove the <ol> tags
//     var result = a[0].replace(/<\/?ol>/g, '');

//     // Replace the matched content in the XML string
//     xml = xml.replaceAll(a[0], result);

//     // Replace occurrences of '</li>' followed by the extracted result followed by '<li>' with the desired HTML
    // xml = xml.replaceAll(new RegExp('</li>\\s*' + result + '\\s*<li>', 'g'), result);
//     xml = xml.replaceAll(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result);

//     // xml = xml.replace(/<\/ol>\s*<p><image\s[^>]*\/><\/p>\s*<ol>/g, '<p><image href="media/image0.png"/></p>');
//     xml = xml.replace(/<ol>\s*<\/ol>/g, '');

//     return xml;
//   }




function cleanXMLStringP(xml) {
    // let olContent = /<\/ol>\s*(?:<p>)(.*?)(?:<\/p>)\s*<ol>/g;
    let olContent = /<\/ol>\s*(?:<p>|<table>|image)(.*?)(?:<\/p>|<\/table>|<\/image>)\s*<ol>/g;
    let matches = xml.matchAll(olContent);
    for (let match of matches) {
    let result = match[0].replace(/<\/?ol>/g, '');
    xml = xml.replace(match[0], result);
    xml = xml.replace(
        new RegExp('</li>\\s*' + result + '\\s*<li(?:\\s+id="[^"]*")?(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
        result
    );
    

xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result);

xml = xml.replace(
    new RegExp('</li>\\s*' + result + '\\s*<li(?:\\s+id="[^"]*")?(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
    result
);


xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result)

    }
    // Remove empty <ol> tags
    xml = xml.replace(/<ol>\s*<\/ol>/g, '');

    return xml;
}

function cleanXMLStringNote(xml) {
    // let olContent = /<\/ol>\s*(?:<p>|<note>|<table>|image)(.*?)(?:<\/p>|<\/note>|<\/table>|<\/image>)\s*<ol>/g;

    let olContent = /<\/ol>\s*(?:<note>)(.*?)(?:<\/note>)\s*<ol>/g;

    let matches = xml.matchAll(olContent);
    for (let match of matches) {

    let result = match[0].replace(/<\/?ol>/g, '');

    xml = xml.replace(match[0], result);
    xml = xml.replace(
        new RegExp('</li>\\s*' + result + '\\s*<li(?:\\s+id="[^"]*")?(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
        result
    );
    

// xml = xml.replaceAll(new RegExp('</li>\\s*' + result + '\\s*<li>', 'g'), result);
xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result);

// xml = xml.replace(
//     new RegExp('</li>\\s*' + result + '\\s*<li(?![^>]*\\sid\\b)(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
//     result
// );

// xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result)

    }
    // Remove empty <ol> tags
    xml = xml.replace(/<ol>\s*<\/ol>/g, '');

    return xml;
}


module.exports={cleanXMLStringP,cleanXMLStringNote}