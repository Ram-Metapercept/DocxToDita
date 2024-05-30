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

let isBodyEmpty = false;

const setIsBodyEmpty = (value) => {
  isBodyEmpty = value;
};

const getIsBodyEmpty = () => {
  return isBodyEmpty;
};

let inputFileName = "";

function setInputFileName(fileName) {
  inputFileName = fileName;
}

function getInputFileName() {
  return inputFileName;
}

function resetInputFileName() {
  inputFileName = "";
}

module.exports = {setInputFileName,getInputFileName,resetInputFileName,getModifiedContentData,addModifiedContentData,addContentData,getContentData,addXrefJsonData,getXrefJsonData, addJsonData, getJsonData, getData, addData, resetData, setIsBodyEmpty, getIsBodyEmpty }