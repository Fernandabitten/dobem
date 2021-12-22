$(document).ready(() => {
  $("#log-out-button").on("click", () => {
    window.location.replace("/");;
  });

  $(".make-request-button").on("click", function () {
    let orderCategory = $("#category-input").val();
    let orderTitle = $("#title-input").val();
    let orderDescription = $("#description-input").val();

    $.ajax({
      url: "/register-order",
      type: "POST",
      data: {
        type: orderCategory,
        title: orderTitle,
        description: orderDescription,
      },
      success: function (data) {
        if (data === "/") {
          window.location.replace(`${data}`);
          return true;
        }
      },
    });
    $("#category-input").val("");
    $("#title-input").val("");
    $("#description-input").val("");
    $("#make-request-span").html(`
    <h3 style="color: #D0D28B;" class="centralize vertical-margin">NOVO PEDIDO CADASTRADO COM SUCESSO.</h3>
    <h3  style="color: #D0D28B;" class="centralize vertical-margin">Aguarde até seu pedido <b>ser atendido!</b></h3>
    <span id="loading"></span> 
    `);
    const spanLoading = setInterval(() => {
      $("#loading").append(".");
    }, 1000);
    setTimeout(() => {
      clearInterval(spanLoading);
      window.location.replace("/home");
    }, 4000);    
  });

  $(".to-back").on("click", () => {
    window.location.replace(`/home`);
  });
});
