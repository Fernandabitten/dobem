$(document).ready(() => {
  $.ajax({
    url: "/thank-form",
    type: "GET",
    data: "",
    success: (data) => {
      if (data !== null || data !== undefined) {
        window.location.replace(data);
      }
    },
  });

  $("#send-form").on("click", function () {
    let formName = $(".form-name").val();
    let formContactTextarea = $(".form-contact-textarea").val();

    $.ajax({
      url: "/send-message",
      type: "POST",
      data: {
        name: formName,
        textarea: formContactTextarea,
      },
      success: () => {
        window.location.replace("/thank-send");
      },
    });
  });

  $("#exit-button").on("click", function () {
    window.location.replace("/");
  });

  $(".fa-lg").on("click", () => {
    window.location.replace(`/my-requests`);
  });
});
