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
     * Token de firebase para envio de notificaciones.
     */
    tokenFirebase: {type: "string"},

    /**
     * Cursos en los que se ha inscripto.
     */
    cursos: {
      collection: "curso",
      via: "alumno",
      through: "alumnoporcurso"
    },

    /**
     * Notificaciones que ha recibido.
     */
    notificaciones: {
      collection: 'notificacion',
      via: 'alumno',
      through: 'notificacionporalumno'
    }
  },

  /**
   * Tipo de usuario
   */
  user: {
    model: 'user',
  },

  /**
   * Obtener las notificaciones de un determinado curso.
   * @param id    id del alumno
   * @param curso id del curso
   * @returns {Promise<*>}
   */
  getNotificaciones: async function (id, curso) {
    let alumno = await Alumno.findOne({id: id}).populate('notificaciones', {
      where: {curso: curso}
    });
    if (!alumno) {
      return [];
    }
    for(let notificacion of alumno.notificaciones) {
      notificacion.emisor = await Notificacion.getNombreEmisor(notificacion.emisor);
    }
    return alumno.notificaciones;
  }

};

