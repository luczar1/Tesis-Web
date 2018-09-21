module.exports = function (req, res, next) {

  //Chequea que el usuario este logueado, si no es asi redirecciona a /login

  if (req.session.userId == null) {
    res.redirect("/login");
  }
  else {
    return next();
  }





};
