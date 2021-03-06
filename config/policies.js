/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions, unless overridden.       *
  * (`true` allows public access)                                            *
  *                                                                          *
  ***************************************************************************/
  HomeController: {
    'show': ['isAuthenticated', 'isEnabled']
  },
  UserController: {
    'showLogin': ['redirHomeIfAuth'],
    'navbar': ['isAuthenticated','isEnabled'],
  },
  NuevoCursoController: {
    'show': ['isAuthenticated', 'isAdmin', 'isEnabled'],
    //'uploadXls': ['isAuthenticated', 'isAdmin'],
  },

  //Policies para api blueprints

  'log/*': ['isAuthenticated','isAdmin', 'isEnabled'],


  // '*': true,

};
