module.exports = function (req, res, next) {

  //Redirecciona a /panel/home si el usuario esta logueado

  if (req.session.userId != null) {
    res.redirect("/panel/home");
  }
  else {
    return next();
  }
};
