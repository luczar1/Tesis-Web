module.exports = async function (req, res, next) {

  //Chequea que el usuario este logueado, si no es asi redirecciona a /loginhabilitado

  let currentUser = await User.findOne({id: req.session.userId});


  if (currentUser.habilitado) {
    return next();
  } else {
    res.redirect("/login");
  }








};
