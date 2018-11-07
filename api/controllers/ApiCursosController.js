/**
 * ApiCursosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getCursos: async function (req, res) {

    let cursos = await Curso.find(
      {
        select: ['id', 'nombre', 'img'],
        where: {
          estado: {'!=': 'Terminado'}
        }
      });

    res.json(cursos);

  },
  getCurso: async function (req, res) {


    let curso = await Curso.findOne({id: req.param('id')});

    res.json(curso);

  },

};

