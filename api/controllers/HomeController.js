/**
 * HomeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  show: function (req, res) {
    res.view("pages/home", {layout: "layouts/admin"});
  },
  redirect: function (req, res) {
    res.redirect("/panel/home");
  },

};

