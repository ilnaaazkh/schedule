var educators = [
  {
    id: 0,
    firstName: "Сотников",
    middleName: "Сергей",
    lastName: "Викторович",
    department: "ПМИ",
    academicDegree: "к.т.н",
  },
  {
    id: 1,
    firstName: "Тутубалин",
    middleName: "Павел",
    lastName: "Иннокентьевич",
    department: "ПМИ",
    academicDegree: "к.т.н",
  },
  {
    id: 2,
    firstName: "Иванов",
    middleName: "Иван",
    lastName: "Иванович",
    department: "ИТ",
    academicDegree: "д.т.н",
  },
  {
    id: 3,
    firstName: "Петров",
    middleName: "Петр",
    lastName: "Петрович",
    department: "Биология",
    academicDegree: "д.б.н",
  },
  {
    id: 4,
    firstName: "Сидоров",
    middleName: "Алексей",
    lastName: "Александрович",
    department: "История",
    academicDegree: "к.ф.н",
  },
  {
    id: 5,
    firstName: "Кузнецова",
    middleName: "Екатерина",
    lastName: "Ивановна",
    department: "Литература",
    academicDegree: "к.ф.н",
  },
];

var nextId = 6;
getEducators();

$(document).ready(function () {
  $(".closePopup").on("click", closeModal);

  $("#createEducatorForm").on("submit", createEducator);
});

function getEducators() {
  const educatorsElem = $(".educators");
  $(".row").remove();

  for (let employee of educators) {
    const row = $("<div></div>").addClass("row");

    const educator = $(
      `<div>${employee.firstName} ${employee.middleName} ${employee.lastName}, ${employee.academicDegree}, ${employee.department}</div>`
    )
      .addClass("educator")
      .on("click", () => showEditModal(employee.id));

    const deleteButton = $("<button>Удалить</button>")
      .addClass("delete")
      .on("click", () => showDeleteModal(employee.id));

    row.append(educator, deleteButton);
    educatorsElem.append(row);
  }
}

function deleteEducator(id) {
  educators = educators.filter((x) => x.id !== id);
  getEducators();
}

function createEducator() {
  const formData = new FormData(this);
  let newEducator = {
    id: nextId++,
    firstName: formData.get("firstName"),
    middleName: formData.get("middleName"),
    lastName: formData.get("lastName"),
    department: formData.get("department"),
    academicDegree: formData.get("academicDegree"),
  };
  educators.append(newEducator);
  console.log(educators);
}

function filterEducatorsList(event) {
  let searchTerm = event.target.value;
  educators = educators.filter((employee) =>
    `${employee.firstName} ${employee.middleName} ${employee.lastName}, ${employee.academicDegree}, ${employee.department}`.includes(
      searchTerm
    )
  );
  getEducators();
}

function showDeleteModal(id) {
  $(".overlay, .delete-popup").addClass("active");
  $(".confirm-delete").on("click", () => {
    deleteEducator(id);
    closeModal();
  });
}

function showCreateModal() {
  $(".overlay, .add-popup").addClass("active");
}

function closeModal() {
  $(".overlay").removeClass("active");
  $(this).parent().removeClass("active");
}

function showEditModal(id) {
  $(".overlay, .edit-popup").addClass("active");
}
