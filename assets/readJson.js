const utf8 = require('utf8');
const request = require('request');

request.get({
  url: 'http://fjs.ucc.edu.ar/json/curso.php?id=11686'
}, function(error, response, body) {
  if (error) {
    console.log(error);
  }
  else {
    let json = JSON.parse(body);
    console.log(json[0].cext_foto);
  }
});
