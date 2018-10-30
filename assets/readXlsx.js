var XLSX = require('xlsx');
var fs = require('fs');

var buf = fs.readFileSync("reporteDocentes.xlsx");
var workbook = XLSX.read(buf, {type:'buffer'});


var ws = workbook.Sheets[workbook.SheetNames[0]];
ws["!ref"] = ws["!ref"].replace("A1", "A2");
//console.log(ws["!ref"]);

let json = XLSX.utils.sheet_to_json(ws);
//console.log(json);

<<<<<<< HEAD
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
=======
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
>>>>>>> e45fea6f9e7e827f0b2d78ca1b926820c7e3e23d
}


console.log(profesores);


