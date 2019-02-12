/**
 * CursoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  find: async function (req, res) {
    //Chequeo si el usuario que realiza la peticion es admin
    if (await User.isAdmin(req.session)) {
      /*
      * Devuelvo todos los cursos y lleno los arrays de cursos y docentes ya que la peticion viene desde
      * un admin.
      * Esta no devuelve los datos de las tablas intermedios de Docentes y ALumnos
      * es decir Documentacion y pago en caso de alumno, caracter en caso de docente
      * */
      res.json(await Curso.find({
        where: { 'vigente': { '!=' : 'Recargado' }},
        sort: 'inicio ASC'
      }).populate('alumnos').populate('docentes').populate('notificaciones', { sort: 'createdAt desc'}));
    }
    else if (await User.isDocente(req.session)) {
      let idDocente = await User.isDocente(req.session);

      sails.log(idDocente);

      let cursosId = await DocentePorCurso.find({ select: ['curso'],
        where: { docente: idDocente } });

      res.json(cursosId);
    }
    else {
      if (req.param('area')) {
        //Busco por id de area, me devuelve datos del area junto con un array de cursos de esa area
        res.json(await Area.findOne({id: req.param('area')}).populate('cursos'));
      }
      else {
        //Devuelvo todos lso cursos, omito recargados
        res.json(await Curso.find({
            vigente: {'!=': 'Recargado'}
          }
        ));
      }
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

