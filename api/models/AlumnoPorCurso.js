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

};

