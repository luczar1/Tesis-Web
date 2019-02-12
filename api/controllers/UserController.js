/**
 * UserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  login: async function (req, res) {

    //Capturo las variables enviadas via post

    let email = req.param("email");
    let pass = req.param("pass");

    //Chequeo el usuario enviando las variables @email, @pass y la variable de session
    let usrLogged = await User.login(email, pass, req.session);

    if (usrLogged) {
      //Si esta correcto guardo el ID en una variable de session y
      //redirecciono a /panel/home
      res.redirect("/panel/home")
    } else {
      //Si no esta correcto redirecciono a la pantalla de login
      res.redirect("/login")
    }

  },

  logout: function (req, res) {
    //Paremtro la variable de session
    User.logout(req.session);
    res.redirect("/login");
  },
  showLogin: async function (req, res) {
    //Envio la view de login
    res.view("pages/login", {layout: 'layouts/login_layout'});
  },
  showNewUser: function (req, res) {
    res.view("pages/newUser", {layout: "layouts/admin"});
  },
  redirectLogin: function (req, res) {
    res.redirect("/login");
  },
  forbidden: function (req, res) {

    res.forbidden();

  },
  notFound: function (req, res) {

    res.notFound();

  },
  navbar: async function (req, res) {

    let navbar = [
      {
        title: "HOME",
        icon: "fas fa-home",
        link: "/panel/home",
        accesLvl: ['admin'],
      },
      {
        title: "CARGAR ARCHIVOS",
        icon: "fas fa-upload",
        link: "/panel/uploadCourse",
        accesLvl: ['admin'],
      },
      {
        title: "LISTADO DE CURSOS",
        icon: "fas fa-list-ul",
        link: "/panel/listCourses",
        accesLvl: ['admin', 'docente'],
      },
      {
        title: "ERRORES DE CARGA",
        icon: "fas fa-exclamation-triangle",
        link: "/panel/listLogs",
        accesLvl: ['admin'],
      },
      {
        title: "ADMINISTRAR USUARIOS",
        icon: "fas fa-users",
        link: "/panel/newUser",
        accesLvl: ['admin'],
      }
    ];

    let currentUser = await User.findOne({id: req.session.userId});
    let navBarForUser = [];

    for (item of navbar) {
      if (item.accesLvl.includes(currentUser.tipoUser)) {
        navBarForUser.push(item);
      }
    }
    res.json(navBarForUser);

  },
  logInApp: async function (req, res) {
    let email = req.param("email");
    let pass = req.param("pass");

    if (email == null || pass == null) {
      res.json({status: 'ERROR'});
    }

    let user = await User.findOne({email: email});

    if (user != null && user.tipoUser == 'alumno' && await sails.argon2.verify(user.pass, pass)) {
      res.json({status: 'OK', idAlumno: user.alumnoId})
    } else {
      res.json({status: 'ERROR'});
    }
  },
  create: async function (req, res) {
    let email = req.param("email");
    let pass = await sails.argon2.hash(req.param("pass"));
    let tipoUser = req.param("tipoUser");

    await User.findOrCreate({email: email}, {
      email: email,
      pass: pass,
      tipoUser: tipoUser,

    }).exec(async (err, newOrExistingRecord, wasCreated) => {
      sails.log(err);
      if (wasCreated != null && !wasCreated) {
        res.json({status: 'USUARIO YA EXISTENTE', user: newOrExistingRecord});

      } else {
        res.json({status: 'OK', user: newOrExistingRecord});
      }
    });
  },
}
