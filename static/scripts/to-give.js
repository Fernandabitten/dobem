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

          if (data[key].categorie_id === 1 && data[key].status_id === 1) {
            textReferenceNoel += `<li id=${data[key].id} class="card_text" style="border-style: outset; margin:30px; padding: 20px; text-align: left">             
            Doe para: ${data[key].username}<br />         
            Pedido: ${data[key].title}<br /> 
            Descrição: ${data[key].description}<br /><br/> 
            <button style="color: #f9da82;" data-request-id=${data[key].id} class="btn send-button" >DOAR</button>
            </li>`;
            $("#you-noel").html(textReferenceNoel);
          } else if (
            data[key].categorie_id === 2 &&
            data[key].status_id === 1
          ) {
            textReferenceEdu += `<li id=${data[key].id} class="card_text" style="border-style: outset; margin:30px; padding: 20px; text-align: left">
            Doe para: ${data[key].username}<br />    
            Pedido: ${data[key].title}<br />
            Descrição: ${data[key].description}<br /><br/> 
            <button style="color: #f9da82;" data-request-id=${data[key].id} class="btn send-button" >DOAR</button>
            </li>`;
            $("#you-edu").html(textReferenceEdu);
          } else if (
            data[key].categorie_id === 3 &&
            data[key].status_id === 1
          ) {
            textReferenceCaregiver += `<li id=${data[key].id} class="card_text" style="border-style: outset; margin:30px; padding: 20px; text-align: left">
            Doe para: ${data[key].username}<br />    
            Pedido: ${data[key].title}<br />
            Descrição: ${data[key].description}<br /><br/> 
            <button style="color: #f9da82;" data-request-id=${data[key].id} data-user-id=${data[key]} class="btn send-button" >DOAR</button>
            </li>`;
            $("#you-caregiver").html(textReferenceCaregiver);
          };
        };

        $(".send-button").on("click", function() {
          const requestId = $(this).attr("data-request-id");
          $.ajax({
            url: "/request-done",
            type: "PATCH",
            data: {"data": requestId},
            success: (data) => {
              $("#"+requestId).html(`
                <span>Pedido aceito. Combine a entrega dos produtos pelo WhatsApp.</span><br />
                <span>Pedido: ${data.title}</span><br />
                <span>Fale com: ${data.username}</span><br />
                <button style="color: #f9da82;" class="btn send-button" ><a style="color: #f9da82;" href="https://wa.me/55${data.phone}" target="_blank">Abrir WhatsApp</a></button>
              `);
            },
            error: (data) => {
              $("#"+requestId).html(`
                <span>Ocorreu um erro ao tentar verificar<br />as informações deste pedido.<br />Tente atualizar a página.</span><br />
              `);
            }
          });
        });        

      },
    });
  };
  loadMyRequests();


  $(".modal-toggle").on("click", function (e) {
    e.preventDefault();
    $(".modal").toggleClass("is-visible");
  });

  $(".to-back").on("click", () => {
    window.location.replace(`/home`);
  });
});