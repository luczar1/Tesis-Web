var XLSX = require('xlsx');
var fs = require('fs');

var buf = fs.readFileSync("reporteCursos.xlsx");
var workbook = XLSX.read(buf, {type:'buffer'});


var ws = workbook.Sheets[workbook.SheetNames[0]];
ws["!ref"] = ws["!ref"].replace("A1", "A2");
//console.log(ws["!ref"]);

let json = XLSX.utils.sheet_to_json(ws);
//console.log(json);

let cursosOk = [];

for (let curso in json) {
  let cursoOk = {};
  cursoOk.codigo = json[curso]['Cod.Presup.'];
  cursoOk.nombre = json[curso]['Curso'];
  cursoOk.UA = json[curso]['U.A.'];
  cursoOk.nombreUA = json[curso]['Nomb.U.A.'];
  cursoOk.inicio = json[curso]['Inicio'];
  cursoOk.fin = json[curso]['Fin'];
  cursoOk.categoria = json[curso]['Categoría'];
  cursoOk.estado = json[curso]['Estado'];
  cursoOk.cupoMax = json[curso]['Cupo Max.'];
  cursoOk.cantHoras = json[curso]['Cant.Hs.'];
  cursoOk.cantDias = json[curso]['Cant.Días'];









  cursosOk.push(cursoOk);
}

console.log(json);
let propCount = Object.keys(json[0]).length;

console.log(propCount);
console.log(cursosOk);


