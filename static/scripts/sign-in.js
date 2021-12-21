$(document).ready(() => {
  $("#back-home").on("click", () => {
    $.ajax({
      type: "GET",
      url: `/`,
      data: "",
      success: () => {
        window.location.replace(`/`);
      },
      error: () => {
        window.location.replace(`/error-page`);
      },
    });
  });

  $(".logo").on("click", () => {
    $.ajax({
      type: "GET",
      url: `/`,
      data: "",
      success: () => {
        window.location.replace(`/`);
      },
      error: () => {
        window.location.replace(`/error-page`);
      },
    });
  });

  $("#sign-in-button").on("click", function () {
    let user = $("#user").val();
    let password = $("#password").val();
    if (user && password) {
      $.ajax({
        url: "/sign-in",
        type: "POST",
        data: { username: user, password: password },
        success: function (data) {
          window.location.replace(`${data}`);
        },
        error: function () {
          $("#msg-err").html(`
                <p>Usuário ou senha inválida. Por favor, tente novamente.</p>`);
        },
      });
    } else {
      $("#msg-err").html(`
            <p>Por favor, preencha todos os campos.</p>`);
    }
    setTimeout(() => {
      $("#msg-err").html(``);
    }, 1500);
  });

  $("#send-sign-up").on("click", () => {
    $.ajax({
      type: "GET",
      url: `/sign-up`,
      data: "",
      success: () => {
        window.location.replace(`/sign-up`);
      },
      error: () => {
        window.location.replace(`/error-page`);
      },
    });
  });
});
