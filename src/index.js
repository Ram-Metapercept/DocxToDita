
const path = require("path");
const mammoth = require("mammoth")
const fs = require("fs")
const { HTMLToJSON, JSONToHTML } = require("html-to-json-parser");
const cheerio = require("cheerio");
const abc=require("./utils/abc.js")
const addRandomIdToTopics = require("./utils/addRandomGeneratedId.js")
const moveTitleAboveBody = require("./utils/moveTitleAboveBody.js");
const moveTgroupClosingTagBeforeTable = require("./utils/moveTgroupClosingTagBeforeTable.js");
const characterToEntity = require("./utils/characterToEntity.js");
const removeUnwantedElements = require("./utils/removeUnwantedElements.js");
const extractHTML = require("./utils/extractHTML.js");
const addTopicTag = require("./utils/addTopicTag.js");
const NestinTopicTag = require("./utils/nestingTopicTag.js")
const attachIdToTitle = require("./utils/attachedIdToTitle.js")
const { converBase64ToImage } = require('convert-base64-to-image');
const fileSeparator = require("./utils/fileSeperator.js");
const tagsValidator = require("./utils/tagValidator.js");
const dtdConcept = require("./utils/dtdConcept.js");
const dtdReference = require("./utils/dtdReference.js");
const dtdTask = require("./utils/dtdTask.js");
const generateRandomId = require("./utils/generateRandomId.js");
const addIdTOFigTag = require("./utils/addIdtoFigTag.js")
const addRandomIdToTags = require("./utils/addRandomIdToTags.js")
const { addData, getData, resetData, setIsBodyEmpty, getIsBodyEmpty, getJsonData, getXrefJsonData } = require("./utils/LocalData.js");
const archiver = require('archiver');
const removeBoldTags = require("./utils/RemoveBoldTagFromTitle.js");
const replaceOlWIthFn = require("./utils/replaceOlWithFn.js")
const removeXref = require("./utils/removeRowEntry.js")
const extractIds = require("./utils/extractIds.js")
const XrefHrefIds = require("./utils/xrefHrefId.js")
const outputDirName = "./output/";
const PORT = 8000;
const logData = {
  missingTags: {},
  handledTags: {},
  taskTags: {
    task_missingTags: {},
    task_handledTags: {},
  },
  skippedFiles: [],
  parsedFiles: [],
};

async function convertDocxToDita(filePath) {
  const outputId = Math.random().toString(36).substring(7);

  const OutputPath = path.join(outputDirName, outputId);

  try {
    // const mammothOptions = {
    //   // ----------------------------------------------------------------------
    //   styleMap: [
    //     "p[style-name='Title'] => h1:fresh",
    //     "p[style-name='AltTitle'] => alttitle:fresh",
    //     "p[style-name='Quote'] => note > p:fresh",
    //     "p[style-name='Hyperlink'] => a:fresh",
    //     "p[style-name='Figure'] => fig:fresh",
    //     "p[style-name='OrderedList'] => ol > li:fresh",       
    //     "p[style-name='OrderedListitem2'] => ol > ol > li:fresh", 

    //   ],
    // };


    // const { value: html } = await mammoth.convertToHtml(
    //   { path: filePath },
    //   mammothOptions
    // );

    const transformElement = (element) => {
  
      if (element.type === "paragraph" && element.styleId) {
          let type;
          switch (element.styleId) {
              case "NoteStyle":
                  type = "note";
                  break;
              case "CautionStyle":
                  type = "caution";
                  break;
              case "DangerStyle":
                  type = "danger";
                  break;
          }
          // console.log(type);
          if (type) {
            console.log(element.children);
              return {
                  type: "element",
                  tag: "note",
                  children: element.children,
                  attributes: {
                
                      type: type
                  }
              };
          }
      }
      return element;
  };
  
  
    const mammothOptions = {
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='AltTitle'] => h2:fresh",
        "p[style-name='Quote'] => blockquote:fresh",
        "p[style-name='Hyperlink'] => a:fresh",
        "p[style-name='Figure'] => figure:fresh",

        // 'p.NoteStyle => note:fresh',
        // 'p.CautionStyle => note:fresh',
        // 'p.DangerStyle => note:fresh',

        'p.NoteStyle => note:fresh',
        'p.CautionStyle => note:fresh',
        'p.DangerStyle => note:fresh',
        // 'p.OrderedList => ol> li> ol.OrderedList > li.ordered-list-item:fresh',
        // 'p.OrderedListitem2 =>ol.OrderedList > li.ordered-list-item>ol>li> ol.OrderedListitem2 > li.ordered-list-item-2:fresh',

        // 'p.OrderedListitem3 => ol.OrderedList > li.ordered-list-item > ol.OrderedListitem2 > li.ordered-list-item-2 > ol.OrderedListitem3 > li.ordered-list-item-3:fresh',

        // 'p.OrderedListitem4 => ol.OrderedList > li.ordered-list-item > ol.OrderedListitem2 > li.ordered-list-item-2 > ol.OrderedListitem3 > li.ordered-list-item-3 > ol.OrderedListitem4 > li.ordered-list-item-4 :fresh',

        // "p.OrderedList => ol > li:fresh",
        // "p.OrderedListitem2 => ol > li > ol > li:fresh",
        // "p.OrderedListitem3 => ol > li > ol > li > li > ol > li:fresh",
        // "p.OrderedListitem4 => ol > li > ol > li > ol > li > ol > li:fresh"

        "p.OrderedList => li[id^=_Toc] > ol > li:fresh",
        "p.OrderedListitem2 =>  ol > li > ol > li:fresh",
         "p.Orderedlistitem3 =>  ol > li > ol > li > ol > li:fresh",
         "p.OrderListitem4 =>  ol > li > ol > li > ol > li > ol > li:fresh",
         "p.OrderListitem5 =>  ol > li > ol > li > ol > li > ol > li > ol > li:fresh",
         "p.OrderListitem6 =>  ol > li > ol > li > ol > li > ol > li > ol > li > ol > li:fresh",
        //  "p:has(image) => li > img"
        // //  "r[isImage] => div > img",
        // //  "p:has(> img) => li > div",
        //  "p.FigureStyle => fig:fresh"
     
        // 'p.OrderedList => li[id^=_Toc] > ol > li:fresh',
        // 'p.OrderedListitem2 => ol > li > ol > li:fresh',
        // 'p.OrderedListitem3 => ol > li > ol > li > ol > li:fresh',
        // 'p.OrderListitem4 => ol > li > ol > li > ol > li > ol > li:fresh',
        // 'p.OrderListitem5 => ol > li > ol > li > ol > li > ol > li > ol > li:fresh',
        // 'p.OrderListitem6 => ol > li > ol > li > ol > li > ol > li > ol > li > ol > li:fresh',
        
       
        
      
        
        // 'p.OrderedList => ol > li> ol.OrderedList > li.ordered-list-item:fresh',
        // 'p.OrderedListItem2 =>ol > li> ol.OrderedList > ol>li.ordered-list-item >ol>li> ol.OrderedListItem2 > li.ordered-list-item-2:fresh',

        // 'p.OrderedListItem3 => ol >li> ol.OrderedList > li.ordered-list-item > ol.OrderedListItem2 > li.ordered-list-item-2 > ol> li> ol.OrderedListItem3 > li.ordered-list-item-3:fresh',
        // 'p.OrderedListItem4 => ol>li>ol.OrderedList > li.ordered-list-item > ol.OrderedListItem2 > li.ordered-list-item-2 > ol.OrderedListItem3 > li.ordered-list-item-3 > ol.OrderedListItem4 > li.ordered-list-item-4:fresh'
        
    






        // 'p.OrderedList => ol.ordered-list > li.ordered-list-item:fresh',

        // 'p.OrderedListitem2 => ol.ordered-list > li.ordered-list-item> ol.ordered-list-item2 > li.ordered-list-item-2:fresh',

        // 'p.OrderedListitem3 => ol.ordered-list > li.ordered-list-item > ol.ordered-list-item2 > li.ordered-list-item-2 > ol.OrderedListitem3 > li.ordered-list-item-3:fresh',

        // 'p.OrderedListitem4 => ol.ordered-list > li.ordered-list-item > ol.ordered-list-item2 > li.ordered-list-item-2 > ol.ordered-list-item3 > li.ordered-list-item-3 > ol.ordered-list-item4 > li.ordered-list-item-4 :fresh',




        // 'p.OrderedList => ol.ordered-list > li.ordered-list-item:fresh',
        // 'p.OrderedListItem2 => ol.ordered-list > li.ordered-list-item > ol.ordered-list > li.ordered-list-item-2:fresh',
        // 'p.OrderedListItem3 => ol.ordered-list > li.ordered-list-item > ol.ordered-list > li.ordered-list-item-2 > ol.ordered-list > li.ordered-list-item-3:fresh',
        // 'p.OrderedListItem4 => ol.ordered-list > li.ordered-list-item > ol.ordered-list > li.ordered-list-item-2 > ol.ordered-list > li.ordered-list-item-3 > ol.ordered-list > li.ordered-list-item-4:fresh',



      ],

     
    };

    // Convert DOCX to HTML
    const { value: rawHtml } = await mammoth.convertToHtml(
      { path: filePath },
      // { transformDocument: mammoth.transforms.paragraph(transformElement) },
      mammothOptions
    );
    
    fs.writeFile('abc.html',rawHtml, (err) => {
      if (err) {
        console.error('Error writing to file', err);
      } else {
        console.log('File successfully written to abbc.html');
      }
    });

    //  let d=abc(rawHtml)
    const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        ${rawHtml}
    </body>
    </html>
`;

    const $ = cheerio.load(fullHtml);
    $("table").each((index, element) => {
      let maxCols = 0;

      // Iterate through each row to find the maximum number of columns
      $(element).find("tr").each((rowIndex, rowElement) => {
        const colsInRow = $(rowElement).find("th, td").length;
        if (colsInRow > maxCols) {
          maxCols = colsInRow;
        }
      });

      // Prepend the colgroup with the maximum number of columns
      $(element).prepend(`<colgroup cols="${maxCols}" />`);
    });

    $('img').each((index, element) => {
   
      const src = $(element).attr('src');

      // Check if the src is a Base64-encoded image
      const base64Prefix = 'data:image/';
      if (src.startsWith(base64Prefix)) {
        const mimeType = src.substring(base64Prefix.length, src.indexOf(';'));
        const isPng = mimeType === 'png';
        const isJpeg = mimeType === 'jpeg' || mimeType === 'jpg';

        if (isPng || isJpeg) {
          // Determine the correct extension for saving
          const extension = isPng ? 'png' : 'jpg';
          const pathToSaveImage = `${OutputPath}/media/image${index}.${extension}`;
          const pathToSaveImagewithMedia = `media/image${index}.${extension}`;

          // Convert the image and update the src attribute
          const path = converBase64ToImage(src, pathToSaveImage);
          $(element).attr('src', pathToSaveImagewithMedia);
        } else {
          console.log(`Image at index ${index} is not a PNG or JPEG: ${mimeType}`);
        }
      }
    });


    const modifiedHtml = $.html();
    const contentWithHmtlAsRootElement = extractHTML(modifiedHtml);

    let footNoteList = [];
    let result = await HTMLToJSON(contentWithHmtlAsRootElement, false);

    // remove unwanted elements such as \n
    function removeNewlines(array) {
      return array.filter((item) => typeof item !== "string" || item !== "\n");
    }
    // Extract footnotes elements and store them in footNoteList
    result.content.map((e) => {
      if (e.type === "body") {
        e.content.map((ele) => {
          if (ele.type === "section") {
            const hehe = removeNewlines(ele.content);
            footNoteList = removeNewlines(hehe[0].content);
          }
        });
      }
    });

    result = removeUnwantedElements(
      result,
      {} /*parent tag details*/,
      "" /*parent div class*/
    );

    result = characterToEntity(result);

    // Preprocess footNoteList into a Map for efficient lookup

    const footNoteMap = new Map();
    footNoteList.forEach((obj) => {
      footNoteMap.set(obj.attributes.id, obj.content[0].content[0]);
    });

    // Main logic -- FootNote
    result.content.forEach((e) => {
      if (e.type === "body") {
        e.content.forEach((ele) => {
          if (ele.type === "p") {
            ele.content.forEach((g) => {
              if (g.content !== undefined) {
                let footId = g.content[0].attributes?.href.split(";")[1];
                const line = footNoteMap.get(footId);
                if (line) {
                  g.type = "fn";
                  g.content = [line];
                  delete g.attributes;
                }
              }
            });
          }
          if (ele.type === "section" && ele.attributes?.class === "footnotes") {
            ele.content = []; // Clear content
            ele.type = ""; // Clear type
            ele.attributes = {}; // Clear attributes
          }
        });
      }
    });


    JSONToHTML(result).then(async (res) => {
      try {
        // Replace <> and </> tags
        const cleanedUpContent = res.replace(/<\/*>/g, "");

        const cleanedUpJson = await HTMLToJSON(cleanedUpContent, false);

        // Logic for wrapping plain text inside paragraph tags
        if (Array.isArray(cleanedUpJson.content)) {
          cleanedUpJson.content.forEach((ele) => {
            if (ele.type === "body" && Array.isArray(ele.content)) {
              ele.content.forEach((bodyEle, indx) => {
                if (
                  typeof bodyEle === "string" &&
                  bodyEle.trim() !== "\n" &&
                  bodyEle.trim() !== "\n\n" &&
                  bodyEle.trim() !== ""
                ) {
                  ele.content[indx] = { type: "p", content: [bodyEle] };
                }
              });
            }
          });
        }

        const modifiedDitaCode = codeRestructure(
          await JSONToHTML(characterToEntity(cleanedUpJson))
        );
        function capitalizeFirstWord(str) {
          return str.charAt(0).toUpperCase() + str.slice(1);
        }

        const removedIdFromXrefAttachedToTitle = attachIdToTitle(modifiedDitaCode)
        // let getRandomIdAddedXmlData = addRandomIdToTags(removedIdFromXrefAttachedToTitle)
        XrefHrefIds(removedIdFromXrefAttachedToTitle)
        let boldTagdeletion = removeBoldTags(removedIdFromXrefAttachedToTitle)
   
        let topicWise = fileSeparator(boldTagdeletion);

        let newPath = filePath
          .replace(/\\/g, "/")
          .split("/")
          .slice(1)
          .join("/");
        var topicContent = topicWise.topics[0].content;
        var bodyElement = extractBodyElement(topicContent);
        var isBodyEmpty = bodyElement.trim() === '';
        setIsBodyEmpty(isBodyEmpty)
        function extractBodyElement(htmlContent) {
          var start = htmlContent.indexOf('<body>');
          var end = htmlContent.lastIndexOf('</body>');
          if (start === -1 || end === -1) {
            return '';
          }
          var bodyContent = htmlContent.substring(start + 6, end);
          return bodyContent;
        }
        const fileInfo = {}
        fileInfo.nestObj = []
        topicWise.topics.map((tc, index) => {

          let dtdType = "topic";

          // Validate tags
          tc.content = tagsValidator(tc.content);

          // Check if the content is a concept
          let result = dtdConcept(tc.content);

          if (result.boolValue) {
            dtdType = "concept";
            tc.content = result.content;
          } else if (result.boolValue === false) {
            let result2 = dtdReference(tc.content);
            if (result2.boolValue) {
              dtdType = "reference";
              tc.content = result2.content;
            } else if (result2.boolValue === false) {
              let temp = dtdTask(tc.content);
              if (temp.boolValue) {
                dtdType = "task";

                tc.content = temp.content;
              }
            }
          }

          let fileNameOnTitle =
            tc.title
              .replaceAll(" ", "_")
              .replaceAll("?", "")
              .replaceAll(".", "").replace(/[^\w\s]/gi, '') + ".docx";

          let outputFilePath = "";

          let actualPath =
            newPath.split("/").slice(0, -1).join("/") +
            "/" +
            fileNameOnTitle;

          if (actualPath.endsWith(".doc")) {
            // Replace ".doc" with ".dita"
            outputFilePath = `${OutputPath}/${fileNameOnTitle.replace(
              /\.doc$/,
              ".dita"
            )}`;
          } else if (actualPath.endsWith(".docx")) {
            // Replace ".docx" with ".dita"

            outputFilePath = `${OutputPath}/${fileNameOnTitle.replace(
              /\.docx$/,
              ".dita"
            )}`;

          }
          const outputDir = path.dirname(outputFilePath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }


          //-----------------total different thing          
          //   function cleanNestedXref(xmlString) {
          //     // Define a regular expression to match the nested xref inside href attributes
          //     const nestedXrefPattern = /<xref href="\.\/<xref_href="([^"]+)">([^<]+)<\/xref>\.dita#([^"]+)"/g;

          //     // Replace all instances of nested xref in href attributes
          //     let cleanedXmlString = xmlString.replaceAll(nestedXrefPattern, (match, bookmark, text, bookmarkSuffix) => {
          //         return `<xref href="./${text}.dita#${bookmarkSuffix}"`;
          //     });

          //     return cleanedXmlString;
          // }


          //--------------------------------------------------------------------------
          fileInfo.nestObj.push({
            level: tc.level,
            path: outputFilePath,
            child: []
          })
          if (tc.level !== undefined) {
            fs.writeFileSync(
              outputFilePath,
              `<?xml version="1.0" encoding="UTF-8"?>
          <!DOCTYPE ${dtdType} PUBLIC "-//OASIS//DTD DITA ${capitalizeFirstWord(
                dtdType
              )}//EN" "${dtdType}.dtd">
             ${tc.content}`,
              {
                encoding: 'utf-8', // Specify UTF-8 encoding
              }
            );
          } else if (!isBodyEmpty) {
            fs.writeFileSync(
              outputFilePath,
              `<?xml version="1.0" encoding="UTF-8"?>
           <!DOCTYPE ${dtdType} PUBLIC "-//OASIS//DTD DITA ${capitalizeFirstWord(
                dtdType
              )}//EN" "${dtdType}.dtd">
             ${tc.content}`,
              {
                encoding: 'utf-8', // Specify UTF-8 encoding
              }
            );

          }

          // logData.parsedFiles.push(outputFilePath);
          addData(fileInfo)

        });

        let fetchData = getData()
        DitaMapMaker(fetchData, topicWise.topics[0].title, OutputPath)
        fs.readdir(OutputPath, function (err, files) {
          if (err) {
            return console.error('Unable to scan directory:', err);
          }

          const ditaFiles = files.filter(file => path.extname(file) === '.dita');

          ditaFiles.forEach(file => {
            const OutputPath = path.join(outputDirName, outputId, file);
            extractIds(OutputPath);

            // Read the content of each file
            fs.readFile(OutputPath, 'utf8', (err, content) => {
              if (err) {
                return console.error('Error reading file:', err);
              }

              // Set modifiedContent to the content of the file
              let modifiedContent = content;

              let XrefrenceHrefId = getXrefJsonData();
              let JsonDataIDTopicId = getJsonData();

              // Create a dictionary for quick lookup of JSON data by ID
              let aDict = {};
              JsonDataIDTopicId.forEach(item => {
                aDict[item.id] = item;
              });

              // Get matched details from the references and dictionary
              let matchedDetails = XrefrenceHrefId
                .filter(id => aDict.hasOwnProperty(id))
                .map(id => ({
                  id: id,
                  TopicId: aDict[id].TopicId,
                  FileName: aDict[id].FileName
                }));

              // Perform replacements in the content
              matchedDetails.forEach(item => {
                const regex = new RegExp(`<xref href="#${item.id}"`, 'g');
                const replacement = `<xref href="./${item.FileName}#${item.TopicId}/${item.id}"`;
                modifiedContent = modifiedContent.replaceAll(regex, replacement);
              });

              // You can then save the modified content back to the file or another output as needed
              fs.writeFile(OutputPath, modifiedContent, 'utf8', (err) => {
                if (err) {
                  return console.error('Error writing file:', err);
                }
              });
            });
          });
        });

      } catch (error) {
        console.log(error);
      }
    });

    const downloadId = Math.random().toString(36).substring(7);

    const downloadLink = `http://localhost:${PORT}/api/download/${downloadId}`;

    const downloadPath = path.join(__dirname, "downloads", downloadId);
    fs.mkdirSync(downloadPath, { recursive: true });
    const outputZipPath = path.join(downloadPath, "output.zip");
    // Create zip file
    const archive = archiver('zip', {
      zlib: { level: 9 }, // Set compression level
    });

    const output = fs.createWriteStream(outputZipPath);
    archive.pipe(output);
    archive.directory(OutputPath, false);
    archive.finalize();


    function codeRestructure(xmlString) {
      let newXmlString = moveTitleAboveBody(xmlString);
      let movingTgroupTop = moveTgroupClosingTagBeforeTable(newXmlString);
      let removexrefFromEntry = removeXref(movingTgroupTop);
      let structureTopic = addTopicTag(removexrefFromEntry);
      let addingRandomIdToTopic = addRandomIdToTopics(structureTopic);
      let moveTitle = NestinTopicTag(addingRandomIdToTopic);
      let addIDtoFig = addIdTOFigTag(moveTitle);
      let footnoterelatedOlLI = replaceOlWIthFn(addIDtoFig)

      return footnoterelatedOlLI
    }
    console.log("Docx to Dita converted succesfully")
    return downloadLink
  } catch (error) {
    console.error("Error converting DOCX to DITA:", error);
  }
}
module.exports = convertDocxToDita
function DitaMapMaker(fetchData, title, OutputPath) {
  let nestedFiles = {};

  try {

    fetchData[0].nestObj.forEach((ff) => {

      const level = parseInt(ff.level);

      let parent = nestedFiles;

      for (let i = 1; i < level; i++) {
        if (!parent.child || parent.child.length === 0) {
          console.error(
            "Error occurred: Parent has no children.",
            parent
          );
          throw new Error("Parent has no children.");
        }
        parent = parent.child[parent.child.length - 1];
      }
      if (!parent.child) parent.child = [];
      parent.child.push(ff);
    });

  } catch (error) {
    console.log(error);
  }

  function createXMLStructure(data) {
    let a = getIsBodyEmpty()
    function getLastPathSegment(path) {
      const parts = path.split(/[\\/]/);
      return parts[parts.length - 1];
    }
    let xmlStructure = "";

    data.child?.forEach((item, index) => {

      if (item.level !== undefined) {

        let topicPathInDita = getLastPathSegment(item.path);

        xmlStructure += `<topicref href="${topicPathInDita}" `;
        if (
          item.child &&
          Array.isArray(item.child) &&
          item.child.length > 0
        ) {
          xmlStructure +=
            ">\n" +
            createXMLStructure({ child: item.child }) +
            "</topicref>\n";
        } else {
          xmlStructure += "/>\n";
        }
      } else if (!a) {
        let topicPathInDita = getLastPathSegment(item.path);
        xmlStructure += `<topicref href="${topicPathInDita}" `;

        if (
          item.child &&
          Array.isArray(item.child) &&
          item.child.length > 0
        ) {
          xmlStructure +=
            ">\n" +
            createXMLStructure({ child: item.child }) +
            "</topicref>\n";
        } else {
          xmlStructure += "/>\n";
        }
      }
    }

    );

    return xmlStructure;
  }

  let mapId = generateRandomId();
  const xmlString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE map PUBLIC "-//OASIS//DTD DITA Map//EN" "map.dtd">
 <map id="${mapId}" xml:lang="en-us">\n    <title>${title}</title>\n ${createXMLStructure(nestedFiles)}</map>`;

  fs.writeFileSync(`${OutputPath}/${title.replace(/ /g, "_")}.ditamap`, xmlString);
  console.log("XML structure created successfully!");

  resetData()

}