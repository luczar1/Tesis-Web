module.exports = {

  friendlyName: 'Funcion para enviar E-mails',


  description: 'Envia un mail con los parametros especificados.',


  inputs: {
    to: {
      type: 'string',
      example: 'pepe@lolo.com',
      description: 'Direccion a la que se envia.',
      required: true
    },
    subject: {
      type: 'string',
      example: 'Notificacion',
      description: 'Asunto del mensaje.',
      required: true
    },
    text: {
      type: 'string',
      example: 'Hola',
      description: 'Texto del mensaje.',
      required: true
    },

  },


  fn: async function (inputs, exits) {


    let transporter = sails.nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'mariano1colombo@gmail.com',
        pass: '37874409Marianeitor***'
      }
    });

    let mailOptions = {
      from: {
        name: 'Mariano Colombo',
        address: 'mariano1colombo@gmail.com'
      },
      to: inputs.to,
      subject: inputs.subject,
      text: inputs.text,
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });


    return exits.success();
  }

};
