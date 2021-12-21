$(document).ready(() => {
  $(".exit-button").on("click", function () {
    window.location.replace("/");
  });

  $("#log-out-button").on("click", () => {
    $.ajax({
      type: "GET",
      url: `/log-out`,
      data: "",
      success: () => {
        window.location.replace(`/`);
      },
      error: () => {
        window.location.replace(`/error-page`);
      },
    });
  });

  const loadMyRequests = () => {
    $.ajax({
      url: "/order",
      type: "GET",
      data: {},
      success: function (data) {
        let textReferenceNoel = "";
        let textReferenceEdu = "";
        let textReferenceCaregiver = "";

        for (let key in data) {
          let telephone = Number(`${data[key].telephone}`);

          if (data[key].type === "noel" && data[key].statusOrder === true) {
            textReferenceNoel += `<li class="card_text" style="border-style: outset; margin:30px; padding: 20px; text-align: left">             
            Doe para: ${data[key].username}<br />         
            Pedido: ${data[key].title}<br /> 
            Descrição: ${data[key].description}<br /><br/> 
            <p><button class="btn send-button"><a href="https://wa.me/55${telephone}"style="color: #f9da82;">DOAR</a></button></p> 
            </li>`;
            $("#you-noel").html(textReferenceNoel);
          } else if (
            data[key].type === "edu" &&
            data[key].statusOrder === true
          ) {
            textReferenceEdu += `<li class="card_text" style="border-style: outset; margin:30px; padding: 20px; text-align: left">
            Doe para: ${data[key].username}<br />    
            Pedido: ${data[key].title}<br />
            Descrição: ${data[key].description}<br /><br/> 
            <p ><button class="btn send-button" ><a href="https://wa.me/55${telephone}" style="color: #f9da82;">DOAR</a></button></p> 
            </li>`;
            $("#you-edu").html(textReferenceEdu);
          } else if (
            data[key].type === "caregiver" &&
            data[key].statusOrder === true
          ) {
            textReferenceCaregiver += `<li class="card_text" style="border-style: outset; margin:30px; padding: 20px; text-align: left">
            Doe para: ${data[key].username}<br />    
            Pedido: ${data[key].title}<br />
            Descrição: ${data[key].description}<br /><br/> 
            <p><button class="btn send-button">           
            <a href="https://wa.me/55${telephone}"style="color: #f9da82;">
            DOAR</a></button></p> 
            </li>`;
            $("#you-caregiver").html(textReferenceCaregiver);
          }
        }
      },
    });
  };
  loadMyRequests();

  $(".send-button").on("click", () => {
    alert(
      "Pedido finalizado, Combine a melhor forma de envio com o beneficiario pelo whatsap."
    );
  });

  $(".modal-toggle").on("click", function (e) {
    e.preventDefault();
    $(".modal").toggleClass("is-visible");
  });

  $(".to-back").on("click", () => {
    window.location.replace(`/home`);
  });
});