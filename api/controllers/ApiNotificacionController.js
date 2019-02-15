/**
 * ApiNotificacionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

var notificacionCtrl = require('./NotificacionController');

module.exports = {

  /**
   * Obtener las notificaciones de un cierto alumno para un cierto curso.
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  getNotificaciones: async function(req, res) {
    let userId = req.param('user');
    let cursoId = req.param('curso');
    res.json(await Alumno.getNotificaciones(userId, cursoId));
  },

  /**
   * Envía una notificación. Se debe pasar en el body un objeto con la estructura de notificacion
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  enviarNotificacion: async function(req, res) {
    req.params = req.body;
    await notificacionCtrl.create(req, res);
    res.json();
  }
};

