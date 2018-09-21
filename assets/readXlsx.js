var XLSX = require('xlsx');
var fs = require('fs');

var buf = fs.readFileSync("reporteCursos.xlsx");
var workbook = XLSX.read(buf, {type:'buffer'});

console.log(workbook);

