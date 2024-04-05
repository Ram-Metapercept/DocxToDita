const markdownIt = require("markdown-it");
const emoji = require("markdown-it-emoji").full;

const md = new markdownIt()
  .use(emoji /* , options */)
  .use(require("markdown-it-sup"))
  .use(require("markdown-it-sub"))
  .use(require("markdown-it-footnote"))
  .use(require("markdown-it-mark"))
  .use(require("markdown-it-deflist"))
  .use(require("markdown-it-task-lists"))
  .use(require("markdown-it-inline-comments"))
  .use(require("markdown-it-attrs"), {
    leftDelimiter: "{",
    rightDelimiter: "}",
    allowedAttributes: [],
  })
  .use(require("markdown-it-container"), "warning")
  .use(require("markdown-it-container"), "note")
  .use(require("markdown-it-container"), "notice")
  .use(require("markdown-it-container"), "attention")
  .use(require("markdown-it-container"), "danger")
  .use(require("markdown-it-container"), "fastpath")
  .use(require("markdown-it-container"), "important")
  .use(require("markdown-it-container"), "remember")
  .use(require("markdown-it-container"), "restriction")
  .use(require("markdown-it-container"), "tip")
  .use(require("markdown-it-container"), "trouble")
  .use(require("markdown-it-container"), "caution");

const fs = require("fs");
const path = require("path");
const grayMatter = require("gray-matter");

const { HTMLToJSON } = require("html-to-json-parser");
const { JSONToHTML } = require("html-to-json-parser");

const xmlFormat = require("xml-formatter");

const cheerio = require("cheerio");

const moveTitleAboveBody = require("./moveTitleAboveBody.js");
const moveTgroupClosingTagBeforeTable = require("./moveTgroupClosingTagBeforeTable.js");
const createDirectory = require("./createDirectory.js");

const characterToEntity = require("./characterToEntity.js");

const removeUnwantedElements = require("./removeUnwantedElements.js");
const extractHTML = require("./extractHTML.js");
const taskFileMaker = require("./taskFileMaker.js");

const outputDirName = "./output/";

function checkFilesInFolder(folderPath) {
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error("Error reading directory:", err);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(folderPath, file);

      let fileDetails = {
        name: "",
        path: "",
      };

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error("Error getting file stats:", err);
          return;
        }

        fileDetails.name = file;
        fileDetails.path = filePath;
        // Check if it's a directory or if it's a file with .md or .mdx extension
        // skipping .png or other files
        if (
          stats.isDirectory() ||
          (stats.isFile() && (file.endsWith(".md") || file.endsWith(".mdx")))
        ) {
          mainMethod(fileDetails, stats);
        } else {
          console.log("\x1b[33m%s\x1b[0m", `Skipped file "${filePath}"`);
        }
      });
    });
  });
}

async function mainMethod(filePath, stats) {
  if (stats.isDirectory()) {
    // If it's a directory, recursively check its files
    checkFilesInFolder(filePath.path);
  } else if (stats.isFile()) {
    // If it's a file, check if it's ready
    if (isFileReady(filePath.path)) {
      console.log("\x1b[31m%s\x1b[0m", `File "${filePath.path}" is ready.`);

      const fileData = fs.readFileSync(filePath.path, {
        encoding: "utf8",
        flag: "r",
      });

      const { content, data } = grayMatter(fileData);

      const mdToHtml = md.render(content);

      const fullHtml = `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                    ${mdToHtml}
                </body>
                </html>
          `;

      const $ = cheerio.load(fullHtml);

      //! Add <tgroup> and <colspec> tags to tables
      $("table").each((index, element) => {
        const numCols = $(element).find("thead th").length;
        // Add <tgroup> with cols="numCols" attribute
        $(element).prepend(`<tgroup cols="${numCols}">`);
        // Add <colspec> tags based on numCols
        for (let i = 1; i <= numCols; i++) {
          $(element).find("tgroup").append(`<colspec colname="c${i}"/>`);
        }
      });

      const modifiedHtml = $.html();

      const contentWithHmtlAsRootElement = extractHTML(modifiedHtml);
      // console.log(contentWithHmtlAsRootElement);

      let footNoteList = [];
      let result = await HTMLToJSON(contentWithHmtlAsRootElement, false);

      // remove unwanted elements such as \n
      function removeNewlines(array) {
        return array.filter(
          (item) => typeof item !== "string" || item !== "\n"
        );
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
            if (
              ele.type === "section" &&
              ele.attributes?.class === "footnotes"
            ) {
              ele.content = []; // Clear content
              ele.type = ""; // Clear type
              ele.attributes = {}; // Clear attributes
            }
          });
        }
      });

      // check if ul is after title or ul is after title and p
      function isUlAfterTitle(data) {
        const content = removeNewlines(data);

        const taskData = { found: false, positions: [] };

        for (let i = 0; i < content.length; i++) {
          if (
            content[i].type === "ul" &&
            content[i].attributes?.class === "contains-task-list"
          ) {
            taskData.found = true;
            taskData.positions.push(i);
          }

          //! uncomment this code if you want to check ul after title and p

          // if (content[i].type === "title" && content[i + 1].type === "ul") {
          //   taskData.found = true;
          //   taskData.positions.push(i, i + 1);
          // } else if (
          //   content[i].type === "title" &&
          //   content[i + 1].type === "p" &&
          //   content[i + 2].type === "ul"
          // ) {
          //   taskData.found = true;
          //   taskData.positions.push(i, i + 1, i + 2);
          // }
          // else {
          //   taskData.found = false;
          //   taskData.positions = [];
          // }
        }

        return taskData;
      }

      result.content.forEach((e) => {
        if (e.type === "body") {
          const filteredData = e.content.filter(
            (item) => typeof item !== "string" || item.trim() !== ""
          );
          const { found, positions } = isUlAfterTitle(filteredData);

          if (found) {
            for (let i = positions.length - 1; i >= 0; i--) {
              let taskBody = {
                type: "body",
                content: [],
              };

              taskBody.content.unshift(filteredData[positions[i]]);
              filteredData.splice(positions[i], 1);

              const newObj = {
                ...taskBody,
                content: [
                  "\n",
                  ...taskBody.content.flatMap((item) => [item, "\n"]),
                ],
              };

              // console.log(newObj);

              // Inside your loop or wherever you call taskFileMaker
              taskFileMaker(filePath, newObj)
                .then(() => {
                  console.log("taskFileMaker successfully completed.");
                  // Proceed with further operations if needed
                })
                .catch((error) => {
                  console.error(
                    "Error occurred while running taskFileMaker:",
                    error
                  );
                  // Handle error appropriately
                });
            }
          }

          e.content = filteredData;
        }
      });

      // result.content.forEach((e) => {
      //   if (e.type === "body") {
      //     console.log(e);
      //   }
      // });

      JSONToHTML(result).then(async (res) => {
        try {
          // Replace <> and </> tags
          const cleanedUpContent = res.replace(/<\/*>/g, "");
          const cleanedUpJson = await HTMLToJSON(cleanedUpContent, false);
          //logic for wrapping plain text inside paragraph tags
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

          // console.log(modifiedDitaCode);

          let newPath = filePath.path
            .replace(/\\/g, "/")
            .split("/")
            .slice(1)
            .join("/");

          let outputFilePath = "";

          if (newPath.endsWith(".md")) {
            // Replace ".md" with ".dita"
            outputFilePath = `${outputDirName}${newPath.replace(
              /\.md$/,
              ".dita"
            )}`;
          } else if (newPath.endsWith(".mdx")) {
            // Replace ".mdx" with ".dita"
            outputFilePath = `${outputDirName}${newPath.replace(
              /\.mdx$/,
              ".dita"
            )}`;
          }

          const outputDir = path.dirname(outputFilePath);

          createDirectory(outputDirName);
          createDirectory(outputDir);

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
          console.log(error, filePath);
        }
      });
    } else {
      console.log(`File "${filePath.path}" is not ready.`);
    }
  }
}
function isFileReady(filePath) {
  return fs.existsSync(filePath);
}
function codeRestructure(xmlString) {
  let newXmlString = moveTitleAboveBody(xmlString);
  let newNew = moveTgroupClosingTagBeforeTable(newXmlString);

  // let hehe = addSectionTag(newNew);
  // console.log(hehe);

  return newNew;
}

module.exports = checkFilesInFolder;
