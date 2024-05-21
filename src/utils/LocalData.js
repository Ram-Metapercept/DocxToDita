let globalState = {
  data: [],
};
let jsonState = {
  data: [],
};

let XrefHrefState = {
  data: [],
};
let ContentState = {
  data: "",
};

function getContentData() {
  return ContentState.data;
}

function addContentData(newData) {
  ContentState.data += newData;
}



let ModifiedContentState = {
  data: "",
};

function getModifiedContentData() {
  return ModifiedContentState.data;
}

function addModifiedContentData(newData) {
  ModifiedContentState.data += newData;
}
function getData() {

  return globalState.data;
}


function addData(newData) {

  globalState.data.push(newData);
}


function addJsonData(newData) {

  jsonState?.data?.push(newData);

}
function getJsonData() {
  return jsonState.data;
}




function addXrefJsonData(newData) {
  XrefHrefState?.data?.push(newData);
}
function getXrefJsonData() {
  return XrefHrefState.data;
}


function resetData() {
  globalState.data = [];
}


// Initialize the variable
let isBodyEmpty = false;

// Function to set the value
const setIsBodyEmpty = (value) => {
  isBodyEmpty = value;
};

// Function to get the value
const getIsBodyEmpty = () => {
  return isBodyEmpty;
};





module.exports = {getModifiedContentData,addModifiedContentData,addContentData,getContentData,addXrefJsonData,getXrefJsonData, addJsonData, getJsonData, getData, addData, resetData, setIsBodyEmpty, getIsBodyEmpty }