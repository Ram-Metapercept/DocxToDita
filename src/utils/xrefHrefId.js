
const fs = require('fs');
const xml2js = require('xml2js');
const path = require('path');
const {addXrefJsonData } = require('./LocalData');

function XrefHrefIds(xmlData) {

    const parser = new xml2js.Parser();
    parser.parseString(xmlData, (err, result) => {
        if (err) {
            console.error('Error parsing XML:', err);
            return;
        }
        const xrefIds = [];
        const regex1 = /<xref\s+href="([^"]+)"/g; // Regex pattern to match xref href attributes
        const content = xmlData.toString(); // Convert XML data to string for regex matching
        let match1;
        while ((match1 = regex1.exec(content)) !== null) {
            const hrefValue = match1[1];
            if (hrefValue && !hrefValue.startsWith('http://') && !hrefValue.startsWith('https://')) {
                xrefIds.push(hrefValue);
            }
        }
        xrefIds.forEach(array => {
            addXrefJsonData(array?.replace(/^#/, ''))
        });
    });
  
}

module.exports = XrefHrefIds;
