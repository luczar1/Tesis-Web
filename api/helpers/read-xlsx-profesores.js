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
    const util = require('util');

    let startTime = new Date().getTime();


    let buf = sails.fs.readFileSync(inputs.filePath);
    let workbook = sails.xlsx.read(buf, {type: 'buffer'});
    let ws = workbook.Sheets[workbook.SheetNames[0]];
    ws["!ref"] = ws["!ref"].replace("A1", "A2");

    let json = sails.xlsx.utils.sheet_to_json(ws);

    let profesoresUnicos = [];
    let errores = [];

    // traigo a memoria todos los cursos su id y su codigo
    let cursosDB = await Curso.find({
      select: ['id', 'codigo']
    });


    for (let key in json) {
      let profesor = {};
      profesor.cursos = [];
      profesor.clave = json[key]['Clave'];

      let busquedaCurso = cursosDB.find(function (element) {
        return element.codigo == json[key]['Cod.Presup.'];
      });

      if (busquedaCurso) {
        profesor.cursos.push({
          idCurso: busquedaCurso.id,
          caracter: json[key]['Caráter'],
        });
      }

      profesor.apellido = json[key]['Apellido y nombre'].split(",")[0].trim();
      profesor.nombre = json[key]['Apellido y nombre'].split(",")[1].trim();
      //profesor.caracter = json[key]['Caráter'];
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

      let busqueda = profesoresUnicos.find(function (element) {
        return element.doc == profesor.doc;
      });

      if (!busqueda) {
        profesoresUnicos.push(profesor);
      }
      else {
        busqueda.cursos.push(profesor.cursos[0]);
      }
    }

    //console.log(util.inspect(profesoresUnicos, {showHidden: false, depth: null}));


    for (key in profesoresUnicos) {

      if (profesoresUnicos[key].doc == null) {
        errores.push({
          nombre: profesoresUnicos[key].nombre,
          apellido: profesoresUnicos[key].apellido,
          error: "No tiene definido documento"
        });
      }
      else if (profesoresUnicos[key].email == null) {
        errores.push({
          documento: profesoresUnicos[key].doc,
          nombre: profesoresUnicos[key].nombre,
          apellido: profesoresUnicos[key].apellido,
          error: "No tiene definido email"
        });
      }
      else if (profesoresUnicos[key].tipoDoc == "DNI" && isNaN(profesoresUnicos[key].doc)) {
        errores.push({
          documento: profesoresUnicos[key].doc,
          nombre: profesoresUnicos[key].nombre,
          apellido: profesoresUnicos[key].apellido,
          error: "Error en el DNI"
        });
      }
      else {

        await Docente.findOrCreate({documento: profesoresUnicos[key].doc},
          {
            clave: profesoresUnicos[key].clave,
            apellido: profesoresUnicos[key].apellido,
            nombre: profesoresUnicos[key].nombre,
            tipoDocumento: profesoresUnicos[key].tipoDoc,
            documento: profesoresUnicos[key].doc,
            email: profesoresUnicos[key].email,
            telefono: profesoresUnicos[key].tel,
            cursos: profesoresUnicos[key].cursos.map((x) => {
              if (x != null && x.idCurso != null) {
                return x.idCurso;
              }
            })
          })
          .exec(async (err, newOrExistingRecord, wasCreated) => {
            /*let cursos = await Curso.find({
              codigo: {
                in: profesoresUnicos[key].codCurso
              }
            });*/
            console.log(err);
            let found = profesoresUnicos.find((e) => {
              return e.doc == newOrExistingRecord.documento
            });


            found.id = newOrExistingRecord.id;

            //sails.log(found);

            if (!wasCreated && wasCreated != null) {
              /*let found = profesoresUnicos.find((e) => {
                return e.doc == newOrExistingRecord.documento
              });*/

              await Docente.update({id: newOrExistingRecord.id}, {
                clave: found.clave,
                apellido: found.apellido,
                nombre: found.nombre,
                tipoDocumento: found.tipoDoc,
                documento: found.doc,
                email: found.email,
                telefono: found.tel,
                cursos: found.cursos.map((x) => {
                  if (x != undefined) {
                    return x.idCurso;
                  }
                })
              });

            }
          });
      }
    }

    let cursosProfesoresDB = await DocentePorCurso.find({});

    //console.log(util.inspect(profesoresUnicos, {showHidden: false, depth: null}));

    for (profe of profesoresUnicos) {
      for (curso of profe.cursos) {
        let CursoPorProfe = cursosProfesoresDB.find((element) => {
          return element.docente == profe.id && element.curso == curso.id;
        });

        DocentePorCurso.update({id: CursoPorProfe.id}, {caracter: curso.caracter})


      }
    }


    let endTime = new Date().getTime();

    sails.log("ALTO TIME");
    sails.log(endTime - startTime);

    // All done.

    for (key in errores){
      await Logs.create({
        pagina: 'Carga de docentes',
        error: 'Profesor ' + errores[key].nombre + ' ' + errores[key].apellido + ' ' + errores[key].error
      });

    }

    return exits.success(errores);

  }
};

