educators = [
  {
    firstName: "Сотников",
    middleName: "Сергей",
    lastName: "Викторович",
    academicDegree: "к.т.н",
    department: "ПМИ",
  },
  {
    firstName: "Иван",
    middleName: "Петрович",
    lastName: "Сидоров",
    academicDegree: "д.ф.-м.н.",
    department: "Физика",
  },
  {
    firstName: "Елена",
    middleName: "Александровна",
    lastName: "Кузнецова",
    academicDegree: "д.п.н.",
    department: "Психология",
  },
  {
    firstName: "Андрей",
    middleName: "Николаевич",
    lastName: "Козлов",
    academicDegree: "д.т.н.",
    department: "Информатика",
  },
  {
    firstName: "Мария",
    middleName: "Васильевна",
    lastName: "Иванова",
    academicDegree: "д.э.н.",
    department: "Экономика",
  },
  {
    firstName: "Алексей",
    middleName: "Дмитриевич",
    lastName: "Попов",
    academicDegree: "к.ф.-м.н.",
    department: "Математика",
  },
  {
    firstName: "Ольга",
    middleName: "Владимировна",
    lastName: "Смирнова",
    academicDegree: "к.п.н.",
    department: "Педагогика",
  },
  {
    firstName: "Дарья",
    middleName: "Сергеевна",
    lastName: "Ковалева",
    academicDegree: "д.и.н.",
    department: "Информационные технологии",
  },
  {
    firstName: "Григорий",
    middleName: "Андреевич",
    lastName: "Морозов",
    academicDegree: "к.б.н.",
    department: "Биология",
  },
  {
    firstName: "Наталья",
    middleName: "Викторовна",
    lastName: "Ткаченко",
    academicDegree: "д.х.н.",
    department: "Химия",
  },
];

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
