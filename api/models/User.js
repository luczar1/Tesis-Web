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
     * Tipo de usuario (Alumno, Docente, Admin).
     */
    tipoUser: {type: "string"},

    /**
     * Relacion con admin
     */
    admin: {
      model: 'admin',
      unique: true
    }
  },

  login: async function(email, pass, session) {

    //Verifica si el usuario existe y la contraseña ingresada es correcta

    let user = await User.findOne({email: email});

    if (!user) {
      //Si no existe el usuario con ese e-mail, devuelvo false
      return false;
    }

    if (await sails.argon2.verify(user.pass,pass)) {
      //Si la contraseña cifrada ingresada concuerda con la cifrada
      // en base de datos devuelvo los datos del usuario
      //Si esta correcto guardo el ID en una variable de session y
      //redirecciono a /panel/home
      session.userId = user.id;

      return true;
    }

    //Si las contraseñas cifradas no concuerdan, devuelvo false

    return false;
  },

  getCursos: async function() {
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

    return cursos;

  },

  getCurso: async function(id) {
    const imgPath = "https://www.ucc.edu.ar/portalucc/archivos/File/fjs/fotos/";

    let curso = await Curso.findOne({id: id});
    curso.img = imgPath + curso.img;

    return curso;
  },

  logout: function (session) {
    //Borro el id de la variable de session y redirecciono a login
    session.userId = null;
  }

};

