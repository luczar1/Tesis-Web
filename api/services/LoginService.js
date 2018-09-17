module.exports = {
  checkLogin: function (req,res) {

    if (req.path!="/login" && req.session.userId == null) {
      sails.log(req.path);
        res.redirect("/login");
      }
    return;
  }
};
