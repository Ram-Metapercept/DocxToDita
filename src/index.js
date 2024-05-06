
const path = require("path");
const mammoth = require("mammoth");
const fs = require("fs");
const { HTMLToJSON, JSONToHTML } = require("html-to-json-parser");
const cheerio = require("cheerio");
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
const { addData, getData, resetData, setIsBodyEmpty, getIsBodyEmpty } = require("./utils/LocalData.js");
const archiver = require('archiver');
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
    const mammothOptions = {
      // ----------------------------------------------------------------------
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='AltTitle'] => alttitle:fresh",
        "p[style-name='Quote'] => note > p:fresh",
        "p[style-name='Hyperlink'] => a:fresh",
        "p[style-name='Figure'] => fig:fresh"
      ],
    };


    const { value: html } = await mammoth.convertToHtml(
      { path: filePath },
      mammothOptions
    );

    const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        ${html}
    </body>
    </html>
`;
    const $ = cheerio.load(fullHtml);

    $("table").each((index, element) => {
      const numRows = $(element).find("tr").length;
      const numCols = $(element).find(
        "tr:first-child th, tr:first-child td"
      ).length;
      $(element).prepend(`<tgroup cols="${numCols}" />`);
    });
    $('img').each((index, element) => {
      const src = $(element).attr('src');
      // let alt = $(element).attr('alt');
      // let alt1 = alt.replace(/ /g, '_');
      const pathToSaveImage = `${OutputPath}/media/image${index}.png`;
      const pathToSaveImagewithMedia = `media/image${index}.png`;
      const path = converBase64ToImage(src, pathToSaveImage)
      $(element).attr('src', pathToSaveImagewithMedia);
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
        const abc = attachIdToTitle(modifiedDitaCode)
        // ------------------------------
        let topicWise = fileSeparator(abc);

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
            // Body tags not found
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
              .replaceAll(".", "") + ".docx";

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

          logData.parsedFiles.push(outputFilePath);
          addData(fileInfo)
        });
        let fetchData = getData()
        DitaMapMaker(fetchData, topicWise.topics[0].title, OutputPath)
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
      let structureTopic = addTopicTag(movingTgroupTop);
      let addingRandomIdToTopic = addRandomIdToTopics(structureTopic)
      let moveTitle = NestinTopicTag(addingRandomIdToTopic)
      let addIDtoFig = addIdTOFigTag(moveTitle)
      return addIDtoFig
    }
    console.log("DOCX converted to DITA successfully.");
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
    console.error("Error occurred:", error.message);
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
     let topicPathInDita=getLastPathSegment(item.path);
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
        let topicPathInDita=getLastPathSegment(item.path);
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