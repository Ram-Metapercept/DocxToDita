const fs = require('fs');
const xml2js = require('xml2js');
const { addJsonData, addContentData } = require('./LocalData');

function extractXrefIds(filePath) {

    const parser = new xml2js.Parser();
    const xmlData = fs.readFileSync(filePath, 'utf-8');

    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }
        const content = xmlData.toString(); // Convert XML data to string for regex matching
        addContentData(content)
        let regex = /<(?!topic|concept)[^>]*\bid="([^"]+)"/g;

        let matches;
        let data = []; // Array to store extracted data

        while ((matches = regex?.exec(content)) !== null) {

            let id = matches[1];
  
            let topicMatch = matches?.input?.match(/<(concept|topic)\s+id="([^"]+)"/);
        
            let topicId = topicMatch ? topicMatch[2] : null;
            let titleMatch = matches?.input?.match(/<title[^>]*>(.*?)<\/title>/);

             let FileName = titleMatch ? titleMatch[1]?.replace(/[&;]/g, "").replace(/\s/g, "_").replace(/-/g, "")+".dita" : null;
            data.push({ id, TopicId: topicId, FileName: FileName});
        }

        data.forEach(array => {
            addJsonData(array)
        });

    });
  
}

module.exports = extractXrefIds;
