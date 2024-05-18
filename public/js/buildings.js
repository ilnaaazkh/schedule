const baseUrl = "/api/buildings";
let buildings = [];

$(document).ready(async function () {
  buildings = await getBuildings();
  renderContent(buildings);

  $(".add").on("click", showCreateEditModal);
  $(".closePopup").on("click", closeModal);

  $("#deleteForm").on("submit", onDeleteSubmited);
  $("#editCreateForm").on("submit", onEditCreateConfirmed);
  $("#search").on("input", searchBuilding);
});

async function getBuildings() {
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

function renderContent(buildings) {
  const $buildings = $(".buildings");
  $buildings.empty();

  if (buildings.length === 0) {
    const row = $("<div>Ничего не найдено</div>");
    $buildings.append(row);
    return;
  }

  buildings = buildings.sort((a, b) => a.number - b.number);

  for (let building of buildings) {
    const row = $("<div>").addClass("row");

    const buildingCard = $(
      `<div>${building.number} здание. ${building.address}</div>`
    )
      .addClass("card")
      .on("click", showCreateEditModal)
      .attr("id", building._id);

    const deleteButton = $("<button>")
      .addClass("delete")
      .text("Удалить")
      .attr("id", building._id)
      .on("click", showDeleteModal);

    row.append(buildingCard, deleteButton);
    $buildings.append(row);
  }
}

async function deleteBuilding(id) {
  let response = await fetch(baseUrl + `/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });

  if (response.ok) {
    let index = buildings.findIndex((b) => b._id == id);
    buildings.splice(index, 1);
    return true;
  }

  return false;
}

async function createBuilding(building) {
  let data = {
    number: building.number,
    address: building.address,
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
    let newBuilding = await response.json();
    buildings.push(newBuilding);
    return true;
  }
  return false;
}

async function updateBuilding(building) {
  let id = building._id;
  let data = {
    number: building.number,
    address: building.address,
  };

  let response = await fetch(baseUrl + `/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    let updatedBuilding = await response.json();
    let oldBuilding = buildings.find((b) => b._id == id);
    oldBuilding.number = updatedBuilding.number;
    oldBuilding.address = updatedBuilding.address;
    return true;
  }
  return false;
}

function closeModal() {
  $(".overlay").removeClass("active");
  $(".overlay").children().removeClass("active");
}

async function onDeleteSubmited(e) {
  e.preventDefault();

  let form = $("#deleteForm");
  let id = form.find('input[name="id"]').val();
  let result = await deleteBuilding(id);

  form.find('input[name="id"]').val("");
  closeModal();

  if (result) {
    showInfoModal("Здание успешно удалено");
    renderContent(buildings);
  } else {
    showInfoModal("Не удалось удалить здание");
  }
}

async function onEditCreateConfirmed(e) {
  e.preventDefault();

  let form = $("#editCreateForm");
  let id = form.find('input[name="id"]').val();
  let number = form.find('input[name="number"]').val();
  let address = form.find('input[name="address"]').val();

  let building = {
    _id: id,
    number: number,
    address: address,
  };

  form.find("input").val("");
  closeModal();

  let resultStr = "";
  let result;

  if (id == 0) {
    result = await createBuilding(building);
    resultStr = result
      ? "Здание успешно добавлено"
      : "Не удалось добавить здание";
  } else {
    result = await updateBuilding(building);
    resultStr = result
      ? "Здание успешно обновлено"
      : "Не удалось обновить здание";
  }

  if (result) {
    renderContent(buildings);
  }

  showInfoModal(resultStr);
}

function showInfoModal(message) {
  $(".overlay, .info-popup").addClass("active");
  $(".popup.info-popup h2").text(message);
}

function showCreateEditModal() {
  let elementId = $(this).attr("id");
  let form = $("#editCreateForm");
  if (elementId) {
    let building = buildings.find((b) => b._id == elementId);
    form.find("input[name='id']").val(building._id);
    form.find("input[name='number']").val(building.number);
    form.find("input[name='address']").val(building.address);
    form.find("h2").text("Редактировать здание");
  } else {
    form.find("h2").text("Создать здание");
    form.find("input[name='id']").val(0);
  }
  $(".overlay, .edit-popup").addClass("active");
}

function showDeleteModal() {
  let elementId = $(this).attr("id");
  $("#deleteForm").find("input[name='id']").val(elementId);
  $(".overlay, .delete-popup").addClass("active");
}

function searchBuilding() {
  let searchStr = $("#search").val();
  renderContent(
    buildings.filter((b) =>
      (b.number + b.address).toLowerCase().includes(searchStr.toLowerCase())
    )
  );
}
