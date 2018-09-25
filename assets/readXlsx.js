var XLSX = require('xlsx');
var fs = require('fs');

var buf = fs.readFileSync("reporteCursos.xlsx");
var workbook = XLSX.read(buf, {type:'buffer'});


var ws = workbook.Sheets[workbook.SheetNames[0]];
ws["!ref"] = ws["!ref"].replace("A1", "A2");
//console.log(ws["!ref"]);
console.log(XLSX.utils.sheet_to_json(ws));
