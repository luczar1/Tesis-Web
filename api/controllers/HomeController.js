/**
 * HomeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  show: function (req, res) {
    //Envio la view home usando el layout de admin
    res.view("pages/home", {layout: "layouts/admin"});
  },
  redirect: function (req, res) {
    //Redirecciono a /panel/login
    res.redirect("/panel/home");
  },
};

