const { schema } = require("../schema");
const validateURL = require("./validateURL");
function getColumnIndex(json) {
  let currentIndex = 1;
  let currentEntry = json;
  while (currentEntry.previousSibling) {
    currentEntry = currentEntry.previousSibling;
    if (currentEntry.tagName === "entry" && !currentEntry.attributes?.colspan) {
      currentIndex++;
    }
  }
  return currentIndex;
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

      // case "td":
      //   delete json.attributes?.style;

      //   json.type = "entry";
      //   break;
      // case "td":
      //   delete json.attributes?.style;
      //   if (json.attributes && json.attributes.colspan) {
      //       json.attributes.namest = "c2";
      //       json.attributes.nameend = "c3";
      //   }
      //   delete json.attributes?.colspan;
      //   json.type = "entry";

      //   break;

      case "td":
        delete json.attributes?.style;
        const colspanValue = json.attributes?.colspan;
        const rowspanValue = json.attributes?.rowspan;
        if (colspanValue && colspanValue !== "1") {
          const currentIndex = getColumnIndex(json);
          const nameStart = `c${currentIndex}`;
          const nameEnd = `c${currentIndex + parseInt(colspanValue) - 1}`;
          json.attributes.namest = nameStart;
          json.attributes.nameend = nameEnd;
          delete json.attributes.colspan; // Remove the colspan attribute
        }
        if (rowspanValue && rowspanValue === "1") {
          json.attributes.moreRow = "1";
          delete json.attributes.rowspan; 
      }
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
      // case "img":
      //   json.type = "fig";
      //   json.children = [{
      //       type: "image",
      //       attributes: {
      //           href: json.attributes.src,
      //           alt: json.attributes.alt
      //       }
      //   }];
      //   delete json.attributes.src;
      //   delete json.attributes.alt;
      //   break;
    


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

module.exports = removeUnwantedElements;
