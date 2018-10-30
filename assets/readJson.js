const http = require('http');
const utf8 = require('utf8');

http.get('http://fjs.ucc.edu.ar/json/curso.php?id=12544', (resp) => {
  let data = '';

  // A chunk of data has been recieved.
  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    let obj = JSON.parse(data);

    console.log(utf8.decode(obj[0].precio));
  });



});
