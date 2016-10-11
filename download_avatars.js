var agrs = process.argv;

var contributors = {};

var request = require('request');

var fs = require('fs');

var db = require('dotenv').config();

if(process.env.DB_USERAGENT === undefined || process.env.DB_USERAGENT === ""){
  console.log("You need to create an .env file with 'DB_USERAGENT= your github username in quotes'")
  return;
}
//creates directory

getStuff(agrs[2], agrs[3], agrs[4]);
function getStuff(user, repo, extra){
  //checks to see if enough or extra data
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
      console.log("using existing directory");
    }
  });

  requestOptions = {
    url: 'https://api.github.com/repos/' + user +'/' + repo  + '/contributors',
    method: 'GET',
    headers: {
      'User-Agent': process.env.DB_USERAGENT
    }
  };
  request(requestOptions, function(err, res, data){
    if(err){
      console.log(err);
    }
    //Run line
    var parsed = JSON.parse(data);
    if(parsed.message === "Not Found"){
      console.log("Owner or repository does not exist");
      return;
    };
    parsed.forEach(storeData);
    createContributorFiles(contributors);
    downloadPictures(contributors, 'avatar/');
  });

  function storeData(element, index, array){
    //Stores data from github into a object and add it to contributors
    var obj = {
      id: element.id,
      name: element.login,
      avatar: element.avatar_url
    }
    contributors[index] = obj;
  };

  function createContributorFiles(obj){
    //creates contributor files with the name of the login
    for(index in obj){
      var filePath = "avatar/" + obj[index].name;
      var fileData = obj[index].avatar;
      fs.open(filePath, 'w', function(err, fd){
        if(err){
          console.log(err);
        }
      });
    }
  };

  function downloadPictures(url, file){
    //puts the contributors avatars in their files
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
  };

}
