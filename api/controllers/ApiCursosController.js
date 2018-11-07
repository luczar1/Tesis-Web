/**
 * ApiCursosController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  getCursos: async function (req, res) {

    const imgPath = "https://www.ucc.edu.ar/portalucc/archivos/File/fjs/fotos/";

    let cursos = await Curso.find(
      {
        select: ['id', 'nombre', 'img', 'categoria', 'descripcion'],
        where: {
          estado: {'!=': 'Terminado'}
        }
      });

    for (let curso of cursos) {
      curso.img = imgPath + curso.img;
    }

    res.json(cursos);

  },
  getCurso: async function (req, res) {
    const imgPath = "https://www.ucc.edu.ar/portalucc/archivos/File/fjs/fotos/";

    let curso = await Curso.findOne({id: req.param('id')});
    curso.img = imgPath + curso.img;

    sails.request.get({
      url: 'http://fjs.ucc.edu.ar/json/curso.php?id=' + curso.codigo
    }, function (error, response, body) {
      if (error) {
        sails.log(error);
      }
      else {
        let jsonResp = JSON.parse(body);

        try {
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

