/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  login: async function (req, res) {

    LoginService.checkLogin(req, res);

    let email = req.param("email");
    let pass = req.param("pass");
    if (email != null && pass != null) {
      let usr = await User.checkUser(email, pass);

      if (usr) {
        req.session.userId = usr.id;
        res.redirect("/panel/home")
      } else {
        res.view("pages/login");
      }
    }
    else {
      res.view("pages/login");
    }
  },
  logout: function(req,res) {
    req.session.userId = null;
    res.redirect("/login");
  },
  redirect: function(req, res) {
    LoginService.checkLogin(req,res);

    if (!req.path.includes("/panel")) {
      res.redirect("/panel/home");
    }
  }
};

