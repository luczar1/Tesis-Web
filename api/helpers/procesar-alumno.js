module.exports = {


  friendlyName: 'Get alumno',


  description: 'Funcion para que no haya sida',


  inputs: {
    alumnoXls: {
      type: 'ref',
      description: 'busqueda de alumno',
      required: true,
    },
    listadoAlumnos: {
      type: 'ref',
      description:  'listado completo de alumnos por curso',
      required: true,
    },
    cursosDB: {
      type: 'ref',
      description: 'array con IDs de neustra bd y Codigo alternativo del curso',
      required: true,
    }
  },


  exits: {

    success: {
      outputFriendlyName: 'Alumno',
      outputType: 'ref'
    },

  },


  fn: async function (inputs, exits) {

    // Get alumno.
    let alumno = {};
    alumno.cursos = [];

    alumno.clave = inputs.alumnoXls['Clave'];
    alumno.apellido = inputs.alumnoXls['Apellido y nombre'].split(",")[0].trim();
    alumno.nombre = inputs.alumnoXls['Apellido y nombre'].split(",")[1].trim();
    switch (inputs.alumnoXls['Documento'].split(" ")[0]) {
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
    alumno.doc = inputs.alumnoXls['Documento'].split(" ")[1];
    alumno.email = inputs.alumnoXls['E-mail'];
    alumno.tel = inputs.alumnoXls['Teléfono'];

    let curso = {};

    curso.id = inputs.cursosDB.find(function (element) {

      return element.codigoAlternativo == inputs.alumnoXls['Código'].toString();

    }).id;
    curso.documentacion = inputs.alumnoXls['Docu'].toLowerCase() === 'si';
    curso.pago = inputs.alumnoXls['Pago'].toLowerCase() === 'si';

    alumno.cursos.push(curso);

    /**
     * busca si el alumno ya esta cargado
     */
    let busquedaAlumno = inputs.listadoAlumnos.find(function (element) {
      return element.doc === alumno.doc;
    });


    /**
     * Si no esta cargado, lo agrega
     */
    if (!busquedaAlumno) {
      inputs.listadoAlumnos.push(alumno);
    }
    /**
     * Si esta cargado, busca si ese curso ya esta agregado
     */
    else {
      let busquedaCurso = busquedaAlumno.cursos.find(function (element) {
        return element.id == alumno.cursos[0].id;
      });
      /**
       * Si esta agregado, es porque esta inscripto mas de una vez, entonces chequea doc y pago
       */
      if (busquedaCurso){
        busquedaCurso.documentacion = alumno.cursos[0].documentacion || busquedaCurso.documentacion;
        busquedaCurso.pago = alumno.cursos[0].pago || busquedaCurso.pago;
      }
      /**
       * Si no, es porque es otro curso en el que esta inscripto y lo agrega
       */
      else {
        if(alumno.cursos[0] != null) {
          busquedaAlumno.cursos.push(alumno.cursos[0]);
        }
      }
    }



    // Send back the result through the success exit.
    return exits.success(inputs.listadoAlumnos);

  }


};

