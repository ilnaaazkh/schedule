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

getEducators();

function getEducators() {
  const educatorsElem = $(".educators");
  $(".row").remove();

  for (let employee of educators) {
    const row = $("<div></div>").addClass("row");

    const educator = $(
      `<div>${employee.firstName} ${employee.middleName} ${employee.lastName}, ${employee.academicDegree}, ${employee.department}</div>`
    )
      .addClass("educator")
      .on("click", () => console.log("CLICKED"));

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
  $(".overlay").addClass("active");
  $(".deleteConfirm").click(function () {
    deleteEducator(id);
    $(".popups").removeClass("active");
  });
  $(".close").click(function () {
    $(".popups").removeClass("active");
  });
}

function showCreateModal() {}
