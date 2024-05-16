const baseUrl = "/api/disciplines";
let disciplines = [];

$(document).ready(function () {
  getDisciplines();

  $(".closePopup").on("click", closeModal);
  $(".deleteConfirm").on("click", closeModal);

  $("#create").submit(createDiscipline);
  $("#search").on("input", function () {
    let searchText = $(this).val();
    renderDisciplines(
      disciplines.filter((d) =>
        d.title.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  });
});

function getDisciplines() {
  $.ajax({
    url: baseUrl,
    method: "get",
    dataType: "json",
    success: function (data) {
      disciplines = data;
      renderDisciplines(disciplines);
    },
    error: function (e) {
      console.log(e.message);
    },
  });
}

function renderDisciplines(disciplines) {
  const $disciplinesElem = $(".disciplines");
  $disciplinesElem.empty();

  if (disciplines.length === 0) {
    const row = $("<div>Ничего не найдено</div>").addClass("row");
    $disciplinesElem.append(row);
    return;
  }

  for (let discipline of disciplines) {
    const row = $("<div>").addClass("row");

    const disciplineCard = $(`<div> ${discipline.title} </div>`)
      .addClass("card")
      .on("click", () => showEditModal(discipline._id));

    const deleteButton = $(`<button>Удалить</button>`)
      .addClass("delete")
      .on("click", () => showDeleteModal(discipline._id));

    row.append(disciplineCard, deleteButton);
    $disciplinesElem.append(row);
  }
}

function createDiscipline(event) {
  event.preventDefault();
  $form = $(this);

  let titleInput = $form.find("input[name=title]");
  let title = titleInput.val();
  titleInput.val("");

  fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: title }),
  })
    .then((response) => {
      closeModal();
      if (response.ok) {
        showInfoModal("Новая дисциплина успешно создана");
        getDisciplines();
      } else {
        showInfoModal("Что-то пошло не так. Повторите попытку позже");
      }
    })
    .catch((error) => {
      console.error("Ошибка:", error);
    });
}

function deleteDiscipline(id) {
  $.ajax({
    url: baseUrl + `/${id}`,
    method: `delete`,
    success: function () {
      showInfoModal("Дисциплина успешно удалена!");
      getDisciplines();
    },
    error: function (error) {
      showInfoModal("Что-то пошло не так. Повторите попытку позже");
    },
  });
}

function closeModal() {
  $(".overlay").removeClass("active");
  $(".overlay").children().removeClass("active");
}

async function showEditModal(id) {
  $(".overlay, .edit-popup").addClass("active");

  $form = $("#edit");
  let response = await fetch(baseUrl + `/${id}`);

  if (response.ok) {
    let discipline = await response.json();
    $form.find("input[name=title]").val(discipline.title);
    $form.off().submit(function (event) {
      event.preventDefault();
      let newTitle = $form.find("input[name=title]").val();
      fetch(baseUrl + `/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle }),
      }).then((resp) => {
        closeModal();
        if (resp.ok) {
          showInfoModal("Дисциплина успешно обновлена");
          getDisciplines();
        } else {
          showInfoModal("Что-то пошло не так");
        }
      });
    });
  } else {
    closeModal();
    showInfoModal("Что-то пошло не так");
  }
}

function showCreateModal() {
  $(".overlay, .add-popup").addClass("active");
}

function showDeleteModal(id) {
  $(".overlay, .delete-popup").addClass("active");
  $(".deleteConfirm").on("click", () => deleteDiscipline(id));
}

function showInfoModal(message) {
  $(".overlay, .info-popup").addClass("active");
  $(".popup.info-popup h2").text(message);
}
