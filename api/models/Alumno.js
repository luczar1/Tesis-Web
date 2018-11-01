/**
 * Alumno.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    /**
     * Clave de alumno UCC.
     */
    clave: {type: "number"},

    /**
     * Apellido.
     */
    apellido: {type: "string"},

    /**
     * Nombre.
     */
    nombre: {type: "string"},

    /**
     * Numero de documento.
     */
    documento: {type: "number"},

    /**
     * Email.
     */
    email: {type: "string"},

    /**
     * Numero de telefono.
     */
    telefono: {type: "number"},

    /**
     * Cursos en los que se ha inscripto.
     */
    cursos: {
      collection: "curso",
      via: "alumno",
      through: "alumnoporcurso"
    }
  },

};
