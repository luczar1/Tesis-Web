/**
 * Curso.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    /**
     * Codigo de curso (lo usan los alumnos)
     */
    codigoAlternativo: {type: 'string'},
    /**
     * Codigo de presupuesto del curso (usado en la web)
     */
    codigo: {type: "number"},

    /**
     * Nombre.
     */
    nombre: {type: "string"},

    /**
     * URL imagen del curso (Para el listado).
     */
    img: {type: "string"},

    /**
     * Descripcion del curso (Para descripcion o en caso de que se caiga el servidor).
     */
    descripcion: {type: "string"},

    /**
     * Codigo de la Unidad Academica.
     */
    UA: {type: "string"},

    /**
     * Nombre de la Unidad Academica
     */
    nombreUA: {type: "string"},

    /**
     * Fecha de inicio del curso.
     */
    inicio: {type: "string"},

    /**
     * Fecha de finalizacion del curso.
     */
    fin: {type: "string"},

    /**
     * Categoria del curso.
     * Docentes ucc/graduados ucc/publico gral/etc..
     */
    categoria: {type: "string"},

    /**
     * Estado de vigencia.
     * Ej: vigente, cancelado, recargado, etc..
     */
    vigente: {type: "string"},

    /**
     * Estado general.
     * Ej: iniciado, terminado
     */
    estado: {type: "string"},

    /**
     * Cupo maximo de inscriptos.
     */
    cupoMax: {type: "number"},

    /**
     * Cantidad de horas de duracion.
     */
    cantHoras: {type: "number"},

    /**
     * Alumnos inscriptos.
     */
    alumnos: {
      collection: "alumno",
      via: "curso",
      through: "alumnoporcurso"
    },

    /**
     * Docentes que participan.
     */
    docentes: {
      collection: "docente",
      via: "curso",
      through: "docenteporcurso"
    },

    /**
     * Areas a las que pertenecen
     */
    areas: {
      collection: 'area',
      via: 'cursos'
    }
  },


  buscarCursos: async function(codigosCurso) {
    let cursos = await Curso.find({
      codigo: {
        in: codigosCurso
      }
    });
    return cursos;
  },
  consultarJson: function (codigo) {


    sails.request.get({
      url: 'http://fjs.ucc.edu.ar/json/curso.php?id=' + codigo
    }, function (error, response, body) {
      if (error) {
        console.log(error);
      }
      else {
        try {
          let json = JSON.parse(body);
          sails.log(json[0]);
          return json[0];
        }
        catch (e) {
          sails.log.error(e);
        }

      }
    });
  },

};

