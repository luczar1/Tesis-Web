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

    let listadoAlumnos = [];

    let cursosDB = await Curso.find({
      select: ['id', 'codigoAlternativo']
    });

    sails.log('Por entrar al for');

    for (let alumno of json) {
      /**
       * Se llama la funcion para pasar del excel a datos mas ordenados
       */
      listadoAlumnos = await sails.helpers.procesarAlumno.with({
        alumnoXls: alumno,
        listadoAlumnos: listadoAlumnos,
        cursosDB: cursosDB,
      });

    }

    // const util = require('util')
    // console.log(util.inspect(listadoAlumnos, {showHidden: false, depth: null}))
    //
    // return;
    let findOrCreateCounter= 0;

    for (let key in listadoAlumnos) {


      await Alumno.findOrCreate({documento: listadoAlumnos[key].doc}, {

        clave: listadoAlumnos[key].clave,
        apellido: listadoAlumnos[key].apellido,
        nombre: listadoAlumnos[key].nombre,
        tipoDocumento: listadoAlumnos[key].tipoDoc,
        documento: listadoAlumnos[key].doc,
        email: listadoAlumnos[key].email,
        telefono: listadoAlumnos[key].tel,
        cursos: listadoAlumnos[key].cursos.map((x) => {
          if (x != null && x.id != null) {
            return x.id;
          }
        })
      })
        .exec(async (err, newOrExistingRecord, wasCreated) => {

          let found = listadoAlumnos.find((e) => {
            return e.doc == newOrExistingRecord.documento
          });


          found.id = newOrExistingRecord.id;

          if (wasCreated != null && !wasCreated) {

            // sails.log(found);
            await Alumno.update({id: newOrExistingRecord.id}, {

              clave: found.clave,
              apellido: found.apellido,
              nombre: found.nombre,
              tipoDocumento: found.tipoDoc,
              documento: found.doc,
              email: found.email,
              telefono: found.tel,
              cursos: listadoAlumnos[key].cursos.map((x) => {
                if (x != null && x.id != null) {
                  return x.id;
                }
              })
            });

          }

          if (findOrCreateCounter >= listadoAlumnos.length - 1) {

            let cursosAlumnosDB = await AlumnoPorCurso.find();
            sails.log('DB: ');
            sails.log(cursosAlumnosDB);
            //console.log(util.inspect(profesoresUnicos, {showHidden: false, depth: null}));

            for (alumno of listadoAlumnos) {
              // sails.log('Alumno: ');
              // sails.log(alumno);
              for (curso of alumno.cursos) {
                let cursoPorAlumno = cursosAlumnosDB.find((element) => {
                  return element.alumno == alumno.id && element.curso == curso.id;
                });
                sails.log('Alumno por curso: ');
                sails.log(cursoPorAlumno);

                await AlumnoPorCurso.update({id: cursoPorAlumno.id}, {
                  documentacion: curso.documentacion,
                  pago: curso.pago
                })


              }
            }
          }
          else {
            findOrCreateCounter++;
          }
        });
    }



    // All done.
    return exits.success();

  },

};

