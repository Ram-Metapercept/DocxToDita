const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');

// function extractXrefIds() {
//     let filePath=path.join(__dirname,'./temp/Links.dita')
//     const parser = new xml2js.Parser();
//     const xmlData = fs.readFileSync(filePath, 'utf-8');

//     parser.parseString(xmlData, (err, result) => {
//         if (err) {
//             console.error('Error parsing XML:', err);
//             return;
//         }

//         const xrefIds = [];
//         const regex = /<xref\s+href="([^"]+)"/g; // Regex pattern to match xref href attributes
//         const content = xmlData.toString(); // Convert XML data to string for regex matching

//         let match;
//         while ((match = regex.exec(content)) !== null) {
//             xrefIds.push(match[1]); // Add matched href value to xrefIds array
//         }

//         const jsonData = { xref_ids: xrefIds };
//         const jsonOutput = JSON.stringify(jsonData, null, 2);
//         fs.writeFileSync('output.json', jsonOutput);
//     });
// }

function extractXrefIds(filePath) {
    // let filePath=path.join(__dirname,'./temp/Links.dita')
    const parser = new xml2js.Parser();
    const xmlData = fs.readFileSync(filePath, 'utf-8');

    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }

        const xrefIds = [];
        const regex = /<xref\s+href="([^"]+)"/g; // Regex pattern to match xref href attributes
        const content = xmlData.toString(); // Convert XML data to string for regex matching

        let match;
        while ((match = regex.exec(content)) !== null) {
            const hrefValue = match[1];
            if (!hrefValue.startsWith('http://') && !hrefValue.startsWith('https://')) {
                xrefIds.push(hrefValue); // Add matched href value to xrefIds array
            }
        }

        const jsonData = { xref_ids: xrefIds };
        const jsonOutput = JSON.stringify(jsonData, null, 2);
        fs.writeFileSync('output.json', jsonOutput);
    });
}


function readFolder(folderPath) {
    console.log(folderPath,"hi");
    fs.readdir(folderPath, (err, files) => {
        if (err) {
            console.error('Error reading folder:', err);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(folderPath, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error('Error getting file stats:', err);
                    return;
                }
                if (stats.isFile() && path.extname(file) === '.dita') {
                    console.log(`Processing file: ${filePath}`);
                    extractXrefIds(filePath);
                }
            });
        });
    });
}

// Example usage:
module.exports=readFolder

