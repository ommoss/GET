var agrs = process.argv;

var contributors = {
};
var request = require('request');
var fs = require('fs');

fs.mkdir("./avatar", function(err){
  if(err){
    console.log(err);
  }
});

function getStuff(user, repo){
  requestOptions = {
    url: 'https://api.github.com/repos/' + user +'/' + repo  + '/contributors',
    method: 'GET',
    headers: {
      'User-Agent': 'ommoss'
    }
  };

  function doStuff(element, index, array){
    var obj = {
      id: element.id,
      name: element.login,
      avatar: element.avatar_url
    }
    contributors[index] = obj;
  }

  function createFile(obj){
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
      }).pipe(fs.createWriteStream("avatar/"+ url[index].name));
    }
  }

  request(requestOptions, function(err, res, data){
  if(err){
   console.log(err);
  }
  var parsed = JSON.parse(data);
  parsed.forEach(doStuff);
  createFile(contributors);
  download(contributors, 'avatar/');
  })
}
getStuff(agrs[2], agrs[3]);