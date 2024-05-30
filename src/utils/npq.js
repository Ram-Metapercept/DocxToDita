function replaceXmlStructure(xmlString) {
    // Define the regular expression pattern to match the specific structure
    const regex = /<\/ol><\/li>\s*<note>([\s\S]*?)<\/note>\s*<li><ol>/g;
    
    // Use the replace function with a callback to preserve the content inside the <note> tags
    const result = xmlString.replace(regex, (match, noteContent) => {
        return `<note>${noteContent}</note>`;
    });

    return result;
}

module.exports=replaceXmlStructure
