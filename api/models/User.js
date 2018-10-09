/**
 * User.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    /**
     * Email.
     */
    email: {type: "string"},

    /**
     * Password.
     */
    pass: {type: "string"},

    /**
     * Access level.
     */
    accessLvl: {type: "string"},

  },

  checkUser: async function(email, pass) {

    //Verifica si el usuario existe y la contraseña ingresada es correcta

    let user = await User.findOne({email: email});

    if (!user) {
      //Si no existe el usuario con ese e-mail, devuelvo false
      return false;
    }

    if (await sails.argon2.verify(user.pass,pass)) {
      //Si la contraseña cifrada ingresada concuerda con la cifrada
      // en base de datos devuelvo los datos del usuario
      return user;
    }

    //Si las contraseñas cifradas no concuerdan, devuelvo false

    return false;

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝

  },

};

