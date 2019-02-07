/**
 * NotificacionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  create : async function(req, res) {
    let titulo = req.param("titulo");
    let mensaje = req.param("mensaje");

    let alumnos = req.param('alumnos');
    let docentes = req.param('docentes');




    for (let alumno of alumnos) {
      if (process.env.NODE_ENV == 'production') {

      } else {
        if (alumno.sendNotifApp) {

          let notifBody = {};

          notifBody.to = alumno.tokenFirebase;
          notifBody.notification = {};
          notifBody.notification.title = titulo;
          notifBody.notification.body = mensaje;

          sails.request.post({
            url: 'https://fcm.googleapis.com/fcm/send',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'key=AIzaSyCSI6KQmbm3Z_k6TbYX8XouQjO-kWwj0CI',
            },
            body: notifBody,

          }, function (error, response, body) {
            if (error) {
              sails.log(error);
            }
            else {
             sails.log(response);
            }
          });
        }
        if (alumno.sendNotifEmail) {
          sails.log("Envio de mail");
          await sails.helpers.sendEmail.with({to: 'lucas.zarza@gmail.com', subject: "Tienes un nuevo mensaje de la fundacion Jean Sonet", text: "titulo: " + titulo + "Mensaje: " + mensaje});
        }
      }
    }
    for (let docente of docentes) {
      if (process.env.NODE_ENV == 'production') {

      } else {
        if (docente.sendNotifApp) {

        }
        if (docente.sendNotifEmail) {
          sails.log("Envio de mail");
          await sails.helpers.sendEmail.with({to: 'lucas.zarza@gmail.com', subject: "Tienes un nuevo mensaje de la fundacion Jean Sonet", text: "titulo: " + titulo + "Mensaje: " + mensaje});
        }
      }
    }

    res.ok();
  }



};

