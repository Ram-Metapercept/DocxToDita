// src/mappings/styleMappings.js
const styleMappings = {
    "document": "<topics><ditamap>",
    "body": "<topicbody><taskbody><conbody><refbody>",
    "p/pPr/pStyle[@w:val='Title']": "<title>",
    "p/pPr/pStyle[@w:val='Heading1']": "<topic level=\"1\"><title>",
    "p/pPr/pStyle[@w:val='Heading2']": "<topic level=\"2\"><title>",
    "p/pPr/pStyle[@w:val='Heading3']": "<topic level=\"3\"><title>",
    "p/pPr/pStyle[@w:val='Heading4']": "<topic level=\"4\"><title>",
    "p": "<p>",
    "p/pPr/pStyle[@w:val='Paragraph']": "<p>",
    "p/pPr/pStyle[@w:val='NoSpacing']": "<p>",
    "p/pPr/pStyle[@w:val='Quote']": "<note>",
    "p/pPr/pStyle[@w:val='UList']": "<ul><li></li></ul>",
    "p/pPr/pStyle[@w:val='OrderedList']": "<ol><li></li></ol>",
    "t": "<table>",
    "tbl": "<tgroup>",
    "gridCol": "<colspec>",
    "tr": "<row>",
    "tc": "<entry>",
    "rPr/w:u": "<u>",
    "rPr/w:i": "<i>",
    "rPr/w:rStyle[@w:val='Strong']": "<b>",
    "hyperlink/@w:anchor": "<xref href=\"@w:anchor\">",
    "drawing": "<fig><img></img></fig>",
    "wp:inline": "<img></img>",
    "pic:pic": "<image>",
    "bookmarkStart/@w:name": "<xref href=\"@w:name\">",
    "bookmarkEnd": ""
};

module.exports = styleMappings;
