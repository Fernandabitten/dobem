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
      success: () => {
        window.location.replace(`/`);
      },
      error: () => {
        window.location.replace(`/error-page`);
      },
    });
  });

  let cep;
  let cpfOK = false;
  let usernameOK = false;
  let fullNameOK = false;
  let emailOK = false;
  let emailConfirmationOK = false;
  let phoneOK = false;
  let cepOK = false;
  let addressOK = false;
  let passwordOK = false;
  let passwordConfirmationOK = false;

  $("#address-input").val("");
  $("#district-input").val("");
  $("#city-input").val("");
  $("#state-input").val("");

  const searchCep = () => {
    cep = $("#cep-input").val();
    $.ajax({
      type: "GET",
      url: `https://cep.awesomeapi.com.br/json/${cep}`,
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: (data) => {
        cepOK = true;
        $("#cep-span").html("");
        $("#address-span").html("");
        $("#district-span").html("");
        $("#city-span").html("");
        $("#state-span").html("");
        $("#address-input").val(data.address.toUpperCase());
        $("#district-input").val(data.district.toUpperCase());
        $("#city-input").val(data.city.toUpperCase());
        $("#state-input").val(data.state);
      },
      error: () => {
        cepOK = false;
        $("#cep-span").html("");
        $("#address-span").html("");
        $("#district-span").html("");
        $("#city-span").html("");
        $("#state-span").html("");
        $("#address-input").val("");
        $("#district-input").val("");
        $("#city-input").val("");
        $("#state-input").val("");
        setTimeout(() => {
          $("#cep-span").html("CEP não encontrado");
        }, 64);
      },
    });
  };
  $("#search-cep-button").on("click", searchCep);

  $(".only-number").on("input", function (e) {
    $(this).val(
      $(this)
        .val()
        .replace(/[^0-9]/g, "")
    );
  });

  $("#username-input").on("input", function (e) {
    $(this).val($(this).val().replace(" ", ""));
  });

  $("#full-name-input").on("input", function (e) {
    $(this).val($(this).val().replace(/[0-9]/g, ""));
  });

  const cpfInputBlur = () => {
    const reference = $("#cpf-input").val();
    if (reference.length == 11) {
      cpfOK = true;
      $("#cpf-span").html("");
    } else {
      cpfOK = false;
      $("#cpf-span").html("Digite seu CPF");
    }
  };
  $("#cpf-input").blur(cpfInputBlur);

  const usernameInputBlur = () => {
    const reference = $("#username-input").val();
    const checkBlankSpaces = reference.split(" ");
    if (
      reference.length > 3 &&
      reference.length < 65 &&
      checkBlankSpaces.length == 1
    ) {
      usernameOK = true;
      $("#username-span").html("");
    } else {
      usernameOK = false;
      $("#username-span").html(
        "O nome de usuário deve ter no mínimo 4 caracteres"
      );
    }
  };
  $("#username-input").blur(usernameInputBlur);

  const fullNameInputBlur = () => {
    const reference = $("#full-name-input").val();
    if (
      reference.length > 2 &&
      reference.length < 257 &&
      /\S/.test(reference)
    ) {
      fullNameOK = true;
      $("#full-name-span").html("");
    } else {
      fullNameOK = false;
      $("#full-name-span").html("Digite seu nome");
    }
  };
  $("#full-name-input").blur(fullNameInputBlur);

  const emailInputBlur = () => {
    const reference = $("#email-input").val();
    const emailUser = reference.substring(0, reference.indexOf("@"));
    const emailDomain = reference.substring(
      reference.indexOf("@") + 1,
      reference.length
    );

    if (
      reference.length > 4 &&
      reference.length < 257 &&
      emailUser.length >= 1 &&
      emailDomain.length >= 3 &&
      emailUser.search("@") == -1 &&
      emailDomain.search("@") == -1 &&
      emailUser.search(" ") == -1 &&
      emailDomain.search(" ") == -1 &&
      emailDomain.search(".") != -1 &&
      emailDomain.indexOf(".") >= 1 &&
      emailDomain.lastIndexOf(".") < emailDomain.length - 1
    ) {
      emailOK = true;
      $("#email-span").html("");
    } else {
      emailOK = false;
      $("#email-span").html("Digite um email válido");
    }
  };
  $("#email-input").blur(emailInputBlur);

  const emailConfirmationBlur = () => {
    const reference = $("#email-confirmation-input").val();
    if (reference == $("#email-input").val()) {
      emailConfirmationOK = true;
      $("#email-confirmation-span").html("");
    } else {
      emailConfirmationOK = false;
      $("#email-confirmation-span").html("Repita o email válido");
    }
  };
  $("#email-confirmation-input").blur(emailConfirmationBlur);

  const phoneInputBlur = () => {
    const reference = $("#phone-input").val();
    if (reference.length >= 10 && reference.length <= 11) {
      phoneOK = true;
      $("#phone-span").html("");
    } else {
      phoneOK = false;
      $("#phone-span").html("Digite um número válido");
    }
  };
  $("#phone-input").blur(phoneInputBlur);

  const cepInputBlur = () => {
    searchCep();
    const reference = $("#cep-input").val();
    if (reference.length == 8 && cep != undefined) {
      $("#cep-span").html("");
    } else {
      cepOK = false;
    }
  };
  $("#cep-input").blur(cepInputBlur);

  const addressNumberInputBlur = () => {
    const reference = $("#address-number-input").val();
    if (reference.length > 1 && /\S/.test(reference)) {
      addressOK = true;
      $("#address-number-span").html("");
    } else {
      addressOK = false;
      $("#address-number-span").html("Especifique o endereço");
    }
  };
  $("#address-number-input").blur(addressNumberInputBlur);

  const passwordInputBlur = () => {
    const reference = $("#password-input").val();
    if (reference.length > 7 && reference.length < 17) {
      passwordOK = true;
      $("#password-span").html("");
    } else {
      passwordOK = false;
      $("#password-span").html("A senha deve conter entre 8 e 16 caracteres");
    }
  };
  $("#password-input").blur(passwordInputBlur);

  const passwordConfirmationInputBlur = () => {
    const reference = $("#password-confirmation-input").val();
    if (reference == $("#password-input").val() && passwordOK == true) {
      passwordConfirmationOK = true;
      $("#password-confirmation-span").html("");
    } else {
      passwordConfirmationOK = false;
      $("#password-confirmation-span").html(
        "Repita corretamente a senha válida"
      );
    }
  };
  $("#password-confirmation-input").blur(passwordConfirmationInputBlur);

  $("#sign-up-button").on("click", () => {
    cpfInputBlur();
    usernameInputBlur();
    fullNameInputBlur();
    emailInputBlur();
    emailConfirmationBlur();
    phoneInputBlur();
    cepInputBlur();
    addressNumberInputBlur();
    passwordInputBlur();
    passwordConfirmationInputBlur();

    const username = $("#username-input").val();

    if (
      cpfOK == true &&
      usernameOK == true &&
      fullNameOK == true &&
      emailOK == true &&
      emailConfirmationOK == true &&
      phoneOK == true &&
      cepOK == true &&
      addressOK == true &&
      passwordOK == true &&
      passwordConfirmationOK == true
    ) {
      const addressComplement = () => {
        if (/\S/.test($("#address-complement-input").val())) {
          return " " + $("#address-complement-input").val();
        } else {
          return "";
        }
      };
      const user = {
        cpf: $("#cpf-input").val(),
        username: username,
        fullName: $("#full-name-input").val().toUpperCase(),
        email: $("#email-input").val(),
        phoneDDD: $("#phone-input").val().substring(0, 2),
        phoneNumber: $("#phone-input")
          .val()
          .substring(2, $("#phone-input").val().length),
        cep: cep,
        address:
          $("#address-input").val() +
          ", " +
          $("#address-number-input").val() +
          addressComplement(),
        district: $("#district-input").val(),
        city: $("#city-input").val(),
        state: $("#state-input").val(),
        password: $("#password-input").val(),
      };
      $.ajax({
        type: "POST",
        url: `/sign-up-verify`,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(user),
        success: (data) => {
          $("#sign-up-span").html(`
                    <h1 class="centralize vertical-margin">NOVO USUÁRIO CADASTRADO COM SUCESSO.</h1>
                    <h2 class="centralize vertical-margin">Seja bem vindo ao<b>Do Bem</b> ${username}!</h2>
                    <br />
                    <h2 class="centralize">Redirecionando para a página inicial<span id="loading"></span></h2>
                `);

          const spanLoading = setInterval(() => {
            $("#loading").append(".");
          }, 1000);
          setTimeout(() => {
            clearInterval(spanLoading);
            window.location.replace("/");
          }, 4000);
        },
        error: (data) => {
          $("#sign-up-span").html("");
          setTimeout(() => {
            $("#sign-up-span").html(data.responseJSON.message);
          }, 64);
        },
      });
    } else {
      $("#sign-up-span").html("");
      setTimeout(() => {
        $("#sign-up-span").html("Preencha corretamente todos os campos");
      }, 64);
    }
  });
});
