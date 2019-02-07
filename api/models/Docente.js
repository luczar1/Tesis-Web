/**
 * Docente.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    /**
     * Clave de docente UCC.
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
     * Tipo de documento (LE, DNI, etc).
     */
    tipoDocumento: {type: "string"},

    /**
     * Numero de documento.
     */
    documento: {type: "string"},

    /**
     * Email.
     */
    email: {type: "string"},

    /**
     * Numero de telefono.
     */
    telefono: {type: "string"},

    /**
     * Tipo de usuario
     */
    user: {
      model: 'user',
    },

    /**
     * Token de firebase para envio de notificaciones.
     */
    tokenFirebase: {type: "string"},

    /**
     * Cursos en los que participa.
     */
    cursos: {
      collection: "curso",
      via: "docente",
      through: "docenteporcurso"
    },

    notificaciones: {
      collection: 'notificacion',
      via: 'docente',
      through: 'notificacionpordocente'
    }
  },

};

