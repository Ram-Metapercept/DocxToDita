const { DOMParser, XMLSerializer } = require("xmldom");
var convert = require('xml-js');



// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");

//   // Variable to store the current topic element
//   let currentTopicElement;

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];

//     // If it's the first title element or the next sibling is not a title
//     if (!currentTopicElement ) {
//       // Create a new topic element
//       currentTopicElement = xmlDoc.createElement("topic");

//       // Insert the new topic element before the title element
//       titleElement.parentNode.insertBefore(currentTopicElement, titleElement);
//     }

//     // Move the title element inside the current topic element
//     currentTopicElement.appendChild(titleElement);
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   return modifiedXmlString;
// }


// // -------------------------------------- working code for case 1--------------
// function addTopicTag(xmlString) {
//   // Define regex pattern to match title output classes from h1 to h6
//   const titleOutputClassRegex = /<title class="- topic\/title " outputclass="(h[1-6])">(.*?)<\/title>/g;

//   // Replace matched title output classes with <topic> tags
//   const wrappedXmlString = xmlString.replace(titleOutputClassRegex, '<topic>\n\t<title class="- topic/title " outputclass="$1">$2</title>\n');

//   // Split the wrapped XML string into parts based on the <topic> tag
//   const parts = wrappedXmlString.split('</topic>');

//   // Reassemble the XML string with <topic> tags wrapping the content after each matched title
//   let transformedXmlString = parts.map((part, index) => {
//       // Skip the last part as it doesn't need to be wrapped with <topic> tags
//       if (index === parts.length - 1) {
//           return part;
//       }
//       return part + '</topic>';
//   }).join('');

 
//   return transformedXmlString;
// }

// -----------------------------------------------------------
























// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];

//     // Create a new topic element
//     const topicElement = xmlDoc.createElement("topic");

//     // Insert the new topic element before the title element
//     titleElement.parentNode.insertBefore(topicElement, titleElement);

//     // Move the title element inside the topic element
//     topicElement.appendChild(titleElement);
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   // console.log(modifiedXmlString);
//   return modifiedXmlString;
// }

//---some what workings---
// function addTopicTag(xmlString) {

//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");

//   let currentLevel = null;
//   let topicElement = null;

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];
//     const outputClass = titleElement.getAttribute("outputclass");

//     // Get the level of the current heading
//     const level = parseInt(outputClass.replace("h",""), 10);

//     if (currentLevel === null) {
//       // If it's the first title encountered, initialize the topic element
//       topicElement = xmlDoc.createElement("topic");
//       body.insertBefore(topicElement, titleElement);
//     } else if (level >=currentLevel) {
//       // If the current heading is at a deeper level, nest it inside the current topic
//       const nestedTopic = xmlDoc.createElement("topic");
//       topicElement.appendChild(nestedTopic);
//       topicElement = nestedTopic;
//     } else if (level < currentLevel) {
//       // If the current heading is at the same or shallower level, close the topic
//       while (level <= currentLevel && topicElement.parentNode !== body) {
//         topicElement = topicElement.parentNode;
//         currentLevel--;
//       }
//     }

//     // Move the title element inside the topic element
//     topicElement.appendChild(titleElement);
//     currentLevel = level;
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   return modifiedXmlString;
// }

// ---------------------------------------

// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");

//   let currentLevel = null;
//   let topicElement = null;

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];
//     const outputClass = titleElement.getAttribute("outputclass");

//     // If the title element's outputclass is h1 or h2
//     if (outputClass === "h1" || outputClass === "h2" || outputClass === "h3" || outputClass === "h4" ){
//       // Create a new topic element
//       topicElement = xmlDoc.createElement("topic");

//       // Insert the topic element before the title element
//       body.insertBefore(topicElement, titleElement);
//       // Move the title element inside the topic element
//       topicElement.appendChild(titleElement);
//       // Reset currentLevel
//       currentLevel = outputClass;
//     } else if (topicElement) {
//       // If topicElement exists, move the current element inside it
//       topicElement.appendChild(titleElement);
//     }
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   return modifiedXmlString;
// }

// ----------------------------------------------------------------------
// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");
//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");
//   let currentLevel = null;
//   let topicElement = null;

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];
//     const outputClass = titleElement.getAttribute("outputclass");

//     // Get the level of the current heading
//     const level = parseInt(outputClass.replace("h", ""), 10);

//     if (currentLevel === null) {
//       // If it's the first title encountered, initialize the topic element
//       topicElement = xmlDoc.createElement("topic");
//       body.insertBefore(topicElement, titleElement);
//     } else if (level >= currentLevel) {
//       // If the current heading is at a deeper level, nest it inside the current topic
//       const nestedTopic = xmlDoc.createElement("topic");
//       topicElement.appendChild(nestedTopic);
//       topicElement = nestedTopic;
//     } else if (level < currentLevel) {
//       // If the current heading is at the same or shallower level, close the topic
//       while (level <= currentLevel && topicElement.parentNode !== body) {
//         topicElement = topicElement.parentNode;
//         currentLevel--;
//       }
//     }

//     // Move the title element inside the topic element
//     topicElement.appendChild(titleElement);
//     currentLevel = level;
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   return modifiedXmlString;
// }
// //--------------------------------working as per g------------------------------
// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];
//     const outputClass = titleElement.getAttribute("outputclass");

//     // If the title element's outputclass is h1 or h2
//     if (outputClass === "h1" || outputClass === "h2" || outputClass === "h3" || outputClass === "h4") {
//       let currentElement = titleElement.nextSibling;
//       let topicElement = xmlDoc.createElement("topic");
//       // Move subsequent elements under topicElement until encountering next h1 or h2 or end of body
//       while (currentElement && currentElement.tagName !== "title") {
//         const nextElement = currentElement.nextSibling;
//         topicElement.appendChild(currentElement);
//         currentElement = nextElement;
//       }

//       // Insert the topicElement before the next title element
//       body.insertBefore(topicElement, titleElement.nextSibling);
//     }
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   return modifiedXmlString;
// }


// ---------------------- completely working---------
// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];

//   let titles = [];
//   let currentNode = body.firstChild;

//   // Collect <title> elements
//   while (currentNode) {
//     if (currentNode.nodeName === "title") {
//       titles.push(currentNode);
//     }
//     currentNode = currentNode.nextSibling;
//   }

//   let topics = [];

//   for (let i = 0; i < titles.length; i++) {
//     const title = titles[i];
//     const nextTitle = i < titles.length - 1 ? titles[i + 1] : null;

//     const topic = xmlDoc.createElement("topic");
//     const clonedTitleNode = title.cloneNode(true);
//     topic.appendChild(clonedTitleNode);

//     currentNode = title.nextSibling;
//     while (currentNode && currentNode !== nextTitle) {
//       const nextNode = currentNode.nextSibling;
//       topic.appendChild(currentNode); // Move the node into the topic
//       currentNode = nextNode;
//     }

//     topics.push(topic);
//   }

//   topics.forEach((topic) => {
//     body.insertBefore(topic, titles[0]);
//   });

//   titles.forEach((title) => {
//     body.removeChild(title);
//   });

//   const serializer = new XMLSerializer();
//   return serializer.serializeToString(xmlDoc);
// }

//---------- taking title tag in  body --------------------------------

// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];

//   let titles = [];
//   let currentNode = body.firstChild;

//   // Collect <title> elements
//   while (currentNode) {
//     if (currentNode.nodeName === "title") {
//       titles.push(currentNode);
//     }
//     currentNode = currentNode.nextSibling;
//   }

//   let topics = [];

//   for (let i = 0; i < titles.length; i++) {
//     const title = titles[i];
//     const nextTitle = i < titles.length - 1 ? titles[i + 1] : null;

//     const topic = xmlDoc.createElement("topic");
//     const titleClone = title.cloneNode(true);

//     const titleClass = titleClone.getAttribute("class");
//     const titleOutputClass = titleClone.getAttribute("outputclass");

//     if (titleClass) {
//       titleClone.setAttribute("class", titleClass);
//     }

//     if (titleOutputClass) {
//       titleClone.setAttribute("outputclass", titleOutputClass);
//     }

//     topic.appendChild(titleClone);

//     currentNode = title.nextSibling;
//     const bodyElement = xmlDoc.createElement("body");

//     while (currentNode && currentNode !== nextTitle) {
//       const nextNode = currentNode.nextSibling;
//       bodyElement.appendChild(currentNode); // Move the node into the body
//       currentNode = nextNode;
//     }

//     topic.appendChild(bodyElement);
//     topics.push(topic);
//   }

//   topics.forEach((topic) => {
//     body.appendChild(topic);
//   });

//   titles.forEach((title) => {
//     body.removeChild(title);
//   });

//   const serializer = new XMLSerializer();
//   return serializer.serializeToString(xmlDoc);
// }
// ------------------------------------------
function addTopicTag(xmlString) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");

  const body = xmlDoc.getElementsByTagName("body")[0];

  let titles = [];
  let currentNode = body.firstChild;

  // Collect <title> elements
  while (currentNode) {
    if (currentNode.nodeName === "title") {
      titles.push(currentNode);
    }
    currentNode = currentNode.nextSibling;
  }

  let topics = [];

  for (let i = 0; i < titles.length; i++) {
    const title = titles[i];
    const nextTitle = i < titles.length - 1 ? titles[i + 1] : null;

    const topic = xmlDoc.createElement("topic");
    const titleClone = title.cloneNode(true);

    const titleClass = titleClone.getAttribute("class");
    const titleOutputClass = titleClone.getAttribute("outputclass");

    if (titleClass) {
      titleClone.setAttribute("class", titleClass);
    }

    if (titleOutputClass) {
      titleClone.setAttribute("outputclass", titleOutputClass);
    }

    topic.appendChild(titleClone);

    currentNode = title.nextSibling;
    const bodyElement = xmlDoc.createElement("body");

    while (currentNode && currentNode !== nextTitle) {
      if (currentNode.nodeName !== "title" && currentNode.nodeName !== "shortdesc") {
        const nextNode = currentNode.nextSibling;
        bodyElement.appendChild(currentNode); // Move the node into the body
        currentNode = nextNode;
      } else {
        currentNode = currentNode.nextSibling;
      }
    }

    topic.appendChild(bodyElement);
    topics.push(topic);
  }

  topics.forEach((topic) => {
    body.appendChild(topic);
  });

  titles.forEach((title) => {
    body.removeChild(title);
  });

  const serializer = new XMLSerializer();
  return serializer.serializeToString(xmlDoc);
}



//----------------- working for h1 h2 h3 h4 h5 h6-----------------
// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];
//     const outputClass = titleElement.getAttribute("outputclass");

//     // If the title element's outputclass is h1 or h2
//     if (outputClass === "h1" || outputClass === "h2" || outputClass === "h3" || outputClass === "h4") {
//       // Check if there's a topic immediately following the title
//       if (titleElement.nextSibling && titleElement.nextSibling.tagName === "topic") {
//         // If so, move its children before the title
//         let topicElement = titleElement.nextSibling;
//         let currentChild = topicElement.firstChild;
//         while (currentChild) {
//           const nextChild = currentChild.nextSibling;
//           body.insertBefore(currentChild, titleElement);
//           currentChild = nextChild;
//         }
//         // Remove the empty topic element
//         body.removeChild(topicElement);
//       }

//       // Create a new topic element before the title
//       let topicElement = xmlDoc.createElement("topic");

//       // Insert the topicElement before the title element
//       body.insertBefore(topicElement, titleElement);

//       // Move the title and its siblings under the new topicElement
//       let currentElement = titleElement;
//       while (currentElement) {
//         const nextElement = currentElement.nextSibling;
//         topicElement.appendChild(currentElement);
//         currentElement = nextElement;
//       }
//     }
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   return modifiedXmlString;
// }
///---------------------------------------












// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");

//   console.log("Found title elements:", titleElements.length);

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];
//     const outputClass = titleElement.getAttribute("outputclass");

//     console.log("Title element:", titleElement, "Output class:", outputClass);

//     // If the title element's outputclass is h1, h2, h3, or h4
//     if (outputClass === "h1" || outputClass === "h2" || outputClass === "h3" || outputClass === "h4") {
//       let topicElement = xmlDoc.createElement("topic");
//       let nextSibling = titleElement.nextSibling;

//       // Move subsequent elements under topicElement until encountering next title element or end of body
//       while (nextSibling && nextSibling.tagName !== "title") {
//         let currentSibling = nextSibling;
//         nextSibling = currentSibling.nextSibling;
//         topicElement.appendChild(currentSibling);
//       }

//       // Insert the topicElement before the current title element
//       body.insertBefore(topicElement, titleElement);
//     }
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   return modifiedXmlString;
// }




// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];
//     const outputClass = titleElement.getAttribute("outputclass");

//     // If the title element's outputclass is h1 or h2
//     if (outputClass === "h1" || outputClass === "h2" || outputClass === "h3" || outputClass === "h4") {
//       let currentElement = titleElement.previousSibling;
//       let topicElement = xmlDoc.createElement("topic");

//       // Move subsequent elements under topicElement until encountering next h1 or h2 or end of body
//       while (currentElement) {
//         const prevElement = currentElement.previousSibling;

//         if (currentElement.tagName === "title" && currentElement !== titleElement) {
//           break; // Stop moving elements if previous title tag is found
//         }

//         if (currentElement.tagName !== "title") {
//           topicElement.insertBefore(currentElement, topicElement.firstChild);
//         }
//         currentElement = prevElement;
//       }

//       // Insert the topicElement before the titleElement
//       titleElement.parentNode.insertBefore(topicElement, titleElement);
//     }
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   return modifiedXmlString;
// }



// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const titles = xmlDoc.querySelectorAll('title[outputclass^="h"]');

//   titles.forEach(title => {
//       const outputclass = title.getAttribute('outputclass');
//       const level = outputclass.charAt(outputclass.length - 1); // Extracting the heading level
//       const parentLevel = parseInt(level) - 1; // Getting the parent heading level

//       // Find the parent title element with the appropriate output class
//       let parentTitle = title.previousElementSibling;
//       while (parentTitle && !parentTitle.classList.contains('-') && !parentTitle.getAttribute('outputclass').endsWith(parentLevel)) {
//           parentTitle = parentTitle.previousElementSibling;
//       }

//       if (parentTitle) {
//           // Create a new topic element
//           const topic = xmlDoc.createElement('topic');
//           title.parentNode.insertBefore(topic, title);
//           title.remove();
//           topic.appendChild(title);

//           // Close nested heading tags
//           let currentTitle = title;
//           for (let i = parentLevel; i > 1; i--) {
//               const nestedTopic = xmlDoc.createElement('topic');
//               const nestedTitle = xmlDoc.createElement('title');
//               const nestedOutputclass = `h${i}`;
//               nestedTitle.setAttribute('outputclass', nestedOutputclass);
//               nestedTopic.appendChild(nestedTitle);
//               currentTitle.parentNode.insertBefore(nestedTopic, currentTitle);
//               nestedTitle.appendChild(currentTitle);
//               currentTitle = nestedTitle;
//           }
//       }
//   });

//   const serializer = new XMLSerializer();
//   const outputXmlString = serializer.serializeToString(xmlDoc);
//   console.log(outputXmlString);
// }

// const { JSDOM } = require("jsdom");

// function addTopicTag(xmlString) {
//     // Create a DOM from the XML string using jsdom
//     const dom = new JSDOM(xmlString);
//     const xmlDoc = dom.window.document;

//     // Get all title elements with outputclass attribute
//     let titleElements = xmlDoc.querySelector("title[outputclass]");
// console.log(titleElements);
//     // Loop through each title element
//     titleElements.forEach(titleElement => {
//         // Get the outputclass attribute value
//         let outputClass = titleElement.getAttribute("outputclass");

//         // Create nested <topic> tags based on the outputclass value
//         let nestedTopicTags = createNestedTopicTags(xmlDoc, outputClass);

//         // Replace the original title element with nestedTopicTags
//         titleElement.replaceWith(nestedTopicTags);
//         nestedTopicTags.appendChild(titleElement);
//     });

//     // Serialize the modified XML document back to a string
//     let modifiedXmlString = dom.serialize();
//     return modifiedXmlString;
// }

// function createNestedTopicTags(document, outputClass) {
//     let nestingLevels = ["h1", "h2", "h3", "h4", "h5", "h6"];
//     let currentLevelIndex = nestingLevels.indexOf(outputClass.substring(1));
//     let nestedTopicTags = document.createElement("topic");

//     for (let i = 0; i < currentLevelIndex; i++) {
//         let innerTopicTag = document.createElement("topic");
//         nestedTopicTags.appendChild(innerTopicTag);
//         nestedTopicTags = innerTopicTag;
//     }

//     return nestedTopicTags;
// }

// -----------------------------oldest code ----------------

// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const titleElements = body.getElementsByTagName("title");

//   // Iterate over each title element
//   for (let i = 0; i < titleElements.length; i++) {
//     const titleElement = titleElements[i];

//     // Create a new topic element
//     const topicElement = xmlDoc.createElement("topic");

//     // Insert the new topic element before the title element
//     titleElement.parentNode.insertBefore(topicElement, titleElement);

//     // Move the title element inside the topic element
//     topicElement.appendChild(titleElement);
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   // console.log(modifiedXmlString);
//   return modifiedXmlString;
// }





// ----------------------------------------------------------------

// function addTopicTag(xmlString) {
//   const parser = new DOMParser();
//   const xmlDoc = parser.parseFromString(xmlString, "text/xml");

//   const body = xmlDoc.getElementsByTagName("body")[0];
//   const bodyChildren = body.childNodes;
//   let currentTopicElement;

//   // Function to check if a node is a title element with an outputclass starting with 'h'
//   function isHeadingTitle(node) {
//     return node.tagName === 'title' && node.getAttribute("outputclass") && node.getAttribute("outputclass").startsWith("h");
//   }

//   // Iterate through the child nodes of the body
//   for (let i = 0; i < bodyChildren.length; i++) {
//     const child = bodyChildren[i];

//     // If the child is a title with heading outputclass
//     if (isHeadingTitle(child)) {
//       // Create a new topic element
//       currentTopicElement = xmlDoc.createElement("topic");
//       // Append the title to the topic
//       currentTopicElement.appendChild(child);
//       // Append the topic to the body
//       body.appendChild(currentTopicElement);
//     } else if (currentTopicElement && child.nodeType !== Node.TEXT_NODE) {
//       // If there's a current topic and the child is not a text node, append it to the current topic
//       currentTopicElement.appendChild(child.cloneNode(true));
//     } else {
//       // If the child is not a title with heading outputclass and there's no current topic, append it to the body
//       body.appendChild(child.cloneNode(true));
//     }

//     // If the current child is a title with heading outputclass and there's a topic open
//     // we need to close it before opening a new one
//     if (isHeadingTitle(child) && currentTopicElement) {
//       currentTopicElement = undefined;
//     }
//   }

//   // Convert the modified XML back to a string
//   const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

//   return modifiedXmlString;
// }


module.exports = addTopicTag;