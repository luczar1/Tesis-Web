$(function () {

  $('#subirCurso').fileUpload({
    success: function (data, textStatus, jqXHR) {
      console.log(data);
      notificacion("success","Listo","fa fa-check");
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR);
      notificacion("danger", "Error en la carga", "fa fa-times");
    }, // Callback if an error happens with your upload call or the submit call
  });


});

function readUrl(input) {

  if (input.files && input.files[0]) {
    let reader = new FileReader();
    reader.onload = (e) => {
      let imgData = e.target.result;
      let imgName = input.files[0].name;
      input.setAttribute("data-title", imgName);
      // console.log(e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }

}

function notificacion(tipo, mensaje, icono) {
  $.notify({
    icon: icono,
    message: mensaje

  }, {
    type: tipo,
    timer: 5000,

    placement: {
      from: "top",
      align: "right"
    },
    offset: 50
  });

}
