
const mammoth = require("mammoth");

function convertDocxToHtml(inputFilePath,options){
    return mammoth.convertToHtml({ path: inputFilePath });
}

module.exports = convertDocxToHtml;
