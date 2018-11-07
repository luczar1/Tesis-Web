module.exports = {


  friendlyName: 'Read xlsx profesores',


  description: 'Read and parse the xlsx to generate and update teachers',


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

    var startTime = new Date().getTime();


    let buf = sails.fs.readFileSync(inputs.filePath);
    let workbook = sails.xlsx.read(buf, {type: 'buffer'});
    let ws = workbook.Sheets[workbook.SheetNames[0]];
    ws["!ref"] = ws["!ref"].replace("A1", "A2");

    let json = sails.xlsx.utils.sheet_to_json(ws);

    let profesoresUnicos = [];
    let errores = [];

    for (let key in json) {
      let profesor = {};
      profesor.codCurso = [];
      profesor.clave = json[key]['Clave'];
      profesor.codCurso.push(json[key]['Cod.Presup.'].toString());
      profesor.apellido = json[key]['Apellido y nombre'].split(",")[0].trim();
      profesor.nombre = json[key]['Apellido y nombre'].split(",")[1].trim();
      profesor.caracter = json[key]['Caráter'];
      switch (json[key]['Documento'].split(" ")[0]) {
        case "DN":
          profesor.tipoDoc = "DNI";
          break;
        case "PA":
          profesor.tipoDoc = "PASAPORTE";
          break;
        case "LE":
          profesor.tipoDoc = "LE";
          break;
        case "LC":
          profesor.tipoDoc = "LC";
          break;
      }
      profesor.doc = json[key]['Documento'].split(" ")[1];
      profesor.email = json[key]['E-mail'];
      profesor.tel = json[key]['Teléfono'];

      var busqueda = profesoresUnicos.find(function(element) {
        return element.doc == profesor.doc;
      });

      if(!busqueda) {
        profesoresUnicos.push(profesor);
      }
      else {
        busqueda.codCurso.push(profesor.codCurso.toString());
      }
    }



    for (key in profesoresUnicos) {

      if (profesoresUnicos[key].doc == null) {
        errores.push({nombre: profesoresUnicos[key].nombre, apellido: profesoresUnicos[key].apellido, error: "No tiene definido documento"});
      }
      else if (profesoresUnicos[key].email == null) {
        errores.push({documento: profesoresUnicos[key].doc, nombre: profesoresUnicos[key].nombre, apellido: profesoresUnicos[key].apellido, error: "No tiene definido email"});
      }
      else if (profesoresUnicos[key].tipoDoc == "DNI" && isNaN(profesoresUnicos[key].doc)) {
        errores.push({documento: profesoresUnicos[key].doc, nombre: profesoresUnicos[key].nombre, apellido: profesoresUnicos[key].apellido, error: "Error en el DNI"});
      }
      else {
        let cursos = await Curso.buscarCursos(profesoresUnicos[key].codCurso);
        let arrIdCursos = [];

        for (key2 in cursos) {
          arrIdCursos.push(cursos[key2].id);
        }

        await Docente.findOrCreate({documento: profesoresUnicos[key].doc},
          {
            clave: profesoresUnicos[key].clave,
            apellido: profesoresUnicos[key].apellido,
            nombre: profesoresUnicos[key].nombre,
            tipoDocumento: profesoresUnicos[key].tipoDoc,
            documento: profesoresUnicos[key].doc,
            email: profesoresUnicos[key].email,
            telefono: profesoresUnicos[key].tel,
            cursos: arrIdCursos
          })
          .exec(async (err, newOrExistingRecord, wasCreated) => {
            /*let cursos = await Curso.find({
              codigo: {
                in: profesoresUnicos[key].codCurso
              }
            });*/

            if (!wasCreated) {
              let found = profesoresUnicos.find((e) => {
                return e.doc == newOrExistingRecord.documento
              });

              await Docente.update({id: newOrExistingRecord.id}, {
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
    }

    var endTime = new Date().getTime();

    sails.log(endTime - startTime);

    // All done.

    return exits.success(errores);

  }


};

