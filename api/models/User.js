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
  checkUser: async function(email, pass) {
    let user = await User.find({email: email, pass: pass});

    if (user.length>0) {
      return user[0];
    }

    return false;

  }

};

