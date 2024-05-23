const baseUrl = "/api/educators";
let educators = [];

$(document).ready(async function () {
  educators = await getEducators();
  renderContent(educators);

  $(".add").on("click", showCreateEditModal);
  $(".closePopup").on("click", closeModal);

  $("#delete-form").on("submit", onDeleteSubmited);
  $("#create-edit-form").on("submit", onCreateEditSubmited);
  $("#search").on("input", searchEducator);
});

async function getEducators() {
  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    return data;
  }

  return [];
}

function renderContent(educators) {
  const $educators = $(".educators");
  $educators.empty();

  let groupedEducators = groupEducatorsByDepartment(educators);

  if (groupedEducators.length === 0) {
    const row = $("<div>Ничего не найдено</div>");
    $educators.append(row);
    return;
  }

  for (let department of groupedEducators) {
    let header = $("<h3>")
      .addClass("department")
      .text(department.department_title);

    $educators.append(header);

    for (let empl of department.employees) {
      const row = $("<div>").addClass("row");

      const card = $("<div>")
        .addClass("card")
        .text(`${empl.middleName} ${empl.firstName} ${empl.lastName}`)
        .attr("id", empl._id)
        .on("click", showCreateEditModal);

      const deleteBtn = $("<button>")
        .addClass("delete")
        .text("Удалить")
        .attr("id", empl._id)
        .on("click", showDeleteModal);

      row.append(card, deleteBtn);
      $educators.append(row);
    }
  }
}

function showDeleteModal() {
  const form = $("#delete-form");
  const id = $(this).attr("id");

  form.find("input[name='id']").val(id);

  $(".overlay, .delete-popup").addClass("active");
}

async function deleteEducator(id) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    let index = educators.findIndex((e) => e._id == id);
    educators.splice(index, 1);
    return true;
  }

  return false;
}

async function onDeleteSubmited(e) {
  e.preventDefault();

  let form = $("#delete-form");
  let id = form.find('input[name="id"]').val();
  let result = await deleteEducator(id);

  form.find('input[name="id"]').val("");
  closeModal();

  if (result) {
    showInfoModal("Преподаватель успешно удален");
    renderContent(educators);
  } else {
    showInfoModal("Не удалось удалить преподавателя");
  }
}

function closeModal() {
  $(".overlay").removeClass("active");
  $(".overlay").children().removeClass("active");
  $("form>input").val("");
  $("form>select").val("");
}

async function showCreateEditModal() {
  const id = $(this).attr("id");
  const form = $("#create-edit-form");
  const departmentSelect = form.find("select[name='departmentId']");
  const departments = await getDepartments();
  await initDepartmentsDropdown(departments);

  if (id) {
    form.find("h2").text("Редактировать преподавателя");
    const educator = educators.find((e) => e._id == id);
    form.find("input[name='id']").val(educator._id);
    form.find("input[name='middleName']").val(educator.middleName);
    form.find("input[name='firstName']").val(educator.firstName);
    form.find("input[name='lastName']").val(educator.lastName);
    departmentSelect.val(
      departments.find((d) => d.title == educator.department_title)._id
    );
  } else {
    form.find("h2").text("Добавить преподавателя");
    form.find("input[name='id']").val(0);
  }

  $(".overlay, .edit-popup").addClass("active");
}

async function onCreateEditSubmited(e) {
  e.preventDefault();

  const form = $("#create-edit-form");

  const id = form.find('input[name="id"]').val();
  const firstName = form.find('input[name="firstName"]').val();
  const middleName = form.find('input[name="middleName"]').val();
  const lastName = form.find('input[name="lastName"]').val();
  const departmentId = form.find("select[name='departmentId']").val();

  const employee = {
    _id: id,
    firstName: firstName,
    middleName: middleName,
    lastName: lastName,
    departmentId: departmentId,
  };

  form.find("input").val("");
  closeModal();

  let result;
  let resultStr = "";

  if (id == 0) {
    result = await createEducator(employee);
    resultStr = result
      ? "Новый преподаватель успешно добавлен"
      : "Не удалось добавить преподавателя";
  } else {
    result = await updateEducator(employee);
    resultStr = result
      ? "Преподаватель успешно обновлен"
      : "Не удалось обновить преподавателя";
  }

  if (result) {
    renderContent(educators);
  }

  showInfoModal(resultStr);
}

async function createEducator(educator) {
  const data = {
    firstName: educator.firstName,
    lastName: educator.lastName,
    middleName: educator.middleName,
    departmentId: educator.departmentId,
  };

  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    let newEmployee = await response.json();
    educators.push(newEmployee);
    return true;
  }
  return false;
}

async function updateEducator(educator) {
  const id = educator._id;
  const data = {
    firstName: educator.firstName,
    lastName: educator.lastName,
    middleName: educator.middleName,
    departmentId: educator.departmentId,
  };

  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    let updatedEducator = await response.json();
    let oldEducator = educators.find((e) => e._id == id);
    oldEducator.firstName = updatedEducator.firstName;
    oldEducator.lastName = updatedEducator.lastName;
    oldEducator.middleName = updatedEducator.middleName;
    oldEducator.departmentId = updatedEducator.departmentId;
    return true;
  }
  return false;
}

function groupEducatorsByDepartment(educators) {
  const grouped = educators.reduce((acc, educator) => {
    const { department_title } = educator;
    if (!acc[department_title]) {
      acc[department_title] = {
        department_title: department_title,
        employees: [],
      };
      acc[department_title].employees.push(educator);
    } else {
      acc[department_title].employees.push(educator);
    }
    return acc;
  }, {});

  return Object.values(grouped);
}

function showInfoModal(message) {
  $(".overlay, .info-popup").addClass("active");
  $(".popup.info-popup h2").text(message);
}

async function getDepartments() {
  const response = await fetch("/api/departments", {
    method: "GET",
    Accept: "application/json",
  });

  if (response.ok) {
    const result = await response.json();
    return result;
  }
  return [];
}

function initDepartmentsDropdown(departments) {
  const form = $("#create-edit-form");
  const departmentSelect = form.find("select[name='departmentId']");
  departmentSelect.empty();

  departmentSelect.append(
    $("<option>", {
      value: "",
      text: "Выберите кафедру",
      disabled: true,
      selected: true,
    })
  );

  for (dept of departments) {
    departmentSelect.append(new Option(dept.title, dept._id));
  }
}

function searchEducator() {
  let searchStr = $("#search").val().toLowerCase();

  let filtered = educators.filter((educator) =>
    `${educator.firstName} ${educator.middleName} ${educator.lastName}`
      .toLowerCase()
      .includes(searchStr)
  );

  renderContent(filtered);
}
