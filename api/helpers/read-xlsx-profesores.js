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

    let buf = sails.fs.readFileSync(inputs.filePath);
    let workbook = sails.xlsx.read(buf, {type: 'buffer'});
    let ws = workbook.Sheets[workbook.SheetNames[0]];
    ws["!ref"] = ws["!ref"].replace("A1", "A2");

    let json = sails.xlsx.utils.sheet_to_json(ws);

    let profesores = [];
    let duplicados = 0;
    let errores = [];

    for (let key in json) {
      let profesor = {};
      profesor.clave = json[key]['Clave'];
      profesor.codCurso = json[key]['Cod.Presup.'];
      profesor.apellido = json[key]['Apellido y nombre'].split(",")[0].trim();
      profesor.nombre = json[key]['Apellido y nombre'].split(",")[1].trim();
      profesor.caracter = json[key]['Caráter'];
      profesor.tipoDoc = json[key]['Documento'].split(" ")[0];
      profesor.doc = json[key]['Documento'].split(" ")[1];
      profesor.email = json[key]['E-mail'];
      profesor.tel = json[key]['Teléfono'];

      if(!profesores.find(function(element) {
        return element.doc == profesor.doc;
      })) {
        profesores.push(profesor);
      }
    }



    for (key in profesores) {
      sails.log(profesores[key].tipoDoc);
      if (profesores[key].doc == null) {
        errores.push({nombre: profesores[key].nombre, apellido: profesores[key].apellido, error: "No tiene definido documento"});
      }
      else if (profesores[key].email == null) {
        errores.push({documento: profesores[key].doc, nombre: profesores[key].nombre, apellido: profesores[key].apellido, error: "No tiene definido email"});
      }
      else if (profesores[key].tipoDoc == "DN" && isNaN(profesores[key].doc)) {
        errores.push({documento: profesores[key].doc, nombre: profesores[key].nombre, apellido: profesores[key].apellido, error: "Error en el DNI"});
      }
      else {
        await Docente.findOrCreate({documento: profesores[key].doc},
          {
            clave: profesores[key].clave,
            apellido: profesores[key].apellido,
            nombre: profesores[key].nombre,
            tipoDocumento: profesores[key].tipoDoc,
            documento: profesores[key].doc,
            email: profesores[key].email,
            telefono: profesores[key].tel,
            //cursos: idCurso,
          })
          .exec(async (err, newOrExistingRecord, wasCreated) => {
            //sails.log(err);
            //sails.log(wasCreated);
            /*if (!wasCreated) {

              let found = cursosOk.find((e) => {
                return e.codigo === newOrExistingRecord.codigo
              });


              delete found.id;
              delete found.updatedAt;
              delete found.createdAt;
              delete found.alumnos;

              sails.log(found);
              await Curso.update({id: newOrExistingRecord.id}, found);
              */
          });
      }

    }


    sails.log(errores);
    // All done.
    return exits.success();

  }


};

