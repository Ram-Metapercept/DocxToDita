
const { DOMParser, XMLSerializer } = require('xmldom');

// function attachIdToTitle(xmlString) {
//     const parser = new DOMParser();
//     const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

//     const titleElements = xmlDoc.getElementsByTagName('title');

//     Array.from(titleElements).forEach(titleElement => { 
//         const outputclass = titleElement.getAttribute('outputclass'); 
//         // const xref = titleElement.getElementsByTagName('xref')[0];
//         const xrefs = Array.from(titleElement.getElementsByTagName('xref'));
//         xrefs.forEach((xref) => {
//             // if (outputclass && outputclass.startsWith('h') && xref && xref.getAttribute('id')) {
//                 if (xref && xref.getAttribute('id')) {
//             const id = xref.getAttribute('id');
//                 titleElement.setAttribute('id', id);
//                 xref.removeAttribute('id');
                
//                 // Remove xref tag and its attributes 
//                 const parent = xref.parentNode;
//                 parent.removeChild(xref);
//             }
//         });
        
      
//     });

//     const serializer = new XMLSerializer();
//     return serializer.serializeToString(xmlDoc);
// }


function attachIdToTitle(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    // Handle title elements
    const titleElements = xmlDoc.getElementsByTagName('title');
    Array.from(titleElements).forEach(titleElement => {
        processElement(titleElement);
    });
    const liElements = xmlDoc.getElementsByTagName('li');
    Array.from(liElements).forEach(liElements => {
        processElement(liElements);
    });
    // Handle p elements
    const pElements = xmlDoc.getElementsByTagName('p');
    Array.from(pElements).forEach(pElement => {
        processElement(pElement);
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
}

function processElement(element) {
    const xrefs = Array.from(element.getElementsByTagName('xref'));
    xrefs.forEach(xref => {
        if (xref && xref.getAttribute('id')) {
            const id = xref.getAttribute('id');
            element.setAttribute('id', id);
            xref.removeAttribute('id');
            
            // Remove xref tag and its attributes 
            const parent = xref.parentNode;
            parent.removeChild(xref);
        }
    });
}

module.exports = attachIdToTitle;



