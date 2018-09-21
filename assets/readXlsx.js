var XLSX = require('xlsx');
var fs = require('fs');

var buf = fs.readFileSync("reporteCursos.xlsx");
var workbook = XLSX.read(buf, {type:'buffer'});


var ws = workbook.Sheets[workbook.SheetNames[0]];

for (el in ws) {
  console.log(ws[el].w);
}

