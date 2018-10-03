/**
 * ListCursosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  show: function (req, res) {

    res.view('pages/listCurso', {layout: "layouts/admin"});

  },
};

