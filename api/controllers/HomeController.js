/**
 * HomeController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  show:  function (req, res) {
    //Envio la view home usando el layout de admin
    res.view("pages/home", {layout: "layouts/admin"});
  },
  redirect: async function (req, res) {

    await User.findOrCreate({email:'prueba@prueba.com' },{
      email: 'prueba@prueba.com',
      pass: '$argon2d$v=19$m=1024,t=1,p=1$c29tZXNhbHQ$anJPL9+0zRaui5EJ02t89OfL4p5Jv8O2gIOyZEoQO0s',
      tipoUser: 'admin',
      habilitado: true,

    });

    //let sendEmail = await sails.helpers.sendEmail.with({to: 'lucas.zarza@gmail.com', subject: "Holiss", text: 'Alta preuba'});
    //Redirecciono a /panel/login
    res.redirect("/panel/home");
  },
};

