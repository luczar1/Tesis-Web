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
      let alumnosOk = getAlumno(json[alumno]);

      let busqueda = alumnosUnicos.find(function (element) {
        return element.doc === alumnosOk.doc;
      });

      if (!busqueda) {
        alumnosUnicos.push(alumnosOk);
      } else if (busqueda.codCurso.includes(alumnosOk.codCurso.toString())) {
        busqueda.documentacion = alumnosOk.documentacion || busqueda.documentacion;
        busqueda.pago = alumnosOk.pago || busqueda.pago;
      } else {
        busqueda.codCurso.push(alumnosOk.codCurso.toString());
      }
    }

    // let cursosDB = await Curso.find({
    //   select: ['id', 'codigo']
    // });

    for (let key in alumnosUnicos) {

      // let busquedaCurso = cursosDB.find(function (element) {
      //   return element.codigo == alumnosUnicos[key]['Cod.Presup.'];
      // });

      let cursos = await Curso.find({
        codigoAlternativo: {
          in: alumnosUnicos[key].codCurso
        }
      });

      let arrIdCursos = [];

      for (let key2 in cursos) {
        arrIdCursos.push(cursos[key2].id);
      }

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

  },

  /**
   * Recibe un array a partir del cual crea el objeto alumno.
   * @param data
   */
  getAlumno: function(data) {
    let alumno = {};
    alumno.clave = data['Clave'];
    alumno.apellido = data['Apellido y nombre'].split(",")[0].trim();
    alumno.nombre = data['Apellido y nombre'].split(",")[1].trim();
    switch (data['Documento'].split(" ")[0]) {
      case "DN":
        alumno.tipoDoc = "DNI";
        break;
      case "PA":
        alumno.tipoDoc = "PASAPORTE";
        break;
      case "LE":
        alumno.tipoDoc = "LE";
        break;
      case "LC":
        alumno.tipoDoc = "LC";
        break;
    }
    alumno.doc = data['Documento'].split(" ")[1];
    alumno.codCurso = [];
    alumno.codCurso.push(data['Código'].toString());
    alumno.email = data['E-mail'];
    alumno.tel = data['Teléfono'];
    alumno.documentacion = data['Docu'].toLowerCase() === 'si';
    alumno.pago = data['Pago'].toLowerCase() === 'si';
    return alumno;
  }
};

