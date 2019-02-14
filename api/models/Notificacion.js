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
     * Usuario que envía la notificación.
     */
    emisor: {
      model: 'user'
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

  /**
   * Obtener el apellido y nombre de la persona que envió la notificación.
   * @param emisorId
   * @returns {Promise<*>}
   */
  getNombreEmisor: async function(emisorId) {
    let user = await User.findOne({id: emisorId});
    if (user) {
      if (user.docenteId !== '' && user.docenteId !== null) {
        return await Docente.findOne({
          select: ['apellido', 'nombre'],
          where: {id: user.docenteId}});
      } else if (user.alumnoId !== '' && user.alumnoId !== null) {
        return await Alumno.findOne({
          select: ['apellido', 'nombre'],
          where: {id: user.alumnoId}});
      }
    }
    return {
      apellido: 'FJS',
      nombre: 'Administración'
    }
  }

};

