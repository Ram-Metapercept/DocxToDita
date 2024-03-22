// src/savers/htmlToDitaSaver.js
const fs = require("fs");

function saveHtmlAsDita(html, outputFilePath) {
 
    fs.writeFileSync(outputFilePath, html, { encoding: "utf8" });
    console.log("Conversion complete. DITA file saved at:", outputFilePath);
}

module.exports = saveHtmlAsDita;
