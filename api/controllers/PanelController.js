/**
 * PanelController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  showPanel: async function (req,res) {

    const menu = [
      {
        title: "HOME",
        link: "/panel/home",
        icon: "nc-chart-pie-35",
        permissions: ["admin"],
        name: "home",
      },
      {
        title: "User Profile",
        link: "panel/profile",
        icon: "nc-circle-09",
        permissions: ["admin"],
        name: "profile",
      }
      ];


    LoginService.checkLogin(req,res);

    let seccion = req.param("section");
    if (seccion==null) {
      res.redirect("/panel/home");
    }
    let user = await User.find({id: req.session.userId});
    let accessGranted = false;

    _.each(menu, function (item) {
      if (item.name == seccion) {
        if (item.permissions.includes(user[0].accessLvl)) {
          accessGranted = true;
        }
      }
    });

    sails.log(accessGranted);

    if (!accessGranted) {
      res.notFound();
    }
    else {
      res.view("pages/"+seccion, {
        layout: 'layouts/admin',
        user: user[0],
        menu: menu,
        path: req.path,
      });
    }

  }

};

