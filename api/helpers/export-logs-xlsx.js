module.exports = {


  friendlyName: 'Export logs xlsx',


  description: 'Esta funcion genera un archivo xlsx con los logs',


  inputs: {
  },


  exits: {
  },


  fn: async function (inputs, exits) {

    var currentPath = process.cwd();


    var workbook = sails.xlsx.readFile(currentPath + "/assets/downloads/logFileTemplate.xlsx");

    let logs = await Log.find({
      select: ['id', 'pagina', 'error']
    });

    let ws = sails.xlsx.utils.json_to_sheet(logs);

    ws["!cols"] = [];

    for (let item in logs[0]) {
      sails.log(logs[0][item]);

      ws["!cols"].push({wch: logs[0][item].length})
    }

    workbook.Sheets[workbook.SheetNames[0]] = ws;
    sails.log(ws["!cols"]);

    sails.xlsx.writeFile(workbook, currentPath + "/assets/downloads/ResumenLogs.xlsx");

    return exits.success(currentPath + "/assets/downloads/ResumenLogs.xlsx");

  }


};

