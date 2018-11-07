/**
 * Admin.js
 *
 * @description :: A model definition.  Represents a database table/collection/etc.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    /**
     * Apellido.
     */
    apellido: {type: "string"},

    /**
     * Nombre.
     */
    nombre: {type: "string"},

    /**
     * Relacion con clase madre
     */
    /*user: {
      collection: 'user',
      via: 'admin'
    }*/

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

  cargarCursos: async function (filePath) {
    return await sails.helpers.readXls.with({filePath: filePath});
  },
  cargarAlumnos: async function(filePath) {
    await sails.helpers.readXlsxAlumnos.with({filePath: filePath});
  },
  cargarProfesores: async function(filePath) {
    let errores = await sails.helpers.readXlsxProfesores.with({filePath: filePath});
    let retJson = {
      status: "OK",
      cantErrores: errores.length,
      errores: errores
    };

    return retJson;
  }

};

