module.exports = async function (req, res, next) {
  //Chequea que el usuario sea de tipo admin, sino envia un 404

  let currentUser = await User.findOne({id: req.session.userId});


  if (currentUser.tipoUser == 'admin') {
    return next();
  }

  res.notFound();


};
