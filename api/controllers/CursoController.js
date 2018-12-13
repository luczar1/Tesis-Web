/**
 * CursoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  find: async function (req, res) {
    if (await User.isAdmin(req.session)) {
      res.json(await Curso.find({
        vigente: { '!=' : 'Recargado' }
      }).populate('alumnos').populate('docentes'));
    } else {
      res.json(await Curso.find());
    }
  },
  findOne: async function(req, res) {

    //Si es admin, devuelvo los datos completos y ademas busco los datos de la tabla intermedia de profesores y alumnos
    if (await User.isAdmin(req.session)) {
      let curso = await Curso.findOne({id: req.param('id')}).populate('alumnos').populate('docentes');

      for (let alumno of curso.alumnos) {
        let alumnoPorCurso = await AlumnoPorCurso.findOne({
          alumno: alumno.id,
          curso: curso.id,
        });
        alumno.documentacion = alumnoPorCurso.documentacion;
        alumno.pago = alumnoPorCurso.pago;
        alumno.mail1 = alumnoPorCurso.mail1;
        alumno.mail2 = alumnoPorCurso.mail2;
      }

      for (let docente of curso.docentes) {
        let docentePorCurso = await DocentePorCurso.findOne({
          docente: docente.id,
          curso: curso.id,
        });
        docente.caracter = docentePorCurso.caracter;
      }
      res.json(curso);
    } else {
      res.json(await Curso.findOne({id: req.param('id')}));
    }
  }

};

