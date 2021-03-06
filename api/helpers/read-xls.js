module.exports = {


  friendlyName: 'Read xls cursos',


  description: 'Read and parse the xlsx to generate and update courses',


  inputs: {
    filePath: {
      type: 'string',
      example: 'example',
      description: 'File to parse',
      required: true,
    }
  },


  exits: {},


  fn: async function (inputs, exits) {

    var startTime;
    var endTime;
    let buf = sails.fs.readFileSync(inputs.filePath);
    let workbook = sails.xlsx.read(buf, {type: 'buffer'});
    let ws = workbook.Sheets[workbook.SheetNames[0]];
    ws["!ref"] = ws["!ref"].replace("A1", "A2");

    let json = sails.xlsx.utils.sheet_to_json(ws);


    let cursosOk = [];
    let areaDB = await Area.find({});

    for (let curso in json) {
      let cursoOk = {};
      cursoOk.codigoAlternativo = json[curso]['Código'];
      cursoOk.codigo = json[curso]['Cod.Presup.'];
      cursoOk.nombre = json[curso]['Curso'];
      cursoOk.UA = json[curso]['U.A.'];
      cursoOk.nombreUA = json[curso]['Nomb.U.A.'];
      let date = json[curso]['Inicio']. split('-');
      let dateObj = new Date(date[2], date[1]-1, date[0]);
      cursoOk.inicio = dateObj.getTime();
      cursoOk.fin = json[curso]['Fin'];
      cursoOk.categoria = json[curso]['Categoría'];
      cursoOk.vigente = json[curso]['Vigente'] == 'Si' ? 'Vigente' : json[curso]['Vigente'];
      cursoOk.estado = json[curso]['Estado'] == 'Si' ? 'Por iniciar' : json[curso]['Estado'];
      cursoOk.cupoMax = json[curso]['Cupo Max.'];
      cursoOk.cantHoras = json[curso]['Cant.Hs.'];
      cursoOk.areas = [];

      sails.log(cursoOk.codigoAlternativo);

      if (cursoOk.estado != "Terminado") {

        startTime = new Date().getTime();
        console.log('Por hacer la consulta a david.');
        sails.request.get({
          url: 'http://fjs.ucc.edu.ar/json/curso.php?id=' + cursoOk.codigo
        }, function (error, response, body) {
          if (error) {
            // console.log(error);
          }
          else {
            try {
              let json = JSON.parse(body);
              if (json[0].cext_foto != null && json[0].cext_foto != "") {
                cursoOk.img = "https://www.ucc.edu.ar/portalucc/archivos/File/fjs/fotos/" + json[0].cext_foto;
                // console.log(cursoOk.img);
              }
              else {
                cursoOk.img = "https://via.placeholder.com/313x250.png?text=Sin Imagen";
              }
              if (json[0].descripcion != null) {
                cursoOk.descripcion = sails.utf8.decode(json[0].descripcion);
                // console.log(cursoOk.descripcion);
              }
              if (json[0].id_area != null) {
                let areas = json[0].id_area.split(";");
                for(area of areas){
                  if (area != '0')
                  cursoOk.areas.push(areaDB.find(function (element)
                  {
                   return element.id_area == area;
                  }).id);
                }
                // console.log(cursoOk.areas);
              }
            }
            catch (e) {
              sails.log.error(e);
              sails.log(cursoOk.codigo);
            }
          }

          endTime = new Date().getTime();
          var totalTime = endTime - startTime;
          console.log('Terminada la consulta. Demoro: ' + totalTime + ' ms');

        });


        let sleep = sails.sleep;
        sleep(250);
      }

      cursosOk.push(cursoOk);
    }


    for (key in cursosOk) {

      await Curso.findOrCreate({codigo: cursosOk[key].codigo}, cursosOk[key])
        .exec(async (err, newOrExistingRecord, wasCreated) => {
          sails.log(err);
          if (wasCreated != null && !wasCreated) {

            let found = cursosOk.find((e) => {
              return e.codigo === newOrExistingRecord.codigo
            });


            delete found.id;
            delete found.updatedAt;
            delete found.createdAt;
            delete found.alumnos;

            // sails.log(found);
            await Curso.update({id: newOrExistingRecord.id}, found);

          }
        });
    }




    // All done.
    return exits.success(cursosOk);

  }



};

