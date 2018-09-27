module.exports = {


  friendlyName: 'Read xls',


  description: 'Read and parse the xlsx to generate and update courses',


  inputs: {
    filePath: {
      type: 'string',
      example: 'example',
      description: 'File to parse',
      required: true,
    }
  },


  exits: {

  },


  fn: async function (inputs, exits) {


    let buf = sails.fs.readFileSync(inputs.filePath);
    let workbook = sails.xlsx.read(buf, {type:'buffer'});
    let ws = workbook.Sheets[workbook.SheetNames[0]];
    ws["!ref"] = ws["!ref"].replace("A1", "A2");

    let json = sails.xlsx.utils.sheet_to_json(ws);


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

    for (cursoOk in cursosOk) {

      let cursoAgregado = await Curso.create(cursosOk[cursoOk]).fetch();
      console.log(cursoAgregado);

    }


    // All done.
    return exits.success(cursosOk);

  }


};

