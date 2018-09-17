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
    res.view("pages/login");


    var res = await User.checkUser("pepe@caca.com", "123456");




  }
};

