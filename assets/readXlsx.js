var XLSX = require('xlsx');
var fs = require('fs');

var buf = fs.readFileSync("reporteCursos.xlsx");
var workbook = XLSX.read(buf, {type:'buffer'});


var ws = workbook.Sheets[workbook.SheetNames[0]];
ws["!ref"] = ws["!ref"].replace("A1", "A2");
//console.log(ws["!ref"]);

let json = XLSX.utils.sheet_to_json(ws);
//console.log(json);

for (let curso in json) {
  delete json[curso].Curso;
  delete json[curso].Código;
}

console.log(json);
let propCount = Object.keys(json[0]).length;

if (propCount!=34) {

}
console.log(propCount);


