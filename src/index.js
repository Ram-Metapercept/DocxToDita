const path = require("path");
const mammoth = require("mammoth");
const fs = require("fs");
const { HTMLToJSON, JSONToHTML } = require("html-to-json-parser");
const xmlFormat = require("xml-formatter");
const cheerio = require("cheerio");
const e = require("express");
var convert = require('xml-js');
// ----------------------------------------------------------
const moveTitleAboveBody = require("./utils/moveTitleAboveBody.js");
const moveTgroupClosingTagBeforeTable = require("./utils/moveTgroupClosingTagBeforeTable.js");
const createDirectory = require("./utils/createDirectory.js");
const characterToEntity = require("./utils/characterToEntity.js");
const removeUnwantedElements = require("./utils/removeUnwantedElements.js");
const extractHTML = require("./utils/extractHTML.js");
const addTopicTag = require("./utils/addTopicTag.js");
const NestinTopicTag = require("./utils/nestingTopicTag.js")

// ------------------------------------------
const inputDocxFile = path.join(__dirname, "./inputs/input1.docx");
const outputFilePath = "./outputs/output.dita";

async function convertDocxToDita() {
  try {
    const mammothOptions = {
      convertImage: mammoth.images.inline((element, inlineOptions) => {
        let a = fs.readFile(element).then((buffer) => {
          const base64Image = buffer.toString("base64");
          return { src: `data:${element.contentType};base64,${base64Image}` };
        });
        return a;
      }),

      // ----------------------------------------------------------------------
      styleMap: [
        "p[style-name='Title'] => h1:fresh",
        "p[style-name='AltTitle'] => alttitle:fresh",
        "p[style-name='Quote'] => note > p:fresh",
        "p[style-name='Hyperlink'] => a:fresh",
      ],
    };
    const { value: html } = await mammoth.convertToHtml(
      { path: inputDocxFile },
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

        // let newPath = filePath.path
        //   .replace(/\\/g, "/")
        //   .split("/")
        //   .slice(1)
        //   .join("/");

        // let outputFilePath = "";

        // if (newPath.endsWith(".md")) {
        //   // Replace ".md" with ".dita"
        //   outputFilePath = `${outputDirName}${newPath.replace(
        //     /\.md$/,
        //     ".dita"
        //   )}`;
        // } else if (newPath.endsWith(".mdx")) {
        //   // Replace ".mdx" with ".dita"
        //   outputFilePath = `${outputDirName}${newPath.replace(
        //     /\.mdx$/,
        //     ".dita"
        //   )}`;
        // }

        // const outputDir = path.dirname(outputFilePath);

        // createDirectory(outputDirName);
        // createDirectory(outputDir);

        fs.writeFileSync(
          outputFilePath,
          xmlFormat(
            `<?xml version="1.0" encoding="UTF-8"?>\n
            <!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
            ` + modifiedDitaCode,
            {
              indentation: "  ",
              filter: (node) => node.type !== "Comment",
              collapseContent: true,
              lineSeparator: "\n",
            }
          ),
          "utf-8"
        );

        console.log(
          "\x1b[35m%s\x1b[0m",
          "Successfully parsed =>",
          outputFilePath
        );
      } catch (error) {
        console.log(error);
      }
    });

    function codeRestructure(xmlString) {
      let newXmlString = moveTitleAboveBody(xmlString);
      let movingTgroupTop = moveTgroupClosingTagBeforeTable(newXmlString);
      let structureTopic = addTopicTag(movingTgroupTop);
      let moveTilte = NestinTopicTag(structureTopic)
      return moveTilte
    }
    function customDecode(htmlString) {
      // Define a regular expression to match specific entities you want to ignore
      const ignoreRegex = /&(amp);/g; // Add more entities to ignore if needed

      // Replace the matched entities with a temporary placeholder
      const ignoredString = htmlString.replace(ignoreRegex, (match, entity) => {
        // Return a temporary placeholder for the ignored entity
        return `IGNORED_${entity}_IGNORED`;
      });

      // Decode the rest of the HTML entities
      const decodedString = he.decode(ignoredString);

      // Replace the temporary placeholders back to their original form
      const finalDecodedString = decodedString.replace(
        /IGNORED_(.*?)_IGNORED/g,
        (match, entity) => {
          // Return the matched entity as is, without decoding
          return `&${entity};`;
        }
      );

      return finalDecodedString;
    }

    // function jsonToCode(json) {
    //   JSONToHTML(json).then(async (res) => {
    //     try {
    //       // Replace <> and </> tags
    //       const cleanedUpContent = res.replace(/<\/*>/g, "");
    //       const cleanedUpJson = await HTMLToJSON(cleanedUpContent, false);
    //       //logic for wrapping plain text inside paragraph tags
    //       if (Array.isArray(cleanedUpJson.content)) {
    //         cleanedUpJson.content.forEach((ele) => {
    //           if (ele.type === "body" && Array.isArray(ele.content)) {
    //             ele.content.forEach((bodyEle, indx) => {
    //               if (
    //                 typeof bodyEle === "string" &&
    //                 bodyEle.trim() !== "\n" &&
    //                 bodyEle.trim() !== "\n\n" &&
    //                 bodyEle.trim() !== ""
    //               ) {
    //                 ele.content[indx] = { type: "p", content: [bodyEle] };
    //               }
    //             });
    //           }
    //         });
    //       }

    //       const modifiedDitaCode = codeRestructure(
    //         await JSONToHTML(characterToEntity(cleanedUpJson))
    //       );

    //       fs.writeFileSync(
    //         `${outputDirName}hello.dita`,
    //         xmlFormat(
    //           `<?xml version="1.0" encoding="UTF-8"?>\n
    //           <!DOCTYPE topic PUBLIC "-//OASIS//DTD DITA Topic//EN" "topic.dtd">
    //           ` + modifiedDitaCode,
    //           {
    //             indentation: "  ",
    //             filter: (node) => node.type !== "Comment",
    //             collapseContent: true,
    //             lineSeparator: "\n",
    //           }
    //         ),
    //         "utf-8"
    //       );
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   });
    // }
    // Function to create directory recursively

    function createDirectory(directory) {
      if (!fs.existsSync(directory)) {
        createDirectory(path.dirname(directory)); // Recursively create parent directories
        fs.mkdirSync(directory); // Create the directory
      }
    }

    // console.log(result)
    // Apply style mappings
    let ditaHtml = html;

    // Save HTML as DITA
    // await saveHtmlAsDita(ditaHtml, outputFilePath);

    console.log("DOCX converted to DITA successfully.");
  } catch (error) {
    console.error("Error converting DOCX to DITA:", error);
  }
}

convertDocxToDita();
