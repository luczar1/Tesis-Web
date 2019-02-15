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

  /**
   * Busca un curso en particular por el id.
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  getCurso: async function (req, res) {
    let cursoId = req.param('id');
    let selectAlumnos = (req.param('alumnos') !== undefined && req.param('alumnos') !== null) ?
      req.param('alumnos') : ['id', 'apellido', 'nombre', 'email', 'tokenFirebase'];
    let selectDocentes = (req.param('docentes') !== undefined && req.param('docentes') !== null) ?
      req.param('docentes') : ['id', 'apellido', 'nombre', 'email', 'tokenFirebase'];
    let curso = await User.getCurso(cursoId, selectDocentes, selectAlumnos);

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
          curso.lugar = (jsonResp[0].lugar != null) ? sails.utf8.decode(jsonResp[0].lugar) : '';
          curso.requi_aprob = (jsonResp[0].requi_aprob != null) ? sails.utf8.decode(jsonResp[0].requi_aprob) : '';
          curso.contenido = (jsonResp[0].contenido != null) ? sails.utf8.decode(jsonResp[0].contenido) : '';
        }
        catch (e) {
          sails.log(e);
        }
      }
      res.json(curso);
    });
  },

  /**
   * Dar de baja un alumno de un curso.
   * Se reutilizó este Controller para no crear un ApiAlumnosPorCursoController.
   * @param req request
   * @param res response
   * @returns {Promise<*>}
   */
  bajaAlumno: async function (req, res) {
    let cursoId = req.body.cursoId,
        alumnoId = req.body.alumnoId;
    res.json(await AlumnoPorCurso.bajaAlumno(cursoId, alumnoId));
  },
};

