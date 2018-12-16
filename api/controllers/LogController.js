/**
 * LogController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {


  generateXlsx: async function (req, res) {

    let fileName = await sails.helpers.exportLogsXlsx();

    let filestream = sails.fs.createReadStream(fileName);
    filestream.pipe(res);

    //sails.fs.unlink(fileName);
    res.attachment("Resumen de Logs.xlsx");
  },

};

