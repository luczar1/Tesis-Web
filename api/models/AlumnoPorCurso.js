/**
 * AlumnoPorCurso.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    /**
     * Alumno.
     */
    alumno: {
      model: "alumno"
    },

    /**
     * Curso.
     */
    curso: {
      model: "curso"
    },

    /**
     * Presento la documentacion?
     * Todo: preguntar qué es para saber si ponerlo acá o en Alumno.js
     */
    documentacion: {type: "boolean"},

    /**
     * Esta pagado el curso?
     */
    pago: {type: "boolean"},

    /**
     * Se envio el mail de recordatorio a los 7 dias?
     */
    mail1: {type: "boolean"},

    /**
     * Se envio el mail de recordatorio a los 15 dias?
     */
    mail2: {type: "boolean"}
  },

  /**
   * Dar de baja un alumno de un curso
   * @param {string} cursoId  id del curso
   * @param {string} alumnoId id del alumno
   * @returns {Promise<*>}
   */
  bajaAlumno: async function(cursoId, alumnoId) {
    return await AlumnoPorCurso.destroy({
      where: {
        and: [
          { curso: cursoId },
          { alumno: alumnoId }
        ]
      }
    });
  },

};

