

var request = require("request");
var fs = require("fs");


function readHTML(name, callback){
  var requestOptions = {
    url: name,
    method: 'GET'
  };
  request(requestOptions, function(err, res, data){
    if(err){
      console.log(err);
      return false;
    }
   printHTML(data);

  });
}
  function printHTML(htmlData){
    console.log(htmlData);
  }

readHTML("http://www.example.com", printHTML);