educators = [];
$(document).ready(function () {
  $(".closePopup").on("click", closeModal);

  $("#createEducatorForm").on("submit", createEducator);
  getEducators();
});

function getEducators() {
  const educatorsElem = $(".educators");
  $(".row").remove();

  if (educators.length == 0) {
    const row = $("<div>Ничего не найдено</div>").addClass("row");
    educatorsElem.append(row);
  }

  for (let employee of educators) {
    const row = $("<div></div>").addClass("row");

    const educator = $(
      `<div>${employee.firstName} ${employee.middleName} ${employee.lastName}, ${employee.academicDegree}, ${employee.department}</div>`
    )
      .addClass("card")
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
