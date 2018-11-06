/**
 * NuevoCursoController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
  show: function (req, res) {
    //Envio la view uploadCurso usando el layout de admin
    res.view("pages/uploadCurso", {layout: "layouts/admin"});
  },
  uploadXls: function (req, res) {
    //El archivo viene con nombre cursosXlsx
    req.file('cursosXlsx').upload(async function (err, uploadedFiles) {
      if (err) {
        //Hago log en caso de error
        sails.log(err);
      }

      if (uploadedFiles.length === 0 ) {
        //Si no hay archivos subidos, devuelvo bad request
        //res.badRequest();
      }
      else {
        //Si esta correcto, ejecuto el helper para parsear y subir a la base de datos
        await sails.helpers.readXls.with({filePath: uploadedFiles[0].fd});

        //Devuelvo ok
        res.json({status: 'OK'})
      }


    });
    req.file('profesXlsx').upload(async function (err, uploadedFiles) {
      if (err) {
        //Hago logen caso de error
        sails.log(err);
      }

      if (uploadedFiles.length === 0 ) {
        //Si no hay archivos subidos, devuelvo bad request
        //res.badRequest();
      }
      else {
        //Si esta correcto, ejecuto el helper para parsear y subir a la base de datos
        let errores = await sails.helpers.readXlsxProfesores.with({filePath: uploadedFiles[0].fd});
        let retJson = {
          status: "OK",
          cantErrores: errores.length,
          errores: errores
        };

        //Devuelvo los datos de retorno
        res.json(retJson)
      }


    });
  },

};

