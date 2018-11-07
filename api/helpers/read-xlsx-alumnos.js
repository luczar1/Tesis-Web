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

    // let alumnosOk = [];
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


      var busqueda = alumnosUnicos.find(function (element) {
        return element.doc == alumnosOk.doc;
      });

      if (!busqueda) {
        alumnosUnicos.push(alumnosOk);
      }
      else {
        busqueda.codCurso.push(alumnosOk.codCurso.toString());
      }
    }

    sails.log(alumnosUnicos);

    for (let key in alumnosUnicos) {

      let cursos = await Curso.find({
        codigoAlternativo: {
          in: alumnosUnicos[key].codCurso
        }
      });

      let arrIdCursos = [];

      for (let key2 in cursos) {
        arrIdCursos.push(cursos[key2].id);
      }
      //sails.log(arrIdCursos);
      //sails.log(alumnosUnicos[key].doc);
      await Alumno.findOrCreate({documento: alumnosUnicos[key].doc}, {

        clave: alumnosUnicos[key].clave,
        apellido: alumnosUnicos[key].apellido,
        nombre: alumnosUnicos[key].nombre,
        tipoDocumento: alumnosUnicos[key].tipoDoc,
        documento: alumnosUnicos[key].doc,
        email: alumnosUnicos[key].email,
        telefono: alumnosUnicos[key].tel,
        cursos: arrIdCursos,
        documentacion: alumnosUnicos[key].documentacion,
        pago: alumnosUnicos[key].pago,

      })
        .exec(async (err, newOrExistingRecord, wasCreated) => {
           sails.log(err);
          if (wasCreated != null && !wasCreated) {

            let found = alumnosUnicos.find((e) => {
              return e.codigo === newOrExistingRecord.codigo
            });


            delete found.id;
            delete found.updatedAt;
            delete found.createdAt;
            delete found.alumnos;

            // sails.log(found);
            await Alumno.update({id: newOrExistingRecord.id}, {

                clave: found.clave,
                apellido: found.apellido,
                nombre: found.nombre,
                tipoDocumento: found.tipoDoc,
                documento: found.doc,
                email: found.email,
                telefono: found.tel,
                cursos: arrIdCursos
              });

          }
        });
    }

    // All done.
    return exits.success();

  }


};

