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
    let user = await User.find({email: email});

    if (await sails.argon2.verify(user[0].pass,pass)) {
      return user[0];
    }

    return false;

  }

};

