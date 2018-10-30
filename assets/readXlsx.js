var XLSX = require('xlsx');
var fs = require('fs');

var buf = fs.readFileSync("reporteDocentes.xlsx");
var workbook = XLSX.read(buf, {type:'buffer'});


var ws = workbook.Sheets[workbook.SheetNames[0]];
ws["!ref"] = ws["!ref"].replace("A1", "A2");
//console.log(ws["!ref"]);

let json = XLSX.utils.sheet_to_json(ws);
//console.log(json);

let profesores = [];

for (let key in json) {
  let profesor = {};
  profesor.clave = json[key]['Clave'];
  profesor.codCurso = json[key]['Cod.Presup.'];
  profesor.apellido = json[key]['Apellido y nombre'].split(",")[0].trim();
  profesor.nombre = json[key]['Apellido y nombre'].split(",")[1].trim();
  profesor.caracter = json[key]['Caráter'];
  profesor.tipoDoc = json[key]['Documento'].split(" ")[0];
  profesor.doc = json[key]['Documento'].split(" ")[1];
  profesor.email = json[key]['E-mail'];
  profesor.tel = json[key]['Teléfono'];

  profesores.push(profesor);
}


console.log(profesores);


