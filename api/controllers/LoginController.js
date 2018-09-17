/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  login: async  function (req, res) {
    if (req.path != "/login") {
      res.redirect("/login");
    }
    if (req.path == "/login") {
      if (req.param("email") != null && req.param("pass")!= null) {

      }





      res.view("pages/login");
    }







    sails.log(req.param("email") + "-" + req.param("pass"));




  }
};

