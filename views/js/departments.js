const departments = [
  { id: 0, title: "Прикладная математика и информатика" },
  { id: 1, title: "Информационные системы и технологии" },
  { id: 2, title: "Вычислительная математика и кибернетика" },
  { id: 3, title: "Программная инженерия" },
  { id: 4, title: "Информационная безопасность" },
  { id: 5, title: "Автоматизация и управление" },
  { id: 6, title: "Электроника и наноэлектроника" },
  { id: 7, title: "Радиотехника и телекоммуникации" },
  { id: 8, title: "Физика" },
  { id: 9, title: "Химия" },
];

$(document).ready(function () {
  $(".closePopup").on("click", closeModal);
  getDeparments();
});

function getDeparments() {
  const departmentsElem = $(".departments");
  $(".row").remove();

  if (departments.length == 0) {
    const row = $("<div>Ничего не найдено</div>").addClass("row");
    educatorsElem.append(row);
  }

  for (let department of departments) {
    const row = $("<div></div>").addClass("row");

    const departmentTemplate = $(`<div>${department.title}</div>`)
      .addClass("card")
      .on("click", () => showEditModal(department.id));

    const deleteButton = $("<button>Удалить</button>")
      .addClass("delete")
      .on("click", () => showDeleteModal(department.id));

    row.append(departmentTemplate, deleteButton);
    departmentsElem.append(row);
  }
}

function closeModal() {
  $(".overlay").removeClass("active");
  $(this).parent().removeClass("active");
}

function showEditModal(id) {
  $(".overlay, .edit-popup").addClass("active");
}

function showCreateModal() {
  $(".overlay, .add-popup").addClass("active");
}

function showDeleteModal(id) {
  $(".overlay, .delete-popup").addClass("active");
  $(".confirm-delete").on("click", () => {
    deleteEducator(id);
    closeModal();
  });
}
