$(document).ready(() => {
  const loadDonation = () => {
    $.ajax({
      url: "/donation",
      type: "GET",
      data: {},
      success: function (data) {
        let textReferenceNoel = "";
        let textReferenceEdu = "";
        let textReferenceCaregiver = "";

        for (let key in data) {
          if (data[key].type === 1) {
            textReferenceNoel += `<li class="card_text" class="voce-edu">
            Doação: ${data[key].title}<br />
            Descrição: ${data[key].description}<br />
            Para: ${data[key].username}
            <div class="section-heading-separator"></div>
            </li>`;

            $("#you-noel").html(textReferenceNoel);
          } else if (data[key].type === 2) {
            textReferenceEdu += `<li class="card_text">
            Doação: ${data[key].title}<br />
            Descrição: ${data[key].description}<br />
            Para: ${data[key].username}
            <div class="section-heading-separator"></div>
            </li>`;

            $("#you-edu").html(textReferenceEdu);
          } else if (data[key].type === 3) {
            textReferenceCaregiver += `<li class="card_text">
            Doação: ${data[key].title}<br />
            Descrição: ${data[key].description}<br />
            Para: ${data[key].username}
            <div class="section-heading-separator"></div>
            </li>`;

            $("#you-caregiver").html(textReferenceCaregiver);
          }
        }
      },
    });
  };
  loadDonation();

  $(".exit-button").on("click", function () {
    window.location.replace("/");
  });

  $(".fa-lg").on("click", () => {
    window.location.replace(`/home`);
  });
});
