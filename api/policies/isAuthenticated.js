module.exports = function (req, res, next) {

  //Chequea que el usuario este habilitado, sino regresa al login


  if (req.session.userId == null) {
    res.redirect("/login");
  }
  else {
    return next();
  }

};
