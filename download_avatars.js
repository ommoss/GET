var agrs = process.argv;

var contributors = {
};
var request = require('request');
var fs = require('fs');
var db = require('dotenv').config();
if(process.env.DB_USERAGENT === undefined || process.env.DB_USERAGENT === ""){
  console.log("You need to create an .env file with 'DB_USERAGENT= your github username in quotes'")
  return;
}
//creates directory

function getStuff(user, repo, extra){

  if(user === undefined){
    console.log("Error missing user data");
    return;
  }else if(repo === undefined){
    console.log("Error missing repository data");
    return;
  }else if(extra !== undefined){
    console.log("too much data");
    return;
  }
  fs.mkdir("./avatar", function(err){
    if(err){
    }
  });
  requestOptions = {
    url: 'https://api.github.com/repos/' + user +'/' + repo  + '/contributors',
    method: 'GET',
    headers: {
      'User-Agent': process.env.DB_USERAGENT
    }
  };
  function doStuff(element, index, array){
    //Stores data from github into a object
    var obj = {
      id: element.id,
      name: element.login,
      avatar: element.avatar_url
    }
    contributors[index] = obj;
  }

  function createFile(obj){
    //creates a file with the name of the login
    for(index in obj){
      var filePath = "avatar/" + obj[index].name;
      var fileData = obj[index].avatar;
      fs.open(filePath, 'w', function(err, fd){
        if(err){
          console.log(err);
        }
      });
    }
  }
  function download(url, file){
    //puts the picture in the file
    for(index in url){
      var requestOptions = {
        url: url[index].avatar,
        method:  'GET'
      }

      request(requestOptions, function(err, res, data){
        if(err){
          console.log(err);
          throw err;
        }
      }).pipe(fs.createWriteStream(file + url[index].name));
    }
  }

  request(requestOptions, function(err, res, data){
  if(err){
   console.log(err);
  }
  //Run line

  if(data === {"message":"Not Found","documentation_url":"https://developer.github.com/v3"}){
    console.log("User name or repository does not exist");
    return;
  }
  var parsed = JSON.parse(data);
   if(parsed.message === "Not Found"){
    console.log("Owner or repository does not exist");
    return;
  }
  parsed.forEach(doStuff);
  createFile(contributors);
  download(contributors, 'avatar/');
  })
}
getStuff(agrs[2], agrs[3], agrs[4]);