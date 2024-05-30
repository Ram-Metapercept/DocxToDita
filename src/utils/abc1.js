const { DOMParser, XMLSerializer } = require('xmldom');

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
    // moveTagToNearestLi('p');
    moveTagToNearestLi('note');
   
    // Serialize the DOM back into a string
    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
}


module.exports=moveTagsToNearestLi