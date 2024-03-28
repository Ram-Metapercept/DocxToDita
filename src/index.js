const path = require("path");
const mammoth = require("mammoth");
const fs = require("fs");
const convertDocxToHtml = require("./converters/docxToHtmlConverter");
const styleMappings = require("./mappings/styleMappings");
const saveHtmlAsDita = require("./savers/htmlToDitaSaver");
const { HTMLToJSON } = require("html-to-json-parser");
const { JSONToHTML } = require("html-to-json-parser");
const { schema } = require("./schema.js");
const xmlFormat = require("xml-formatter");
const { DOMParser, XMLSerializer } = require("xmldom");

const cheerio = require("cheerio");
const e = require("express");
const inputDocxFile = path.join(__dirname, "aaaLatest.docx");
const outputFilePath = "output.dita";

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

    function extractHTML(htmlString) {
      // Find the start and end positions of the <html> tags
      const startIndex = htmlString.indexOf("<html");
      const endIndex = htmlString.lastIndexOf("</html>") + "</html>".length;

      // Extract the content between <html> tags
      const extractedHTML = htmlString.substring(startIndex, endIndex);

      return extractedHTML;
    }

    function validateURL(url) {
      // Regular expression for URL validation
      var regex = /^(https?|ftp)?:\/\/[^\s\/$.?#].[^\s]*$/;

      // Test the URL against the regex
      var isValid = regex.test(url);

      // If the URL didn't match and there's no protocol specified, try matching without it
      if (!isValid && !url?.includes("://")) {
        regex = /^[^\s\/$.?#].[^\s]*$/; // Updated regex without protocol
        isValid = regex.test(url);
      }

      // Return true if the URL is valid, false otherwise
      return isValid;
    }

    function removeUnwantedElements(
      json /*any tag details as a dom json*/,
      parentDetails /*details of immediate parent of any tag*/,
      parentDivClass
    ) {
      if (typeof json === "object" && json !== null) {
        const type = json.type;
        // console.log(JSON.stringify(json, null, 1));

        let currentDivClass;

        // replace or remove switch case based on schema and custom condition as per project requirements
        switch (type) {
          case "link":
            json.type = "";
            delete json.attributes;
            break;
          case "ol":
            if (json.attributes?.id === "breadcrumbs") {
              json.type = "";
              delete json.content;
              delete json.attributes;
            }
            break;

          case "p":
            if (json.content !== undefined) {
              if (parentDetails.type === "p") {
                json.attributes = parentDetails.attributes
                  ? { ...parentDetails.attributes }
                  : {};
                json.attributes.class =
                  (json.attributes.class || "") + ` ${parentDivClass}`;
                json.attributes.class = json.attributes.class.trim();
                parentDetails.type = "";
                delete parentDetails.attributes;
              }
              if (parentDivClass) {
                // fs.writeFileSync("bug.text",""+bugCount++,"utf-8")
                json.attributes = {};
                json.attributes.class =
                  (json.attributes?.class || "") + ` ${parentDivClass}`;
                json.attributes.class = json.attributes.class.trim();
              }
              break;
            }
          case "div":
            currentDivClass = json.attributes?.class
              ? json.attributes?.class
              : parentDivClass;
            if (json.attributes?.id === "footer") {
              json.type = "";
              delete json.content;
              delete json.attributes;
              break;
            } else if (json.attributes?.id === "open-api-spec") {
              json.type = "p";
              break;
            } else if (json.attributes?.class === "greybox") {
              json.type = "p";
              break;
            } else if (json.attributes?.class === "page-metadata") {
              json.type = "p";
              break;
            } else if (schema.noteType.includes(json.attributes?.class)) {
              let mainCOntent = json.content[1].content;
              delete json.content;
              json.content = mainCOntent;

              let attra = json.attributes;
              json.type = "note";

              attra["type"] = json.attributes?.class;
              delete json.attributes["class"];
              break;
            }
            json.type = "";
            delete json.attributes;
            break;
          case "html":
            json.type = "topic";
            break;
          case "alttitle":
            json.type = "titlealts";
            break;
          case "h1":
            if (json.attributes === undefined) {
              json["attributes"] = {
                class: "- topic/title ",
              };
            } else {
              json.attributes["class"] = "- topic/title ";
            }

            json.type = "title";
            let hasKeyattrh1 = "attributes" in json;
            if (!hasKeyattrh1) {
              json["attributes"] = {};
            }
            let attrtitleh1 = json.attributes;
            attrtitleh1["outputclass"] = "h1";
            break;
          case "h2":
            if (json.attributes === undefined) {
              json["attributes"] = {
                class: "- topic/title ",
              };
            } else {
              json.attributes["class"] = "- topic/title ";
            }
            json.type = "title";
            let hasKeyattrh2 = "attributes" in json;
            if (!hasKeyattrh2) {
              json["attributes"] = {};
            }
            let attrtitleh2 = json.attributes;
            attrtitleh2["outputclass"] = "h2";
            break;
          case "h3":
            if (json.attributes === undefined) {
              json["attributes"] = {
                class: "- topic/title ",
              };
            } else {
              json.attributes["class"] = "- topic/title ";
            }
            json.type = "title";
            let hasKeyattrh3 = "attributes" in json;
            if (!hasKeyattrh3) {
              json["attributes"] = {};
            }
            let attrtitleh3 = json.attributes;
            attrtitleh3["outputclass"] = "h3";
            break;

          case "h4":
            if (json.attributes === undefined) {
              json["attributes"] = {
                class: "- topic/title ",
              };
            } else {
              json.attributes["class"] = "- topic/title ";
            }
            json.type = "title";
            let hasKeyattrh4 = "attributes" in json;
            if (!hasKeyattrh4) {
              json["attributes"] = {};
            }
            let attrtitleh4 = json.attributes;
            attrtitleh4["outputclass"] = "h4";
            break;
          case "h5":
            if (json.attributes === undefined) {
              json["attributes"] = {
                class: "- topic/title ",
              };
            } else {
              json.attributes["class"] = "- topic/title ";
            }
            json.type = "title";
            let hasKeyattrh5 = "attributes" in json;
            if (!hasKeyattrh5) {
              json["attributes"] = {};
            }
            let attrtitleh5 = json.attributes;
            attrtitleh5["outputclass"] = "h5";
            break;
          case "h6":
            if (json.attributes === undefined) {
              json["attributes"] = {
                class: "- topic/title ",
              };
            } else {
              json.attributes["class"] = "- topic/title ";
            }
            json.type = "title";
            let hasKeyattrh6 = "attributes" in json;
            if (!hasKeyattrh6) {
              json["attributes"] = {};
            }
            // let attrtitleh6 = json.attributes;
            // attrtitleh6["outputclass"] = "h6";
            break;
          case "a":
            json.type = "xref";
            let attra = json.attributes;
            if (attra["data-linktype"]) attra["scope"] = attra["data-linktype"];
            else if (validateURL(json.attributes.href)) {
              attra["scope"] = "external";
              attra["format"] = "html";
            }

            delete attra["data-linktype"];
            break;
          case "strong":
            json.type = "b";
            break;
          case "colgroup":
            json.type = "tgroup";
            break;
          case "col":
            json.type = "colspec";
            break;
          case "tr":
            json.type = "row";
            break;
          case "td":
            delete json.attributes?.style;
            json.type = "entry";
            break;
          case "th":
            delete json.attributes?.style;
            json.type = "entry";
            break;
          case "img":
            json.type = "image";
            let attr = json.attributes;
            attr["href"] = attr["src"];
            delete attr["src"];
            break;
          case "blockquote":
            json.type = "lq";
            break;

          case "code":
            if (json.attributes) {
              delete json.attributes.class;
            }
            json.type = "codeph";
            break;
          case "strong":
            json.type = "b";
            break;
          case "em":
            json.type = "i";
            break;
          case "mark":
            json.type = "keyword";
            break;
          case "dl":
            const dlEntries = [];
            for (let i = 0; i < json.content.length; i++) {
              const item = json.content[i];

              if (item.type === "dt") {
                const dlEntry = {
                  type: "dlentry",
                  content: [
                    {
                      type: "dt",
                      content: [item.content[0]],
                    },
                  ],
                };
                dlEntries.push(dlEntry);
              } else if (item.type === "dd") {
                const lastEntry = dlEntries[dlEntries.length - 1];
                lastEntry.content.push({
                  type: "dd",
                  content: [item.content[0]],
                });
              }
            }

            const dlJSON = {
              type: "dl",
              content: dlEntries,
            };

            json = dlJSON;
            break;

          default:
            break;
        }
        if (schema[json.type]) {
          if (Array.isArray(json.content)) {
            json.content = json.content.map((ele) =>
              removeUnwantedElements(
                ele,
                json.type ? json : parentDetails,
                currentDivClass
              )
            );
          } else if (Array.isArray(json.content)) {
            json.type = "";
            delete json.attributes;
            json.content.map((ele) =>
              removeUnwantedElements(
                ele,
                json.type ? json : parentDetails,
                currentDivClass
              )
            );
          }
          return json;
        } else if (Array.isArray(json.content)) {
          json.type = "";
          delete json.attributes;
          json.content.map((ele) =>
            removeUnwantedElements(
              ele,
              json.type ? json : parentDetails,
              currentDivClass
            )
          );
        } else if (!json.content) {
          json.type = "";
          delete json.attributes;
          return json;
        }
      }
      return json;
    }
    // function for replacing characters with html entity
    function replaceSpecialCharactersWithEntities(text) {
      // Define an object mapping special characters to their corresponding HTML entities
      const entitiesMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
        $: "&#36;",
        "%": "&#37;",
        "#": "&#35;",
        "@": "&#64;",
        // Add more mappings as needed
      };
      // Use regex to replace each special character with its HTML entity
      return text.replace(/[&<>"'$%@#]/g, (match) => entitiesMap[match]);
    }
    // recursive function for converting special character to html entity in json content
    function characterToEntity(json) {
      if (json.attributes) {
        for (const key in json.attributes) {
          json.attributes[key] = replaceSpecialCharactersWithEntities(
            json.attributes[key]
          );
        }
      }
      if (typeof json === "string") {
        return replaceSpecialCharactersWithEntities(json);
      }
      if (Array.isArray(json.content)) {
        json.content = json.content.map(characterToEntity);
      }
      return json;
    }

    function codeRestructure(xmlString) {
      let newXmlString = moveTitleAboveBody(xmlString);

      let newNew = moveTgroupClosingTagBeforeTable(newXmlString);

      // let newNew = moveTgroupClosingTagBeforeTable(newXmlString);
      // let hehe = addSectionTag(newNew);
      return newNew;
    }

    function addSectionTag(xmlString) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");

      const body = xmlDoc.getElementsByTagName("body")[0];
      const titleElements = body.getElementsByTagName("title");

      // Iterate over each title element
      for (let i = 0; i < titleElements.length; i++) {
        const titleElement = titleElements[i];

        // Create a new section element
        const sectionElement = xmlDoc.createElement("section");

        // Insert the new section element before the title element
        titleElement.parentNode.insertBefore(sectionElement, titleElement);

        // Move the title element inside the section element
        sectionElement.appendChild(titleElement);
      }

      // Convert the modified XML back to a string
      const modifiedXmlString = new XMLSerializer().serializeToString(xmlDoc);

      return modifiedXmlString;
    }

    function moveTitleAboveBody(xmlString) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const titles = xmlDoc.getElementsByTagName("title");
      const titlesAlts = xmlDoc.getElementsByTagName("titlealts");
      // Check if the first title is found within the body
      const topic = xmlDoc.getElementsByTagName("topic")[0];

      const title = titles[0];
      const titlealts = titlesAlts[0];
      if (
        titlesAlts.length > 0 &&
        titlesAlts[0].parentNode.tagName.toLowerCase() === "body"
      ) {
        xmlDoc.documentElement.removeChild(titlealts);
        xmlDoc.documentElement.insertBefore(
          titlealts,
          xmlDoc.documentElement.firstChild
        );
      }
      if (
        titles.length > 0 &&
        titles[0].parentNode.tagName.toLowerCase() === "body"
      ) {
        // topic.insertBefore(title, topic.firstChild);
        // topic.insertBefore(titlealts, topic.firstChild);
        title.removeAttribute("outputclass");
        xmlDoc.documentElement.removeChild(title);

        xmlDoc.documentElement.insertBefore(
          title,
          xmlDoc.documentElement.firstChild
        );
      }

      if (titles.length > 0) {
        topic.setAttribute(
          "id",
          title.childNodes[0]?.data +
            // .replaceAll(/'/g, "")
            // .replaceAll(" ", "_")
            // .toLowerCase()
            // .substring(0, 7) +
            "_" +
            generateRandomId(6)
        );
      } else {
        topic?.setAttribute("id", generateRandomId(6));
      }

      return new XMLSerializer().serializeToString(xmlDoc);
    }

    // function moveTitleAboveBody(xmlString) {
    //   const parser = new DOMParser();
    //   const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    //   const titles = xmlDoc.getElementsByTagName("title");
    //   const titlesAlts = xmlDoc.getElementsByTagName("titlealts");
    //   const body = xmlDoc.getElementsByTagName("body")[0];

    //   if (titles.length > 0 && titles[0].parentNode.tagName.toLowerCase() === "body") {
    //     // If title is found within the body, move it before titlealts if both are children of body
    //     if (titlesAlts.length > 0) {
    //       xmlDoc.insertBefore(titles[0], xmlDoc.documentElement.firstChild);
    //     } else {
    //       // If no titlealts, move title to the beginning of xmlDoc
    //       xmlDoc.insertBefore(titles[0], xmlDoc.documentElement.firstChild);
    //     }
    //   }

    //   // Generate unique ID for topic
    //   const topic = xmlDoc.getElementsByTagName("topic")[0];
    //   const title = titles[0];
    //   if (title.length > 0) {
    //     const titleData = title.childNodes[0]?.data || "";
    //     topic.setAttribute(
    //       "id",
    //       titleData + "_" + generateRandomId(6)
    //     );
    //   } else {
    //     topic?.setAttribute("id", generateRandomId(6));
    //   }

    //   return new XMLSerializer().serializeToString(xmlDoc);
    // }

    // function moveTitleAboveBody(xmlString) {
    //   const parser = new DOMParser();
    //   const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    //   const titles = xmlDoc.getElementsByTagName("title");
    //   const titlesAlts = xmlDoc.getElementsByTagName("titlealts");
    //   const body = xmlDoc.getElementsByTagName("body")[0];

    //   if (titles.length > 0 && titles[0].parentNode.tagName.toLowerCase() === "body") {
    //     // If title is found within the body, move it before titlealts if both are children of body
    //     if (titlesAlts.length > 0) {
    //       body.insertBefore(titles[0], titlesAlts[0]);
    //     } else {
    //       // If no titlealts, move title to the beginning of body
    //       body.insertBefore(titles[0], body.firstChild);
    //     }
    //   }

    //   // Generate unique ID for topic
    //   const topic = xmlDoc.getElementsByTagName("topic")[0];
    //   const title = titles[0];
    //   if (title) {
    //     topic.setAttribute(
    //       "id",
    //       title.childNodes[0]?.data + "_" + generateRandomId(6)
    //     );
    //   } else {
    //     topic?.setAttribute("id", generateRandomId(6));
    //   }

    //   return new XMLSerializer().serializeToString(xmlDoc);
    // }

    function generateRandomId(length) {
      const characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
    }

    function moveTgroupClosingTagBeforeTable(xmlString) {
      let modifiedXml = xmlString;

      // Find the position of the first <table> tag
      let tableIndex = modifiedXml.indexOf("<table>");

      // Loop through all occurrences of <table>
      while (tableIndex !== -1) {
        // Find the position of the closing tag </tgroup> after the current <table>
        const tgroupIndex = modifiedXml.indexOf("</tgroup>", tableIndex);

        // If </tgroup> exists and it's before the next <table> tag
        if (
          tgroupIndex !== -1 &&
          tgroupIndex < modifiedXml.indexOf("<table>", tableIndex + 1)
        ) {
          // Extract the closing tag </tgroup>
          const closingTag = modifiedXml.substring(
            tgroupIndex,
            modifiedXml.indexOf(">", tgroupIndex) + 1
          );

          // Remove the closing tag </tgroup> from the XML string
          modifiedXml =
            modifiedXml.substring(0, tgroupIndex) +
            modifiedXml.substring(modifiedXml.indexOf(">", tgroupIndex) + 1);
          // console.log(modifiedXml.indexOf(">", tgroupIndex) + 1);
          // console.log( modifiedXml.substring( modifiedXml.substring(modifiedXml.indexOf(">", tgroupIndex) + 1)) + 1),"hio")
          // Insert the closing tag </tgroup> before the closing tag </table> after the current <table>
          modifiedXml =
            modifiedXml.substring(0, tableIndex) +
            closingTag +
            modifiedXml.substring(tableIndex);
        }

        // Move to the next occurrence of <table>
        tableIndex = modifiedXml.indexOf("<table>", tableIndex + 1);
      }

      return modifiedXml;
    }

    function generateRandomId(length) {
      var result = "";
      var characters = "abcdefghijklmnopqrstuvwxyz0123456789";
      var charactersLength = characters.length;
      for (var i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * charactersLength)
        );
      }
      return result;
    }

    // function for decoding html entities
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

// Object.keys(styleMappings).forEach((style) => {
//   const ditaTag = styleMappings[style];
//   let regex;
//   if (style.startsWith("p/pPr/pStyle")) {
//     const styleValue = style.substring(
//       style.lastIndexOf("'") + 1,
//       style.length - 2
//     );
//     regex = new RegExp(`<p [^>]*pStyle=['"]${styleValue}['"][^>]*>`, "g");
//   } else if (style.startsWith("rPr")) {
//     const styleValue = style.substring(
//       style.lastIndexOf("/") + 1,
//       style.length - 1
//     );
//     regex = new RegExp(`<rPr[^>]*${styleValue}[^>]*>`, "g");
//   } else if (style.startsWith("hyperlink")) {
//     const attributeName = style.substring(
//       style.indexOf("@") + 1,
//       style.lastIndexOf("'")
//     );
//     regex = new RegExp(`<${attributeName}[^>]*>`, "g");
//   } else {
//     regex = new RegExp(`<${style}[^>]*>`, "g");
//   }
//   ditaHtml = ditaHtml.replace(regex, ditaTag);
// });

// // Wrap content in DITA tags
// ditaHtml = wrapContentInDitaTags(ditaHtml);
