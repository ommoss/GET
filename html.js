

var request = require("request");
var fs = require("fs");
// requestOptions = {
//   url: 'http://www.example.com',
//   method: 'GET'

// };

// request(requestOptions, function(err, res, data){
//   if(err){
//     console.log(err);
//     return false;
//   }
//  console.log(data);
//   // var dprime = HTML.parse(data);
//   // console.log()
// });



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
   // console.log(data);
   printHTML(data);

  });
}
  function printHTML(htmlData){
    // var page = htmlData.parse();
    console.log(htmlData);
  }

readHTML("http://www.example.com", printHTML);