$(document).ready(() => {
  const loadMyRequests = () => {
    $.ajax({
      url: "/orderUser",
      type: "GET",
      data: {},
      success: function (data) {
        let textReferenceNoel = "";
        let textReferenceEdu = "";
        let textReferenceCaregiver = "";

        for (let key in data) {
          let button =
            data[key].statusOrder === false
              ? '<p style="color: #04BECE";>Pedido Atendido</p><!--<p><button class="btn card_btn" class="want-tank-button">Quero Agradecer</button>--></p>'
              : '<p style="color: #f9da82">Pedido em Análise</p>';

          if (data[key].type === "noel") {
            textReferenceNoel += `<li class="card_text" style="border-style: outset; margin:30px; padding: 20px;">             
            Solicitado por: ${data[key].username}<br />         
            Pedido: ${data[key].title}<br />
            Descrição: ${data[key].description}<br />  
            ${button}
            </li>`;
            $("#you-noel").html(textReferenceNoel);
          } else if (data[key].type === "edu") {
            textReferenceEdu += `<li class="card_text" style="border-style: outset; margin:30px; padding: 20px;">
            Solicitado por: ${data[key].username}<br /> 
            Pedido: ${data[key].title}<br />
            Descrição: ${data[key].description}<br />   
            ${button}
            </li>`;
            $("#you-edu").html(textReferenceEdu);
          } else if (data[key].type === "caregiver") {
            textReferenceCaregiver += `<li class="card_text" style="border-style: outset; margin:30px; padding: 20px;">
            Solicitado por: ${data[key].username}<br /> 
            Pedido: ${data[key].title}<br />
            Descrição: ${data[key].description}<br />   
            ${button}
            </li>`;
            $("#you-caregiver").html(textReferenceCaregiver);
          }
        }
      },
    });
  };
  loadMyRequests();

  $(".want-tank-button").on("click", () => {
    window.location.replace("/thank-form");
  });

  $(".exit-button").on("click", function () {
    window.location.replace("/");
  });

  $(".fa-lg").on("click", () => {
    window.location.replace(`/home`);
  });
});
