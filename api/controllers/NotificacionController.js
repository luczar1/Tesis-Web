/**
 * NotificacionController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

  /**
   * Send a new Notification.
   * @param req
   * @param res
   * @returns {Promise<void>}
   */
  create : async function(req, res) {

    /**
     * Get notification body structure.
     * @param title
     * @param message
     * @returns {{to: null, notification: {title: *, body: *}}}
     */
    function getNotification(title, message) {
      return {
        to: null,
        notification: {
          title: title,
          body: message
        }
      }
    }

    /**
     * Send the given notification using a FirebaseToken.
     * @param notification
     * @param token
     */
    function sendNotification(notification, token) {
      notification.to = token;
      sails.request.post({
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'key=AIzaSyCSI6KQmbm3Z_k6TbYX8XouQjO-kWwj0CI',
        },
        body: JSON.stringify(notification),
      }, function (error, response, body) {
        if (error) {
          sails.log(error);
        }
        else {
          sails.log(response);
        }
      });
    }

    let titulo = req.param("titulo"),
      mensaje = req.param("mensaje"),
      curso = req.param("curso"),
      emisor = req.param("emisor") !== undefined ? req.param("emisor") : req.session.userId;
      alumnos = req.param('alumnos'),
      docentes = req.param('docentes'),
      alumnosNotificados = [],
      docentesNotificados = [],
      notification = getNotification(titulo, mensaje);

    for (let alumno of alumnos) {
      if (process.env.NODE_ENV == 'production') {
        if (alumno.sendNotifApp) {
          alumnosNotificados.push(alumno.id);
          sendNotification(notification, alumno.tokenFirebase);
        }
        if (alumno.sendNotifEmail) {
          sails.log("Envio de mail");
          await sails.helpers.sendEmail.with({to: alumno.email, subject: "Tienes un nuevo mensaje de la Fundación Jean Sonet", text: "Título: " + titulo + "Mensaje: " + mensaje});
        }

      } else {
        if (alumno.sendNotifApp) {
          alumnosNotificados.push(alumno.id);
          sendNotification(notification, alumno.tokenFirebase);
        }
        if (alumno.sendNotifEmail) {
          sails.log("Envio de mail");
          await sails.helpers.sendEmail.with({to: 'lucas.zarza@gmail.com', subject: "Tienes un nuevo mensaje de la Fundación Jean Sonet", text: "Título: " + titulo + "Mensaje: " + mensaje});
        }
      }
    }
    for (let docente of docentes) {
      if (process.env.NODE_ENV == 'production') {
        if (docente.sendNotifApp) {
          docentesNotificados.push(docente.id);
          sendNotification(notification, docente.tokenFirebase);
        }
        if (docente.sendNotifEmail) {
          sails.log("Envio de mail");
          await sails.helpers.sendEmail.with({to: alumno.email, subject: "Tienes un nuevo mensaje de la Fundación Jean Sonet", text: "Título: " + titulo + "Mensaje: " + mensaje});
        }

      } else {
        if (docente.sendNotifApp) {
          docentesNotificados.push(docente.id);
          sendNotification(notification, docente.tokenFirebase);
        }
        if (docente.sendNotifEmail) {
          sails.log("Envio de mail");
          await sails.helpers.sendEmail.with({to: 'lucas.zarza@gmail.com', subject: "Tienes un nuevo mensaje de la Fundación Jean Sonet", text: "Título: " + titulo + "Mensaje: " + mensaje});
        }
      }
    }

    await Notificacion.create({
      titulo: titulo,
      mensaje: mensaje,
      curso: curso,
      emisor: emisor,
      archivo: '',
      alumnos: alumnosNotificados,
      docentes: docentesNotificados
    });

    res.ok();
  }
};

