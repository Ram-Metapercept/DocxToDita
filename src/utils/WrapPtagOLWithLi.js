// function replaceXmlStructure(xmlString) {

//     const regex = /<\/ol>\s*<p>([\s\S]*?)<\/p>\s*<ol>/g;

//     const result = xmlString.replace(regex, (match, noteContent) => {
//         return `<note>${noteContent}</note>`;
//     });

//     return result;
// }

// module.exports=replaceXmlStructure


// function replaceXmlString(xml) {
//     // Define the regex pattern to match the specific XML structure with generalized content inside the <p> tags
//     const regexPattern = /<\/ol><\/li>\s*<\/ol>\s*<p>[\s\S]*?<\/p>\s*<ol>\s*<li><ol>/g;

//     // Define the replacement string
//    matches=xml.match(regexPattern)
//    for(match of matches){
//     let result = match[0].replace(/<\/?ol>/g, '');
//     let xml=xml.replace(match[0],result)

//    }

//     // Replace the matched pattern with the replacement string
   

//     return xml;
// }

function replaceXmlStringP(xml) {
    // Define the regex pattern to match the specific XML structure with generalized content inside the <p> tags
    const regexPattern = /<\/ol><\/li>\s*<\/ol>\s*<p>[\s\S]*?<\/p>\s*<ol>\s*<li><ol>/g;

    // Find all matches of the pattern in the xml string
    let matches = xml.match(regexPattern);
    
    if (matches) {
        for (let match of matches) {
            // Extract the content inside the <p> tag
            let pContentMatch = match.match(/<p>([\s\S]*?)<\/p>/);
            if (pContentMatch) {
                let pContent = pContentMatch[1];

                // Replace the entire match with the content inside the <p> tag
                xml = xml.replace(match, pContent);
            }
        }
    }

    return xml;
}


function replaceXmlStringNote(xml) {
    // Define the regex pattern to match the specific XML structure with generalized content inside the <p> tags
    const regexPattern = /<\/ol><\/li>\s*<\/ol>\s*<note>[\s\S]*?<\/note>\s*<ol>\s*<li><ol>/g;


    // Find all matches of the pattern in the xml string
    let matches = xml.match(regexPattern);
    
    if (matches) {
        for (let match of matches) {
            // Extract the content inside the <p> tag
            let pContentMatch = match.match(/<note>([\s\S]*?)<\/note>/);
            if (pContentMatch) {
                let pContent = pContentMatch[1];

                // Replace the entire match with the content inside the <p> tag
                xml = xml.replace(match, pContent);
            }
        }
    }

    return xml;
}
function replaceXmlStringPWithSingleOl(xml) {
    // Define the regex pattern to match the specific XML structure with generalized content inside the <p> tags
    const regex = /<\/ol>\s*<p>([\s\S]*?)<\/p>\s*<ol>/g;


    // Find all matches of the pattern in the xml string
    let matches = xml.match(regex);
    
    if (matches) {
        for (let match of matches) {
            // console.log(match);
            // Extract the content inside the <p> tag
            let pContentMatch = match.match(/<p>([\s\S]*?)<\/p>/);

            if (pContentMatch) {
                let pContent = pContentMatch[0];

                // Replace the entire match with the content inside the <p> tag
                xml = xml.replace(match, pContent);
            }
        }
    }

    return xml;
}

function replaceXmlStringNoteWithSingleOl(xml) {
    // Define the regex pattern to match the specific XML structure with generalized content inside the <p> tags
    const regex = /<\/ol>\s*<note>([\s\S]*?)<\/note>\s*<ol>/g;


    // Find all matches of the pattern in the xml string
    let matches = xml.match(regex);
    
    if (matches) {
        for (let match of matches) {
            console.log(match);
            // Extract the content inside the <p> tag
            let pContentMatch = match.match(/<note>([\s\S]*?)<\/note>/);
            if (pContentMatch) {
                console.log(pContentMatch[0]);
                let pContent = pContentMatch[0];

                // Replace the entire match with the content inside the <p> tag
                xml = xml.replace(match, pContent);
            }
        }
    }

    return xml;
}



module.exports={replaceXmlStringP,replaceXmlStringNote,replaceXmlStringPWithSingleOl,replaceXmlStringNoteWithSingleOl}

