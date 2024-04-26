let globalState = {
    data: [],
  };
  
  function getData() {
   
    return globalState.data;
  }
  
  function addData(newData) {
  
    globalState.data.push(newData);
  }
  
  function resetData() {
    globalState.data = [];
  }
  
  module.exports = { getData, addData, resetData }