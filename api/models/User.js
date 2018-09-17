/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    email: {type: "string"},
    pass: {type: "string"},
    accessLvl: {type: "string"},
  },
  checkUser: async function(user,pass) {
    var user = await User.find({email: user, pass: pass});

    if (user.length>0) {
      return user[0];
    }

    return false;

  }

};

