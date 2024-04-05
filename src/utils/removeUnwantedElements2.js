const { schema } = require("../schema");
const generateRandomId = require("./generateRandomId");

function removeUnwantedElements2(
  json /*any tag details as a dom json*/,
  parentDetails /*details of immediate parent of any tag*/,
  parentDivClass
) {
  if (typeof json === "object" && json !== null) {
    const type = json.type;
    let currentDivClass;

    switch (type) {
      case "body":
        json.type = "task";
        json.attributes = {};
        json.attributes.id = "task_" + generateRandomId(6);
        json.content.unshift({ type: "title", content: ["this is title"] });
        break;
      case "p":
        json.type = "shortdesc";
        break;

      case "ul":
        let taskbodyObj = {
          type: "steps",
          content: [],
        };

        if (json.attributes?.class === "contains-task-list") {
          taskbodyObj.content = json.content;
          json.content = [];
          json.content = [taskbodyObj];

          json.type = "taskbody";
          json.attributes = {};
        }
        break;

      case "li":
        let cmdObject = {
          type: "cmd",
          content: [],
        };

        json.type = "step";
        json.attributes = {};

        cmdObject.content.push(json.content[1]);
        json.content = [];
        json.content = [cmdObject];

        break;
    }

    if (schema[json.type]) {
      if (Array.isArray(json.content)) {
        json.content = json.content.map((ele) =>
          removeUnwantedElements2(
            ele,
            json.type ? json : parentDetails,
            currentDivClass
          )
        );
      } else if (Array.isArray(json.content)) {
        json.type = "";
        delete json.attributes;
        json.content.map((ele) =>
          removeUnwantedElements2(
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
        removeUnwantedElements2(
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

module.exports = removeUnwantedElements2;
