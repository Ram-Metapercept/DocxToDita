// const fs = require('fs');
// const xml2js = require('xml2js');
// function generateRandomId() {
//     // Generate a random string of characters
//     const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//     let randomId = '';
  
//     for (let i = 0; i < 10; i++) {
//       randomId += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
//     }
  
//     return randomId;
//   }
  
// function createDitaFile(xmlContent) {
//     const parser = new xml2js.Parser();
//     parser.parseString(xmlContent, (err, result) => {
//         if (err) {
//             console.error('Error parsing XML:', err);
//             return;
//         }

//         const topic = result.topic.body[0].topic.pop(); // Extracting the innermost topic

//         const title = topic.title[0]._; // Getting the title
//         const fileName = title.toLowerCase().replace(/\s+/g, '_') + '.dita'; // Generating file name
//         // console.log(topic);
//         let ditaContent = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">\n`;

//         const randomId = generateRandomId();
//         ditaContent += `<topic id="${randomId}">\n`;
//         ditaContent += `  <title class="${topic.title[0].$.class}">${topic.title[0]._}</title>\n`;

//         if (topic.body && topic.body.length > 0) {
//             ditaContent += `  <body>\n`;
        
//             topic.body[0].p.forEach(item => {
//                 if (typeof item === 'object' && item._) {
//                     // If item is an object with '_', add content inside '_' to ditaContent
//                     ditaContent += `    <p>${item._}</p>\n`;
//                 } else if (typeof item === 'string') {
//                     // If item is a string, add the string to ditaContent
//                     ditaContent += `    <p>${item}</p>\n`;
//                 }
//             }
//         );
//             if (topic.body[0].p && topic.body[0].p.length > 0) {
//                 topic.body[0].p.forEach(p => {
                   
//                     if (p.b) {
//                         p.b.forEach(noteItem => {
//                             ditaContent += `    <b>${noteItem}</b>\n`;
//                         });
                        
//                     }
//                     ditaContent += `    <p>${p._}</p>\n`;
//                 });
//             }
//             // Accessing content inside the 'note' tag
//             if (topic.body[0].note && topic.body[0].note.length > 0) {
//                 topic.body[0].note.forEach(note => {
//                     if (note.p) {
//                         note.p.forEach(noteItem => {
//                             ditaContent += `    <note>${noteItem}</note>\n`;
//                         });
//                     }
//                 });
//             }
        
//             // Accessing content inside the 'ul' tag
//             if (topic.body[0].ul && topic.body[0].ul.length > 0) {
//                 topic.body[0].ul.forEach(ul => {
//                     if (ul.li) {
//                         ul.li.forEach(liItem => {
//                             ditaContent += `    <ul><li>${liItem}</li></ul>\n`;
//                         });
//                     }
//                 });
//             }
        
//             ditaContent += `  </body>\n`;
//         }
        
//         ditaContent += `</topic>`;

//         fs.writeFile(fileName, ditaContent, (err) => {
//             if (err) {
//                 console.error('Error writing DITA file:', err);
//                 return;
//             }
//             console.log(`DITA file "${fileName}" created successfully.`);
//         });
//     });
// }



// module.exports = createDitaFile




const fs = require('fs');
const xml2js = require('xml2js');
const { DOMParser } = require('xmldom');
function generateRandomId() {
    // Generate a random string of characters
    const randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomId = '';
  
    for (let i = 0; i < 10; i++) {
      randomId += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
  
    return randomId;
}

// function processTopic(topic, parentTitle) {
//     const title = parentTitle ? parentTitle + '_' + topic.title[0]._ : topic.title[0]._; // Combining titles if nested
//     const fileName = title.toLowerCase().replace(/\s+/g, '_') + '.dita'; // Generating file name

//     let ditaContent = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">\n`;

//     const randomId = generateRandomId();
//     ditaContent += `<topic id="${randomId}">\n`;
//     ditaContent += `  <title class="${topic.title[0].$.class}">${topic.title[0]._}</title>\n`;

//     if (topic.body && topic.body.length > 0) {
//         ditaContent += `  <body>\n`;

//         topic.body[0].p.forEach(item => {
//             if (typeof item === 'object' && item._) {
//                 ditaContent += `    <p>${item._}</p>\n`;
//             } else if (typeof item === 'string') {
//                 ditaContent += `    <p>${item}</p>\n`;
//             }
//         });
//         if (topic.body[0].ul && topic.body[0].ul.length > 0) {
//             topic.body[0].ul.forEach(ul => {
//                 ditaContent += `    <ul>\n`;
//                 ul.li.forEach(liItem => {
//                     ditaContent += `      <li>${liItem}</li>\n`;
//                 });
//                 ditaContent += `    </ul>\n`;
//             });
//         }
//         // Process nested topics recursively
//         if (topic.topic) {
//             topic.topic.forEach(childTopic => {
//                 ditaContent += processTopic(childTopic, title);
//             });
//         }

//         ditaContent += `  </body>\n`;
//     }

//     ditaContent += `</topic>`;
    
//     // Write content to file
//     fs.writeFile(fileName, ditaContent, (err) => {
//         if (err) {
//             console.error('Error writing DITA file:', err);
//             return;
//         }
//         console.log(`DITA file "${fileName}" created successfully.`);
//     });
// }

// function processTopic(topic, parentTitle) {
//     const title = parentTitle ? parentTitle + '_' + topic.title[0]._ : topic.title[0]._; // Combining titles if nested
//     const fileName = title.toLowerCase().replace(/\s+/g, '_') + '.dita'; // Generating file name
//     const outputClass = topic.title[0].$.outputclass || "";
//     let ditaContent = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">\n`;

//     const randomId = generateRandomId();
//     ditaContent += `<topic id="${randomId}">\n`;
//     ditaContent += `  <title class="${topic.title[0].$.class}" outputclass="${outputClass}" >${topic.title[0]._}</title>\n`;

//     if (topic.body && topic.body.length > 0) {
//         ditaContent += `  <body>\n`;

//         topic.body[0].p.forEach(item => {
//             if (typeof item === 'object' && item._) {
//                 ditaContent += `    <p>${item._}</p>\n`;
//             } else if (typeof item === 'string') {
//                 ditaContent += `    <p>${item}</p>\n`;
//             }
//         });

//         // Process nested topics recursively
//         if (topic.topic) {
//             topic.topic.forEach(childTopic => {
//                 ditaContent += processTopic(childTopic, title);
//             });
//         }


//         if (topic.body[0].ul && topic.body[0].ul.length > 0) {
//             topic.body[0].ul.forEach(ul => {
//                 ditaContent += `    <ul>\n`;
//                 ul.li.forEach(liItem => {
//                     if (typeof liItem === 'object') {
//                         // Handle nested lists recursively
//                         ditaContent += processNestedList(liItem);
//                     } else {
//                         ditaContent += `      <li>${liItem}</li>\n`;
//                     }
//                 });
//                 ditaContent += `    </ul>\n`;
//             });
//         }

//         ditaContent += `  </body>\n`;
//     }

//     ditaContent += `</topic>`;

//     // Write content to file
//     fs.writeFile(fileName, ditaContent, (err) => {
//         if (err) {
//             console.error('Error writing DITA file:', err);
//             return;
//         }
//         console.log(`DITA file "${fileName}" created successfully.`);
//     });
// }

// function processNestedList(item) {
//     let content = '';

//     if (item._) {
//         content += `      <li>${item._}</li>\n`;
//     }

//     if (item.ul && item.ul.length > 0) {
//         item.ul.forEach(sublist => {
//             content += `      <ul>\n`;
//             sublist.li.forEach(subitem => {
//                 if (typeof subitem === 'object') {
//                     content += processNestedList(subitem);
//                 } else {
//                     content += `        <li>${subitem}</li>\n`;
//                 }
//             });
//             content += `      </ul>\n`;
//         });
//     }

//     return content;
// }
// function createDitaFile(xmlContent) {
  
//     const parser = new xml2js.Parser();
//     parser.parseString(xmlContent, (err, result) => {
//         if (err) {
//             console.error('Error parsing XML:', err);
//             return;
//         }

//         const topic = result.topic.body[0].topic.pop(); // Extracting the innermost topic
//         processTopic(topic);
//     });
// }

// module.exports = createDitaFile;

// -------------------------------------------------------------------------------



// function processTopic(topic, parentTitle = '') {
//     console.log(topic.title[0].b[0].b[0]);
//     const title = parentTitle ? parentTitle + '_' + topic.title[0]._ : topic.title[0]._;

//     const fileName = title + '.dita';

//     let ditaContent = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">\n`;
//     const outputClass = topic.title[0].$.outputclass || "";
//     const randomId = generateRandomId();
//     ditaContent += `<topic id="${randomId}">\n`;
//     ditaContent += `  <title class="${topic.title[0].$.class}" outputclass="${outputClass}">${topic.title[0]._}</title>\n`;


//     if (topic.body && topic.body.length > 0) {
//         ditaContent += `  <body>\n`;

//         topic.body[0].p.forEach(item => {
//             if (typeof item === 'object' && item._) {
//                 ditaContent += `    <p>${item._}</p>\n`;
//             } else if (typeof item === 'string') {
//                 ditaContent += `    <p>${item}</p>\n`;
//             }
//         });

//         if (topic.body[0].ul && topic.body[0].ul.length > 0) {
//             topic.body[0].ul.forEach(ul => {
//                 ditaContent += `    <ul>\n`;
//                 ul.li.forEach(liItem => {
//                     if (typeof liItem === 'object') {
//                         ditaContent += processNestedList(liItem);
//                     } else {
//                         ditaContent += `      <li>${liItem}</li>\n`;
//                     }
//                 });
//                 ditaContent += `    </ul>\n`;
//             });
//         }

//         if (topic.topic) {
//             topic.topic.forEach(childTopic => {
//                 ditaContent += processTopic(childTopic, title);
//             });
//         }

//         ditaContent += `  </body>\n`;
//     }

//     ditaContent += `</topic>`;

//     fs.writeFile(fileName, ditaContent, (err) => {
//         if (err) {
//             console.error('Error writing DITA file:', err);
//             return;
//         }
//         console.log(`DITA file "${fileName}" created successfully.`);
//     });
// }

// function processNestedList(item) {
//     let content = '';

//     if (item._) {
//         content += `      <li>${item._}</li>\n`;
//     }

//     if (item.ul && item.ul.length > 0) {
//         item.ul.forEach(sublist => {
//             content += `      <ul>\n`;
//             sublist.li.forEach(subitem => {
//                 if (typeof subitem === 'object') {
//                     content += processNestedList(subitem);
//                 } else {
//                     content += `        <li>${subitem}</li>\n`;
//                 }
//             });
//             content += `      </ul>\n`;
//         });
//     }

//     return content;
// }

// function createDitaFile(xmlContent) {
//     const parser = new xml2js.Parser();
//     parser.parseString(xmlContent, (err, result) => {
//         if (err) {
//             console.error('Error parsing XML:', err);
//             return;
//         }

//         const topic = result.topic.body[0].topic.pop();
//         // Extracting the innermost topic
//         processTopic(topic);
//     });
// }
// ---------------------------------------------------------


// function extractTopics(xmlString) {
//     const topics = [];
//     let index = xmlString.lastIndexOf('<topic');
    
//     while (index !== -1) {
//         const endIndex = xmlString.indexOf('</topic>', index) + '</topic>'.length;
//         const topicContent = xmlString.substring(index, endIndex);
//         topics.push(topicContent);

//         xmlString = xmlString.substring(0, index) + xmlString.substring(endIndex);
//         index = xmlString.lastIndexOf('<topic');
//     }

//     return topics.reverse();
// }

// function extractTitle(topic) {
//     const titleStartIndex = topic.indexOf('<title');
//     const titleEndIndex = topic.indexOf('</title>', titleStartIndex);
//     const titleContent = topic.substring(titleStartIndex, titleEndIndex + '</title>'.length);

//     // Extracting the title text
//     const titleText = titleContent.replace(/<\/?[^>]+(>|$)/g, '');

//     return titleText.trim();
// }

// function writeTopicToFile(topic) {
//     const title = extractTitle(topic);
//     const fileName = `${title}.dita`;

//     fs.writeFileSync(fileName, topic);
//     console.log(`File ${fileName} created.`);
// }

// function writeTopicsToFile(topics) {
//     topics.forEach(topic => {
//         writeTopicToFile(topic);
//     });
// }



// const topics = extractTopics(xmlString);
// writeTopicsToFile(topics);






// module.exports = writeTopicsToFile;
// ---------------------------------------------

// function extractTopicsAndWriteToFile(xmlString) {
//     const topics = [];
//     let index = xmlString.lastIndexOf('<topic');
    
//     while (index !== -1) {
//         const endIndex = xmlString.indexOf('</topic>', index) + '</topic>'.length;
//         const topicContent = xmlString.substring(index, endIndex);
//         topics.push(topicContent);

//         xmlString = xmlString.substring(0, index) + xmlString.substring(endIndex);
//         index = xmlString.lastIndexOf('<topic');
//     }

//     topics.reverse().forEach(topic => {
//         const title = extractTitle(topic);
//         const fileName = `${title}.dita`;

//         fs.writeFileSync(fileName, topic);
//         console.log(`File ${fileName} created.`);
//     });
// }

// function extractTitle(topic) {
//     const titleStartIndex = topic.indexOf('<title');
//     const titleEndIndex = topic.indexOf('</title>', titleStartIndex);
//     const titleContent = topic.substring(titleStartIndex, titleEndIndex + '</title>'.length);

//     // Extracting the title text
//     const titleText = titleContent.replace(/<\/?[^>]+(>|$)/g, '');

//     return titleText.trim();
// }
// ----------------------------------------
// function generateRandomId(length = 8) {
//     const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// }

// function extractTopicsAndWriteToFile(xmlString) {
//     const topics = [];
//     let index = xmlString.lastIndexOf('<topic');

//     while (index !== -1) {
//         const endIndex = xmlString.indexOf('</topic>', index) + '</topic>'.length;
//         let topicContent = xmlString.substring(index, endIndex);
        
//         // Add random ID to topic tag
//         const randomId = generateRandomId();
//         topicContent = topicContent.replace('<topic', `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">\n<topic id="${randomId}"`);

//         topics.push(topicContent);

//         xmlString = xmlString.substring(1, index) + xmlString.substring(endIndex);
//         index = xmlString.lastIndexOf('<topic');
//     }

//     topics.reverse().forEach(topic => {
//         const title = extractTitle(topic);
//         const fileName = `${title}.dita`;

//         fs.writeFileSync(fileName, topic);
//         console.log(`File ${fileName} created.`);
//     });
// }

// function extractTitle(topic) {
//     const titleStartIndex = topic.indexOf('<title');
//     const titleEndIndex = topic.indexOf('</title>', titleStartIndex);
//     const titleContent = topic.substring(titleStartIndex, titleEndIndex + '</title>'.length);

//     // Extracting the title text
//     const titleText = titleContent.replace(/<\/?[^>]+(>|$)/g, '');

//     return titleText.trim();
// }

//--------------------------------------- working code ----------------------------------
// function generateRandomId(length = 8) {
//     const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// }

// function extractTopicsAndWriteToFile(xmlString) {
//     const topics = [];
//     let startIndex = xmlString.indexOf('<body>') + '<body>'.length;
//     let endIndex = xmlString.indexOf('</body>');

//     let bodyContent = xmlString.substring(startIndex, endIndex);

//     let index = bodyContent.lastIndexOf('<topic');

//     while (index !== -1) {
//         const endTopicIndex = bodyContent.indexOf('</topic>', index) + '</topic>'.length;
//         let topicContent = bodyContent.substring(index, endTopicIndex);

//         // Add random ID to topic tag
//         const randomId = generateRandomId();
//         topicContent = topicContent.replace('<topic', `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">\n<topic id="${randomId}"`);

//         topics.push(topicContent);

//         bodyContent = bodyContent.substring(0, index) + bodyContent.substring(endTopicIndex);
//         index = bodyContent.lastIndexOf('<topic');
//     }

//     topics.reverse().forEach(topic => {
//         const title = extractTitle(topic);
//         const fileName = `${title}.dita`;

//         fs.writeFileSync(fileName, topic);
//         console.log(`File ${fileName} created.`);
//     });
// }

// function extractTitle(topic) {
//     const titleStartIndex = topic.indexOf('<title');
//     const titleEndIndex = topic.indexOf('</title>', titleStartIndex);
//     const titleContent = topic.substring(titleStartIndex, titleEndIndex + '</title>'.length);

//     // Extracting the title text
//     const titleText = titleContent.replace(/<\/?[^>]+(>|$)/g, '');

//     return titleText.trim();
// }
// module.exports =extractTopicsAndWriteToFile

// --------------------------------------------------------------





// function generateRandomId(length = 8) {
//     const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// }

// function extractTopicsAndWriteToFile(xmlString) {
//     const topics = [];
//     const bodyStartIndex = xmlString.indexOf('<body>') + '<body>'.length;
//     const bodyEndIndex = xmlString.indexOf('</body>');

//     if (bodyStartIndex === -1 || bodyEndIndex === -1) {
//         console.error("No <body> tag found in the XML.");
//         return;
//     }

//     const bodyContent = xmlString.substring(bodyStartIndex, bodyEndIndex);

//     let index = bodyContent.lastIndexOf('<topic');

//     while (index !== -1) {
//         const endTopicIndex = bodyContent.indexOf('</topic>', index) + '</topic>'.length;
//         let topicContent = bodyContent.substring(index, endTopicIndex);

//         // Add random ID to topic tag
//         const randomId = generateRandomId();
//         topicContent = topicContent.replace('<topic', `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">\n<topic id="${randomId}"`);

//         topics.push(topicContent);

//         bodyContent = bodyContent.substring(0, index) + bodyContent.substring(endTopicIndex);
//         index = bodyContent.lastIndexOf('<topic');
//     }

//     topics.reverse().forEach(topic => {
//         let title = extractTitle(topic);
//         const fileName = `${title}.dita`;

//         fs.writeFileSync(fileName, topic);
//         console.log(`File ${fileName} created.`);
//     });
// }



// module.exports = extractTopicsAndWriteToFile;
// function extractTitle(topic) {
//     const titleStartIndex = topic.indexOf('<title');
//     const titleEndIndex = topic.indexOf('</title>', titleStartIndex);
//     const titleContent = topic.substring(titleStartIndex, titleEndIndex + '</title>'.length);

//     // Extracting the title text
//     const titleText = titleContent.replace(/<\/?[^>]+(>|$)/g, '');

//     return titleText.trim();
// }
// function generateRandomId(length = 8) {
//     const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
//     let result = '';
//     for (let i = 0; i < length; i++) {
//         result += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return result;
// }

// function extractTopicsAndWriteToFiles(xmlString) {
//     const topics = [];
//     let index = xmlString.lastIndexOf('<topic');

//     while (index !== -1) {
//         const endIndex = xmlString.indexOf('</topic>', index) + '</topic>'.length;
//         let topicContent = xmlString.substring(index, endIndex);
      
      
//         // Add random ID to topic tag
//         const randomId = generateRandomId();
//         topicContent = topicContent.replace('<topic', `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">\n<topic id="${randomId}"`);

//         topics.push(topicContent);

//         xmlString = xmlString.substring(0, index) + xmlString.substring(endIndex);
//         index = xmlString.lastIndexOf('<topic');
//     }

//     // Create DITA map XML structure
//     let mapXML = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
// <!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">
// <map id="MRS-06-011" xml:lang="en-us">
//     <title>title</title>
//     <data><sort-as>Alternate Title</sort-as></data>\n`;

//     topics.reverse().forEach((topic, i) => {
//         const title = extractTitle(topic);
//         const fileName = `${title}.dita`;
//         const href =fileName.replace(/\.dita$/, '');

//         mapXML += `    <topicref href="${href}"/>\n`;
        
//         fs.writeFileSync(fileName, topic);
//         console.log(`File ${fileName} created.`);
//     });

//     // If no topics, add reference to the last topic
//     if (topics.length === 0) {
//         mapXML += `    <topicref href="last_topic.dita"/>\n`;
//     }

//     mapXML += `</map>`;

//     // Write the DITA map file
//     fs.writeFileSync('book_map.ditamap', mapXML);
//     console.log(`DITA Map file 'book_map.ditamap' created.`);
// }


// module.exports = extractTopicsAndWriteToFiles;




function extractTitle(topic) {
    const titleStartIndex = topic.indexOf('<title');
    const titleEndIndex = topic.indexOf('</title>', titleStartIndex);
    const titleContent = topic.substring(titleStartIndex, titleEndIndex + '</title>'.length);

    // Extracting the title text
    const titleText = titleContent.replace(/<\/?[^>]+(>|$)/g, '');

    return titleText.trim();
}

function generateRandomId(length = 8) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

function extractTopicsAndWriteToFiles(xmlString) {
    const topics = [];
    let index = xmlString.lastIndexOf('<topic');

    while (index !== -1) {
        const endIndex = xmlString.indexOf('</topic>', index) + '</topic>'.length;
        let topicContent = xmlString.substring(index, endIndex);
      
        // Add random ID to topic tag
        const randomId = generateRandomId();
        topicContent = topicContent.replace('<topic', `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">\n<topic id="${randomId}"`);

        topics.push(topicContent);

        xmlString = xmlString.substring(1, index) + xmlString.substring(endIndex);
        index = xmlString.lastIndexOf('<topic');
    }

    // Create DITA map XML structure
    let mapXML = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">
<map id="MRS-06-011" xml:lang="en-us">
    <title>title</title>
    <data><sort-as>Alternate Title</sort-as></data>\n`;

    if (topics.length === 0) {
        mapXML += `    <topicref href="last_topic.dita"/>\n`;
    }

    topics.reverse().forEach((topic, i) => {
        const title = extractTitle(topic);
        const fileName = `${title}.dita`;
        const href = fileName.replace(/\.dita$/, '');

        mapXML += `    <topicref href="${href}"/>\n`;
        
        fs.writeFileSync(fileName, topic);
        console.log(`File ${fileName} created.`);
    });

    mapXML += `</map>`;

    // Write the DITA map file
    fs.writeFileSync('book_map.ditamap', mapXML);
    console.log(`DITA Map file 'book_map.ditamap' created.`);
}

module.exports = extractTopicsAndWriteToFiles;


