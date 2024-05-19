const baseUrl = "/api/groups";
let groups = [];

$(document).ready(async function () {
  groups = await getGroups();
  renderContent(groups);

  $(".closePopup").on("click", closeModal);
  $(".add").on("click", showCreateEditModal);

  $("#deleteForm").on("submit", onDeleteSubmited);
  $("#editCreateForm").on("submit", onCreateEditConfirmed);
  $("#search").on("input", searchGroup);
});

async function getGroups() {
  const response = await fetch(baseUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    data = await response.json();
    return data;
  }
  return [];
}

function renderContent(groups) {
  $groups = $(".groups");
  $groups.empty();

  if (groups.length == 0) {
    const row = $("<div>Ничего не найдено</div>");
    $groups.append(row);
    return;
  }

  for (group of groups) {
    const row = $("<div>").addClass("row");

    const groupCard = $(`<div>${group.group_code}</div>`)
      .addClass("card")
      .attr("id", group._id)
      .on("click", showCreateEditModal);

    const deleteBtn = $(`<button>`)
      .text("Удалить")
      .addClass("delete")
      .attr("id", group._id)
      .on("click", showDeleteModal);

    row.append(groupCard, deleteBtn);
    $groups.append(row);
  }
}

function showDeleteModal() {
  const id = $(this).attr("id");
  $("#deleteForm").find("input[name='id']").val(id);
  $(".overlay, .delete-popup").addClass("active");
}

async function onDeleteSubmited(e) {
  e.preventDefault();

  const form = $("#deleteForm");
  const id = form.find('input[name="id"]').val();
  let result = await deleteGroup(id);

  form.find('input[name="id"]').val("");
  closeModal();

  if (result) {
    showInfoModal("Группа успешно удалена");
    renderContent(groups);
  } else {
    showInfoModal("Не удалось удлаить кафедру");
  }
}

async function deleteGroup(id) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    let index = groups.findIndex((g) => g._id == id);
    groups.splice(index, 1);
    return true;
  }

  return false;
}

function showCreateEditModal() {
  const id = $(this).attr("id");
  const form = $("#editCreateForm");

  if (id) {
    let group = groups.find((g) => g._id == id);
    form.find("h2").text("Редактировать группу");
    form.find('input[name="id"]').val(group._id);
    form.find('input[name="group_code"]').val(group.group_code);
  } else {
    form.find("h2").text("Добавить группу");
    form.find('input[name="id"]').val(0);
  }

  $(".overlay, .edit-popup").addClass("active");
}

async function onCreateEditConfirmed(e) {
  e.preventDefault();

  const form = $("#editCreateForm");
  const id = form.find("input[name='id']").val();
  const group_code = form.find('input[name="group_code"]').val();

  let group = {
    _id: id,
    group_code: group_code,
  };

  form.find("input").val("");
  closeModal();

  let resultStr = "";
  let result;

  if (id == 0) {
    result = await createGroup(group);
    resultStr = result
      ? "Новая группа успешно добавлена"
      : "Не удалось добавить новую группу";
  } else {
    result = await editGroup(group);
    resultStr = result
      ? "Группа успешно обновлена"
      : "Не удалось обновить группу";
  }

  if (result) {
    renderContent(groups);
  }

  showInfoModal(resultStr);
}

async function createGroup(group) {
  const data = {
    group_code: group.group_code,
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
    let newGroup = await response.json();
    groups.push(newGroup);
    return true;
  }

  return false;
}

async function editGroup(group) {
  const id = group._id;
  const data = {
    group_code: group.group_code,
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
    let updatedGroup = await response.json();
    let oldGroup = groups.find((g) => g._id == id);
    oldGroup.group_code = updatedGroup.group_code;
    return true;
  }
  return false;
}

function showInfoModal(message) {
  $(".overlay, .info-popup").addClass("active");
  $(".popup.info-popup h2").text(message);
}

function closeModal() {
  $(".overlay").removeClass("active");
  $(".overlay").children().removeClass("active");
  $("form>input").val("");
}

function searchGroup() {
  let searchStr = $("#search").val().toLowerCase();
  renderContent(
    groups.filter((g) => g.group_code.toString().includes(searchStr))
  );
}
