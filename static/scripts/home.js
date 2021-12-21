const urlAddress = "http://localhost:3000";

$(document).ready(() => {
  $.ajax({
    url: "/verify",
    type: "GET",
    data: {},
    success: (data) => {
      if (data !== null || data !== undefined) {
        window.location.replace(data);
      }
    },
  });

  $("#logout-button").on("click", () => {
    window.location.replace("/");
    $.ajax({
      url: "/log-out",
      type: "GET",
      data: {},
      success: function () {
        console.log("logged out");
      },
    });
  });

  $("#to-receive-button").on("click", function () {
    window.location.replace("/make-request");
  });

  $("#to-give-button").on("click", function () {
    window.location.replace("/to-give");
  });

  $("#my-donations-button").on("click", function () {
    window.location.replace("/my-donations");
  });

  $("#my-requests-button").on("click", function () {
    $.ajax({
      url: "/order",
      type: "GET",
      data: {},
      success: function () {
        console.log("logged out");
        window.location.replace("/my-requests");
      },
    });
  });
});
