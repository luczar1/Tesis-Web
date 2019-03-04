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

    /**
     * Notificaciones que ha recibido.
     */
    notificaciones: {
      collection: 'notificacion',
      via: 'docente',
      through: 'notificacionpordocente'
    }
  },

  /**
   * Obtener las notificaciones de un determinado curso.
   * @param id    id del docente
   * @param curso id del curso
   * @returns {Promise<*>}
   */
  getNotificaciones: async function (id, curso) {
    let docente = await Docente.findOne({id: id}).populate('notificaciones', {
      where: {curso: curso},
      sort: 'createdAt desc'
    });
    if (!docente) {
      return [];
    }
    for(let notificacion of docente.notificaciones) {
      notificacion.emisor = await Notificacion.getNombreEmisor(notificacion.emisor);
    }
    return docente.notificaciones;
  }

};

