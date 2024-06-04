
const { DOMParser, XMLSerializer } = require('xmldom');
function moveTagsToNearestLi(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
    function moveTagToNearestLi(tagName) {
        const tags = xmlDoc.getElementsByTagName(tagName);

        for (let i = tags.length - 1; i >= 0; i--) {
            const tag = tags[i];

            let previousNode = tag.previousSibling;
            while (previousNode && previousNode.nodeName !== 'li') {
                previousNode = previousNode.previousSibling;
            }

            if (previousNode && previousNode.nodeName === 'li') {

                previousNode.appendChild(tag);
            }
        }
    }


    moveTagToNearestLi('p');
    moveTagToNearestLi('note');

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
}


module.exports = moveTagsToNearestLi

