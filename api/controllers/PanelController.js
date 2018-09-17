/**
 * PanelController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  showPanel: function (req,res) {
    let seccion = req.param("section");
    if (seccion==null) {
      res.redirect("/panel/home");
    }
    res.view("pages/"+seccion, {layout: 'admin'});
  }

};

