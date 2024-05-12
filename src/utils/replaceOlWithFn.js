
const { DOMParser, XMLSerializer } = require('xmldom');

////--------------------------more working-------------------------------------------------
// function replaceOlLi(xmlString) {
//     // Parse the XML string
//     let parser = new DOMParser();
//     let xmlDoc = parser.parseFromString(xmlString, "text/xml");

//     // Get all <li> elements
//     let liElements = xmlDoc.getElementsByTagName("li");

//     // Create an array to store grouped <li> elements
//     let groupedLiElements = {};

//     // Iterate through <li> elements
//     for (let i = 0; i < liElements.length; i++) {
//         let li = liElements[i];
//         let id = li.getAttribute("id");

//         // Check if the id starts with "footnote" or "endnote"
//         if (id && (id.startsWith("footnote") || id.startsWith("endnote"))) {
//             // Get the group name (i.e., without the index number)
//             let groupName = id

//             // If the group doesn't exist yet, create it
//             if (!groupedLiElements[groupName]) {
//                 groupedLiElements[groupName] = [];
//             }

//             // Add the <li> element to the group
//             groupedLiElements[groupName].push(li);
//         }
//     }

//     // Replace grouped <li> elements with <fn> elements
//     for (let groupName in groupedLiElements) {
//         if (groupedLiElements.hasOwnProperty(groupName)) {
//             // Create <fn> element
//             let fn = xmlDoc.createElement("fn");
//             fn.setAttribute("id", groupName); // Set the id attribute for fn

//             // Append all grouped <li> element's child nodes to <fn>
//             groupedLiElements[groupName].forEach(function (li) {
//                 while (li.firstChild) {
//                     fn.appendChild(li.firstChild);
//                 }
//             });

//             // Find the first <li> element in the group and replace it with <fn>
//             let firstLi = groupedLiElements[groupName][0];
//             firstLi.parentNode.replaceChild(fn, firstLi);
//         }
//     }


//     let fnElements = xmlDoc.getElementsByTagName("fn");

//     // Iterate through <fn> elements
//     for (let i = 0; i < fnElements.length; i++) {
//         let fn = fnElements[i];
//         let parentOlOrUl = fn.parentNode; // Get parent <ol> or <ul>

//         // Check if the parent node is <ol> or <ul>
//         if (parentOlOrUl.tagName === "ol" || parentOlOrUl.tagName === "ul") {
//             // Create <p> element
//             let p = xmlDoc.createElement("p");

//             // Append all child nodes of <ol> or <ul> to <p>
//             while (parentOlOrUl.firstChild) {
//                 p.appendChild(parentOlOrUl.firstChild);
//             }

//             // Replace parent <ol> or <ul> with <p>
//             parentOlOrUl.parentNode.replaceChild(p, parentOlOrUl);
//         }
//     }


//     // Serialize the XML document back to string
//     let serializer = new XMLSerializer();
//     return serializer.serializeToString(xmlDoc);
// }
//------------------------------------------

function replaceOlLi(xmlString) {
    // Parse the XML string
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlString, "text/xml");

    // Get all <li> elements
    let liElements = xmlDoc.getElementsByTagName("li");

    // Create an array to store grouped <li> elements
    let groupedLiElements = {};

    // Iterate through <li> elements
    for (let i = 0; i < liElements.length; i++) {
        let li = liElements[i];
        let id = li.getAttribute("id");

        // Check if the id starts with "footnote" or "endnote"
        if (id && (id.startsWith("footnote") || id.startsWith("endnote"))) {
            // Get the group name (i.e., without the index number)
            let groupName = id

            // If the group doesn't exist yet, create it
            if (!groupedLiElements[groupName]) {
                groupedLiElements[groupName] = [];
            }

            // Add the <li> element to the group
            groupedLiElements[groupName].push(li);
        }
    }

    // Replace grouped <li> elements with <fn> elements
    for (let groupName in groupedLiElements) {
        if (groupedLiElements.hasOwnProperty(groupName)) {
            // Create <p> element to wrap <fn>
            let p = xmlDoc.createElement("p");

            // Create <fn> element
            let fn = xmlDoc.createElement("fn");
            fn.setAttribute("id", groupName); // Set the id attribute for fn

            // Append all grouped <li> element's child nodes to <fn>
            groupedLiElements[groupName].forEach(function (li) {
                while (li.firstChild) {
                    fn.appendChild(li.firstChild);
                }
            });

            // Append <fn> to <p>
            p.appendChild(fn);

            // Find the parent of the grouped <li> elements
            let parentOl = groupedLiElements[groupName][0].parentNode.parentNode;

            // Replace the parent <ol> with <p> containing <fn>
            parentOl.parentNode.replaceChild(p, parentOl);
        }
    }

    // Serialize the XML document back to string
    let serializer = new XMLSerializer();
    return serializer.serializeToString(xmlDoc);
}














module.exports=replaceOlLi