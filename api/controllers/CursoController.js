/**
 * CursoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  find: async function (req, res) {
    if (await User.isAdmin(req.session)) {
      res.json(await Curso.find().populate('alumnos').populate('docentes'));
    } else {
      res.json(await Curso.find());
    }
  },
  findOne: async function(req, res) {
    if (await User.isAdmin(req.session)) {
      res.json(await Curso.findOne({id: req.param('id')}).populate('alumnos').populate('docentes'));
    } else {
      res.json(await Curso.findOne({id: req.param('id')}));
    }
  }

};

