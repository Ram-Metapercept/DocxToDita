const generateRandomId=require("./generateRandomId")

function generateDITAMap(topics, ditaMapFilename) {
  const randomId = generateRandomId(); 
  let ditaMapContent = `<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">\n<map id="${randomId}" xml:lang="en-us">\n`;

  topics.reverse().forEach((topic, index) => {

    // Generate a random ID
      ditaMapContent += `<topicref  href="./${topic.title}.dita" />\n`;
  });

  ditaMapContent += `</map>`;
  return ditaMapContent;
}

// Function to generate a random ID
// function generateRandomId(length = 8) {
//   const letters = 'abcdefghijklmnopqrstuvwxyz';
//   const digits = '0123456789';
//   let result = '';
  
//   // Start the ID with a random letter
//   result += letters.charAt(Math.floor(Math.random() * letters.length));
  
//   // Append the rest of the ID with a combination of letters and digits
//   for (let i = 1; i < length; i++) {
//       const characters = i % 2 === 0 ? letters : digits;
//       result += characters.charAt(Math.floor(Math.random() * characters.length));
//   }
  
//   return result;
// }


function fileSeparator(xmlString) {

  const topics = [];
  let index = xmlString.lastIndexOf("<topic id=");

  while (index !== -1) {
      const endTopicIndex = xmlString.indexOf("</topic>", index) + "</topic>".length;
      let topicContent = xmlString.substring(index, endTopicIndex);

      topics.push({
          content: topicContent,
          title: extractTitle(topicContent).title,
          level: extractTitle(topicContent).outputclass.split("h")[1],
      });

      xmlString = xmlString.substring(0, index) + xmlString.substring(endTopicIndex);
      index = xmlString.lastIndexOf("<topic id=");
  }

  const lastTopic = topics[topics.length - 1];
  const modifiedTitle = lastTopic.title.replace(/\s/g, '_');

  const ditaMapFilename = `${modifiedTitle}.ditamap`;

  const ditaMapContent = generateDITAMap(topics, ditaMapFilename);

  return { topics, ditaMapFilename, ditaMapContent };
}

function extractTitle(topic) {
  const titleStartIndex = topic.indexOf("<title");
  const titleEndIndex = topic.indexOf("</title>", titleStartIndex);
  const titleContent = topic.substring(
    
      titleStartIndex,
      titleEndIndex + "</title>".length

  );

  // Extracting the title text
  const titleText = titleContent.replace(/<\/?[^>]+(>|$)/g, "");

  // Extracting the outputclass attribute value
  const outputclassMatch = titleContent.match(/outputclass="([^"]+)"/);
  const outputclass = outputclassMatch ? outputclassMatch[1] : "";
 
  return { title: titleText.trim(), outputclass: outputclass };
} 


module.exports = fileSeparator;