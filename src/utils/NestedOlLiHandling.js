function cleanXMLStringP(xml) {
    const regexPattern = /<\/ol>\s*<\/li>\s*<p>[\s\S]*?<\/p>\s*<li>\s*<ol>/g;

    let matches = xml.matchAll(regexPattern);
    if (matches.length == 0) {
        return xml;
    }
    for (let match of matches) {
        let result = match[0].replace(/<\/?ol>/g, '');
        xml = xml.replace(match[0], result);
        xml = xml.replace(
            new RegExp('</li>\\s*' + result + '\\s*<li(?:\\s+id="[^"]*")?(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
            result
        );


        xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result);

        xml = xml.replace(
            new RegExp('</li>\\s*' + result + '\\s*<li(?:\\s+id="[^"]*")?(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
            result
        );


        xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result)

    }

    xml = xml.replace(/<ol>\s*<\/ol>/g, '');

    return xml;
}

function cleanXMLStringPWithOlLi(xml) {
    let olContent = /<\/ol>\s*(?:<p>)(.*?)(?:<\/p>)\s*<ol>/g;
    let matches = xml.matchAll(olContent);
    if (matches.length == 0) {
        return xml;
    }  
    for (let match of matches) {
        let result = match[0].replace(/<\/?ol>/g, '');
        xml = xml.replace(match[0], result);
   
        xml = xml.replace(
            new RegExp('</li>\\s*' + result + '\\s*<li(?:\\s+id="[^"]*")?(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
            result
        );

        let a=new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g')
        console.log(xml.test(a));
        if(xml.test(a)){
            return xml
        }
        xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result);

        xml = xml.replace(
            new RegExp('</li>\\s*' + result + '\\s*<li(?:\\s+id="[^"]*")?(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
            result
        );


        xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result)

    }

    xml = xml.replace(/<ol>\s*<\/ol>/g, '');

    return xml;
}

function cleanXMLStringNote(xml) {
    let olContent = /<\/ol>\s*(?:<note>)(.*?)(?:<\/note>)\s*<ol>/g;

    let matches = xml.matchAll(olContent);

    if (matches.length == 0) {
        return xml;
    }
    for (let match of matches) {

        let result = match[0].replace(/<\/?ol>/g, '');

        xml = xml.replace(match[0], result);
        xml = xml.replace(
            new RegExp('</li>\\s*' + result + '\\s*<li(?:\\s+id="[^"]*")?(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
            result
        );
        xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result);

        // xml = xml.replace(
        //     new RegExp('</li>\\s*' + result + '\\s*<li(?![^>]*\\sid\\b)(?:\\s+[\\w-]+(?:="[^"]*")?)*>(?=\\s*<)', 'g'),
        //     result
        // );

        // xml = xml.replace(new RegExp('</ol>\\s*' + result + '\\s*<ol>', 'g'), result)

    }

    xml = xml.replace(/<ol>\s*<\/ol>/g, '');

    return xml;
}


module.exports = { cleanXMLStringP, cleanXMLStringPWithOlLi, cleanXMLStringNote }