let globalState = {
    data: [],
  };
  // let globalState1 = {
  //   data: [],
  // };
  
  function getData() {
   
    return globalState.data;
  }

  
  function addData(newData) {
  
    globalState.data.push(newData);
  }
  var globalState1=[]
  function addIDFolder(newIDFolder) {
  
  globalState1.push(newIDFolder);
  
}
function getIdFolder() {
  if (globalState1 === undefined) {
      console.log("globalState1 is undefined");
      return null; // or any other default value you want to return
  }
  console.log(globalState1, "dhah");
  return globalState1;
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




  module.exports = {addIDFolder,getData, addData, resetData,setIsBodyEmpty,getIsBodyEmpty,getIdFolder}