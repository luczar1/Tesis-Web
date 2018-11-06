module.exports = {


  friendlyName: 'Read xlsx alumnos',


  description: 'Read and parse the xlsx to generate and update students',


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

    let alumnosOk = [];
    let alumnosUnicos = [];

    sails.log('Por entrar al for');

    for (let alumno in json) {
      let alumnosOk = {};
      alumnosOk.clave = json[alumno]['Clave'];
      alumnosOk.apellido = json[alumno]['Apellido y nombre'].split(",")[0].trim();
      alumnosOk.nombre = json[alumno]['Apellido y nombre'].split(",")[1].trim();
      switch (json[alumno]['Documento'].split(" ")[0]) {
        case "DN":
          alumnosOk.tipoDoc = "DNI";
          break;
        case "PA":
          alumnosOk.tipoDoc = "PASAPORTE";
          break;
        case "LE":
          alumnosOk.tipoDoc = "LE";
          break;
        case "LC":
          alumnosOk.tipoDoc = "LC";
          break;
      }
      alumnosOk.doc = json[alumno]['Documento'].split(" ")[1];
      alumnosOk.codCurso = [];
      alumnosOk.codCurso.push(json[alumno]['Código'].toString());
      alumnosOk.email = json[alumno]['E-mail'];
      alumnosOk.tel = json[alumno]['Teléfono'];
      alumnosOk.documentacion = json[alumno]['Docu'];
      alumnosOk.pago = json[alumno]['Pago'];




      var busqueda = alumnosUnicos.find(function(element) {
        return element.doc == alumnosOk.doc;
      });

      if(!busqueda) {
        alumnosUnicos.push(alumnosOk);
      }
      else {
        busqueda.codCurso.push(alumnosOk.codCurso.toString());
      }
    }

    for (key in alumnosUnicos) {

      await Alumno.findOrCreate({codigo: alumnosUnicos[key].codigo}, alumnosUnicos[key])
        .exec(async (err, newOrExistingRecord, wasCreated) => {
          // sails.log(wasCreated);
          if (!wasCreated) {

            let found = alumnosUnicos.find((e) => {
              return e.codigo === newOrExistingRecord.codigo
            });


            delete found.id;
            delete found.updatedAt;
            delete found.createdAt;
            delete found.alumnos;

            // sails.log(found);
            await Alumno.update({id: newOrExistingRecord.id}, found);

          }
          console.log(alumnosUnicos[key].apellido);
        });
    }

    // All done.
    return exits.success();

  }


};

