module.exports = {


  friendlyName: 'Read xls cursos',


  description: 'Read and parse the xlsx to generate and update courses',


  inputs: {
    filePath: {
      type: 'string',
      example: 'example',
      description: 'File to parse',
      required: true,
    }
  },


  exits: {},


  fn: async function (inputs, exits) {


    let buf = sails.fs.readFileSync(inputs.filePath);
    let workbook = sails.xlsx.read(buf, {type: 'buffer'});
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
      cursoOk.vigente = json[curso]['Vigente'];
      cursoOk.estado = json[curso]['Estado'];
      cursoOk.cupoMax = json[curso]['Cupo Max.'];
      cursoOk.cantHoras = json[curso]['Cant.Hs.'];

      cursosOk.push(cursoOk);
    }
    //await Curso.destroy ({});
    //await Curso.createEach (cursosOk);


    for (key in cursosOk) {

      await Curso.findOrCreate({codigo: cursosOk[key].codigo}, cursosOk[key])
        .exec(async (err, newOrExistingRecord, wasCreated) => {
          // sails.log(wasCreated);
          if (!wasCreated) {

            let found = cursosOk.find((e) => {
              return e.codigo === newOrExistingRecord.codigo
            });


            delete found.id;
            delete found.updatedAt;
            delete found.createdAt;
            delete found.alumnos;

            // sails.log(found);
            await Curso.update({id: newOrExistingRecord.id}, found);

          }
        });
    }




    // All done.
    return exits.success(cursosOk);

  }


};

