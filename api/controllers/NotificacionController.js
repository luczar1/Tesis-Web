/**
 * NotificacionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  create : async function(req, res) {
    let notificacion = req.param("notificacion");

    res.json(notificacion);
  }

};

