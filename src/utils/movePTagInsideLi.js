
const { DOMParser, XMLSerializer } = require('xmldom');
// function moveImageInsideLi(xmlString) {
//     // Parse the XML string into a DOM object
//     let parser = new DOMParser();
//     let xmlDoc = parser.parseFromString(xmlString, "text/xml");

//     // Locate the <p> element with the <image> inside
//     let olElement = xmlDoc.getElementsByTagName('ol')[0];
//     let pImageElement = xmlDoc.getElementsByTagName('p')[0];

//     // Locate the first <li> element within the <ol>
//     let firstLiElement = olElement.getElementsByTagName('li')[0];

//     // Append the <p> element inside the first <li> element
//     firstLiElement.appendChild(pImageElement);

//     // Serialize the updated XML back to a string
//     let serializer = new XMLSerializer();
//     return serializer.serializeToString(xmlDoc);
// }

// function moveImageInsideLi(xmlString) {
//     // Extract the <p><image href="media/image0.png"/></p> element
//     const imagePattern = /<p><image href="media\/image0\.png"\/><\/p>/;
//     const imageMatch = xmlString.match(imagePattern);

//     // Check if the match was found
//     if (!imageMatch) {
//         return xmlString;  // Return the original string if no match is found
//     }

//     const imageElement = imageMatch[0];

//     // Remove the <p><image href="media/image0.png"/></p> element from its original position
//     xmlString = xmlString.replace(imagePattern, '');

//     // Find the nearest preceding <li> with content and insert the <p> element into it
//     const liPattern = /(<li[^>]*>[^<]*[\s\S]*?<\/li>)(?![\s\S]*<\/li>)/;
//     xmlString = xmlString.replace(liPattern, `$1${imageElement}`);

//     return xmlString;
// }

// function movePTagsToNearestLi(xmlString) {
//     // Parse the XML string into a DOM object
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

//     // Get all <p> tags
//     const pTags = xmlDoc.getElementsByTagName('p');

//     // Traverse the <p> tags in reverse order to handle nested structures properly
//     for (let i = pTags.length - 1; i >= 0; i--) {
//         const pTag = pTags[i];

//         // Find the nearest preceding <li> tag
//         let previousNode = pTag.previousSibling;
//         while (previousNode && previousNode.nodeName !== 'li') {
//             previousNode = previousNode.previousSibling;
//         }

//         if (previousNode && previousNode.nodeName === 'li') {
//             // Move the <p> tag to be the last child of the nearest <li> tag
//             previousNode.appendChild(pTag);
//         }
//     }

//     // Serialize the DOM back into a string
//     const serializer = new XMLSerializer();
//     return serializer.serializeToString(xmlDoc);
// }
function moveTagsToNearestLi(xmlString) {
    // Parse the XML string into a DOM object
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Function to move a specific tag type to the nearest preceding <li>
    function moveTagToNearestLi(tagName) {
        const tags = xmlDoc.getElementsByTagName(tagName);

        // Traverse the tags in reverse order to handle nested structures properly
        for (let i = tags.length - 1; i >= 0; i--) {
            const tag = tags[i];

            // Find the nearest preceding <li> tag
            let previousNode = tag.previousSibling;
            while (previousNode && previousNode.nodeName !== 'li') {
                previousNode = previousNode.previousSibling;
            }

            if (previousNode && previousNode.nodeName === 'li') {
                // Move the tag to be the last child of the nearest <li> tag
                previousNode.appendChild(tag);
            }
        }
    }

    // Move both <p> and <note> tags
    moveTagToNearestLi('p');
    moveTagToNearestLi('note');
   
    // Serialize the DOM back into a string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
}


module.exports=moveTagsToNearestLi

