/**
 * LoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  login: async function (req, res) {
    if (req.path.contains("/panel/")) {

    }
    if (req.path != "/login") {
      res.redirect("/login");
    }
    if (req.path == "/login") {
      let email = req.param("email");
      let pass = req.param("pass");
      if (email != null && pass != null) {
        let usr = await User.checkUser(email, pass);

        sails.log(usr);

        if (usr) {
          res.view("pages/home")
        } else {
          res.view("pages/login");
        }

      } else {
        res.view("pages/login");
      }
    }
    else if (req.path.contains("/panel/")) {

    }


    // sails.log(req.param("email") + "-" + req.param("pass"));


  }
};

