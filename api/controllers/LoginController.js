/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  login: function (req, res) {
    if (req.path != "/login") {
      res.redirect("/login");
    }
    console.log(req);


    res.view("pages/login");
  }
};

