const baseUrl = "/api/departments";
let departments = [];

$(document).ready(async function () {
  departments = await getDepartments();
  renderContent(departments);

  $(".add").on("click", showCreateEditModal);
  $(".closePopup").on("click", closeModal);

  $("#deleteForm").on("submit", onDeleteSubmited);
  $("#editCreateForm").on("submit", onEditCreateConfirmed);
  $("#search").on("input", searchDept);
});

async function getDepartments() {
  let response = await fetch(baseUrl, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (response.ok) {
    let result = await response.json();
    return result;
  }

  return [];
}

function renderContent(departments) {
  const $deps = $(".departments");
  $deps.empty();

  if (departments.length === 0) {
    const row = $("<div>Ничего не найдено</div>");
    $deps.append(row);
    return;
  }

  for (let department of departments) {
    const row = $("<div>").addClass("row");

    const departmentCard = $(
      `<div>${department.title} (${department.short_title})</div>`
    )
      .addClass("card")
      .attr("id", department._id)
      .on("click", showCreateEditModal);

    const deleteButton = $("<button>")
      .addClass("delete")
      .text("Удалить")
      .attr("id", department._id)
      .on("click", showDeleteModal);

    row.append(departmentCard, deleteButton);
    $deps.append(row);
  }
}

function showDeleteModal() {
  let id = $(this).attr("id");
  $("#deleteForm").find("input[name='id']").val(id);
  $(".overlay, .delete-popup").addClass("active");
}

async function onDeleteSubmited(e) {
  e.preventDefault();

  let form = $("#deleteForm");
  let id = form.find('input[name="id"]').val();
  let result = await deleteDepartment(id);

  form.find('input[name="id"]').val("");
  closeModal();

  if (result) {
    showInfoModal("Кафедра успешно удалена");
    renderContent(departments);
  } else {
    showInfoModal("Не удалось удалить кафедру");
  }
}

async function deleteDepartment(id) {
  let response = await fetch(baseUrl + `/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (response.ok) {
    let index = departments.findIndex((b) => b._id == id);
    departments.splice(index, 1);
    return true;
  }

  return false;
}

function showCreateEditModal(e) {
  e.preventDefault();

  let id = $(this).attr("id");
  let form = $("#editCreateForm");

  if (id) {
    let dep = departments.find((d) => d._id == id);
    form.find("input[name='id']").val(dep._id);
    form.find("input[name='title']").val(dep.title);
    form.find("input[name='short_title']").val(dep.short_title);
    form.find("h2").text("Редактировать кафедру");
  } else {
    form.find("h2").text("Добавить кафедру");
    form.find("input[name='id']").val(0);
  }

  $(".overlay, .edit-popup").addClass("active");
}

async function onEditCreateConfirmed(e) {
  e.preventDefault();

  let form = $("#editCreateForm");
  let id = form.find("input[name='id']").val();
  let title = form.find("input[name='title']").val();
  let short_title = form.find("input[name='short_title']").val();

  let department = {
    _id: id,
    title: title,
    short_title: short_title,
  };

  form.find("input").val("");
  closeModal();

  let resultStr = "";
  let result;

  if (id == 0) {
    result = await createDepartment(department);
    resultStr = result
      ? "Кафедра успешно добавлена"
      : "Не удалось добавить кафедру";
  } else {
    result = await updateDepartment(department);
    resultStr = result
      ? "Кафедра успешно обновлена"
      : "Не удалось обновить кафедру";
  }

  if (result) {
    renderContent(departments);
  }

  showInfoModal(resultStr);
}

async function createDepartment(department) {
  let data = {
    title: department.title,
    short_title: department.short_title,
  };

  let response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    let newDepartment = await response.json();
    departments.push(newDepartment);
    return true;
  }
  return false;
}

async function updateDepartment(department) {
  let id = department._id;
  let data = {
    title: department.title,
    short_title: department.short_title,
  };

  let response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    let updatedDept = await response.json();
    let oldDept = departments.find((d) => d._id == id);
    oldDept.title = updatedDept.title;
    oldDept.short_title = updatedDept.short_title;
    return true;
  }
  return false;
}

function closeModal() {
  $(".overlay").removeClass("active");
  $(".overlay").children().removeClass("active");
  $("form>input").val("");
}

function showInfoModal(message) {
  $(".overlay, .info-popup").addClass("active");
  $(".popup.info-popup h2").text(message);
}

function searchDept() {
  let searchStr = $("#search").val().toLowerCase();
  renderContent(
    departments.filter((d) =>
      (d.title + " " + d.short_title).toLowerCase().includes(searchStr)
    )
  );
}
