const baseUrl = "/api/auth/";
let users = [];

$(document).ready(async function () {
  users = await getUsers();
  renderContent(users);

  $(".add").on("click", showCreateModal);
  $(".closePopup").on("click", closeModal);

  $("#delete-form").submit(onDeleteSubmited);
  $("#create-form").submit(onCreateSubmited);
});

async function getUsers() {
  const response = await fetch(`${baseUrl}/users`);

  if (response.ok) {
    const result = await response.json();
    return result;
  }
  return [];
}

function renderContent(users) {
  $empls = $(".empls");
  $empls.empty();

  if (users.length === 0) {
    const row = $("<div>Ничего не найдено</div>");
    $empls.append(row);
    return;
  }

  for (let user of users) {
    const row = $("<div>").addClass("row").attr("data-id", user._id);

    const userCard = $(`<div>${user.username}</div>`)
      .addClass("card")
      .attr("data-id", user._id);

    const deleteButton = $("<button>")
      .addClass("delete")
      .text("Удалить")
      .attr("data-id", user._id)
      .on("click", showDeleteModal);

    row.append(userCard, deleteButton);
    $empls.append(row);
  }
}

function showDeleteModal() {
  let elementId = $(this).data("id");
  $("#delete-form").find("input[name='id']").val(elementId);
  $(".overlay, .delete-popup").addClass("active");
}

async function deleteUser(id) {
  const response = await fetch(`${baseUrl}/users/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return true;
  }
  return false;
}

async function onDeleteSubmited(e) {
  e.preventDefault();

  const form = $("#delete-form");
  const id = form.find('input[name="id"]').val();
  const result = await deleteUser(id);

  form.find('input[name="id"]').val("");
  closeModal();

  if (result) {
    $(`.row[data-id='${id}']`).remove();
    users = users.filter((x) => x._id != id);
    showInfoModal("Пользователь удален");
  } else {
    showInfoModal("Не удалось удалить пользователя");
  }
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

function showCreateModal() {
  $(".overlay, .edit-popup").addClass("active");
}

async function onCreateSubmited(e) {
  e.preventDefault();

  const form = $("#create-form");
  const username = form.find("input[name='username']").val();
  const password = form.find("input[name='password']").val();

  closeModal();
  result = await createUser(username, password);
  if (result) {
    renderContent(users);
    showInfoModal("Пользователь успешно добавлен");
    return;
  }
  showInfoModal("Не удалось добавить пользователя");
}

async function createUser(username, password) {
  const response = await fetch(`${baseUrl}registration`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (response.ok) {
    const data = await response.json();
    users.push(data);
    return true;
  }

  return false;
}
