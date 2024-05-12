
const { DOMParser, XMLSerializer } = require('xmldom');

function attachIdToTitle(xmlString) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, 'text/xml');

    const titleElements = xmlDoc.getElementsByTagName('title');

    Array.from(titleElements).forEach(titleElement => { 
        const outputclass = titleElement.getAttribute('outputclass'); 
        // const xref = titleElement.getElementsByTagName('xref')[0];
        const xrefs = Array.from(titleElement.getElementsByTagName('xref'));
        xrefs.forEach((xref) => {
            // if (outputclass && outputclass.startsWith('h') && xref && xref.getAttribute('id')) {
                if (xref && xref.getAttribute('id')) {
            const id = xref.getAttribute('id');
                titleElement.setAttribute('id', id);
                xref.removeAttribute('id');
                
                // Remove xref tag and its attributes 
                const parent = xref.parentNode;
                parent.removeChild(xref);
            }
        });
        
      
    });

    const serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
}

module.exports = attachIdToTitle;


