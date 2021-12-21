$(document).ready(() => {
  $(".sign-in-page-button").on("click", () => {
    window.location.replace(`./sign-in`);
  });

  $("#privacy-policy").on("click", () => {
    window.location.replace(`./privacy-policy`);
    /*$.ajax({
      type: "GET",
      url: `/privacy-policy`,
      data: "",
      success: () => {
        window.location.replace(`/privacy-policy`);
      },
      error: () => {
        window.location.replace(`/error-page`);
      },
    });*/
  });  

  $("#sign-up-page-button").on("click", () => {
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

  $(window).scroll(function () {
    if ($(this).scrollTop() > 50) {
      $("#back-to-top").fadeIn();
    } else {
      $("#back-to-top").fadeOut();
    }
  });

  $("#back-to-top").click(function () {
    $("body,html").animate(
      {
        scrollTop: 0,
      },
      400
    );
    return false;
  });
});
