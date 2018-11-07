/**
 * ApiCursosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getCursos: async function (req, res) {
    let cursos = await User.getCursos();
    res.json(cursos);
  },

  getCurso: async function (req, res) {
    let cursoId = req.param('id');
    let curso = await User.getCurso(cursoId);

    sails.request.get({
      url: 'http://fjs.ucc.edu.ar/json/curso.php?id=' + curso.codigo
    }, function (error, response, body) {
      if (error) {
        sails.log(error);
      }
      else {
        try {
          let jsonResp = JSON.parse(body);
          curso.inscripcionLink = jsonResp[0].link;
          curso.precio = jsonResp[0].precio;
        }
        catch (e) {
          sails.log(e);
        }
      }
      res.json(curso);
    });
  },

};

