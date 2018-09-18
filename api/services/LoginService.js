module.exports = {
  checkLogin: function (req,res) {

    if (req.path!="/login" && req.session.userId == null) {
        res.redirect("/login");
        return false;
      }
    return true;
  }
};
