/**
 * Notificacion.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    /**
     * Titulo.
     */
    titulo: {type: 'string'},

    /**
     * Mensaje de la notificacion.
     */
    mensaje: {type: 'string'},

    /**
     * Archivo adjunto.
     */
    archivo: {type: 'string'},

    /**
     * Curso desde el cual se envió la notificación.
     */
    curso: {
      model: 'curso'
    },

    /**
     * Alumnos.
     */
    alumnos:{
      collection: 'alumno',
      via: 'notificacion',
      through: 'notificacionporalumno',
    },

    /**
     * Docentes.
     */
    docentes: {
      collection: 'docente',
      via: 'notificacion',
      through: 'notificacionpordocente'
    }


    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

