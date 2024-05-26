const baseUrl = "/api/lessons";
let lessons = [];
let groups = [];
$(document).ready(async function () {
  groups = await getGroups();
  await loadGroupDatalist(groups);

  $(".closePopup").on("click", closeModal);

  $("#find-by-group").on("submit", onSearchByGroupSubmitted);
  $("input[name='group_code']").on("input", function () {
    $(this).removeClass("red-border");
  });

  $("#delete-form").on("submit", onDeleteSubmited);

  await loadEducatorsOnEditCreateForm();
  await loadBuildingsOnEditCreateForm();
});

async function getLessonsByGroup(group_code, week_parity) {
  const params = `?group_code=${group_code}&week_parity=${week_parity}`;
  const response = await fetch(`${baseUrl}${params}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    lessons = await response.json();
    return true;
  }
  lessons = [];
  return false;
}

async function onSearchByGroupSubmitted(e) {
  e.preventDefault();

  const form = $("#find-by-group");
  const group_code = form.find("input[name='group_code']").val();
  const week_parity = form.find("input[name='week_parity']").is(":checked")
    ? "Нечётная"
    : "Чётная";

  let result = false;
  if (groups.some((g) => g.group_code == group_code)) {
    result = await getLessonsByGroup(group_code, week_parity);
  } else {
    form.find("input[name='group_code']").addClass("red-border");
    return;
  }

  if (result) {
    renderContent();
  } else {
    $(".schedule").html(
      "<div>Что-то пошло не так. Повторите попытку позже</div>"
    );
  }
}

function renderContent() {
  initSchedule();

  lessons = lessons.sort((a, b) => a.lesson_number - b.lesson_number);

  for (let lesson of lessons) {
    const lessonCard = $("<div>")
      .addClass("lesson")
      .attr("data-id", lesson._id)
      .css("background-color", getRandomLessonCardColor());

    const lessonHeader = $("<div>").addClass("header");
    const deleteBtn = $("<a>Удалить</a>")
      .addClass("lesson__delete")
      .on("click", showDeleteModal)
      .attr("data-id", lesson._id);
    const lessonType = $(
      `<div class="lesson__type">${lesson.lesson_type}</div>`
    );
    lessonHeader.append(deleteBtn, lessonType);

    const lessonInfo = $(`
    <div data-id="${lesson._id}">
        <div class="lesson__discipline">
            ${lesson.discipline.title}
        </div>
        <div class="lesson__time">${lessonDurations[lesson.lesson_number]}</div>
        <div class="lesson__location">
        <span>${lesson.building.number} зд.</span>
        <span>${lesson.room_number} ауд.</span>
    </div>
    <div class="lesson__lecturer">${lesson.educator.middleName} ${
      lesson.educator.firstName[0]
    } ${lesson.educator.lastName[0]}</div>
    </div>
    <div>
    `).on("click", showCreateEditModal);

    lessonCard.append(lessonHeader, lessonInfo);

    const $schedule = $(".schedule");
    const $targetDay = $schedule.children().eq(lesson.day_of_week - 1);

    $targetDay.append(lessonCard);
  }

  $(".schedule")
    .children()
    .each(function () {
      const $day = $(this);
      if ($day.find(".lesson").length === 0) {
        const no_lessons = $("<div>")
          .text("Нет занятий")
          .css("margin-top", "50px");
        $day.append(no_lessons);
      }

      const addBtn = $("<button>")
        .addClass("add-lesson")
        .text("+")
        .on("click", showCreateEditModal)
        .attr("data-day", $day.data("day"));
      $day.append(addBtn);
    });
}

async function getGroups() {
  const response = await fetch("/api/groups", {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    let result = await response.json();
    return result;
  }
  return [];
}

async function loadGroupDatalist(groups) {
  const groups_input = $("input[name='group_code']");

  const datalist = $("<datalist id='groups'>");

  for (group of groups) {
    const opt = $("<option>").val(group.group_code).text(group.group_code);
    datalist.append(opt);
  }
  groups_input.after(datalist);
}

//Удалить потом
function showDetails() {
  const id = $(this).data("id");
  const lesson = lessons.find((lesson) => lesson._id == id);

  const content = $(`
  <h2>Подробности</h2>
  <a href="#" class="closePopup" onclick='closeModal()'>X</a>
  <div><b>Дисциплина</b>: ${lesson.discipline.title} (${lesson.lesson_type})</div>
  <div><b>Преподаватель</b>: ${lesson.educator.middleName} ${lesson.educator.firstName} ${lesson.educator.lastName}</div>
  <div><b>Аудитория</b>: ${lesson.room_number}</div>
  <div><b>Здание</b>: ${lesson.building.number}</div>
  <div><b>Адрес</b>: ${lesson.building.address}</div>
  `);

  $(".lesson-details")
    .html(content)
    .css("background-color", getRandomLessonCardColor())
    .css("color", "white");

  $(".overlay, .lesson-details").addClass("active");
}

function showDeleteModal() {
  const id = $(this).data("id");
  $("#delete-form").find("input[name='id']").val(id);
  $(".overlay, .delete-popup").addClass("active");
}

async function onDeleteSubmited(e) {
  e.preventDefault();

  const form = $("#delete-form");
  const id = form.find("input[name='id']").val();

  const result = await deleteLesson(id);

  form.find("input[name='id']").val("");
  closeModal();

  if (result) {
    let index = lessons.findIndex((l) => l._id == id);
    lessons.splice(index, 1);
    const lesson = $(`.lesson[data-id='${id}']`);
    const day = lesson.parent();

    lesson.remove();

    if (day.children(".lesson").length === 0) {
      const no_lessons = $("<div>")
        .text("Нет занятий")
        .css("margin-top", "50px");
      day.find(".add-lesson").before(no_lessons);
    }

    showInfoModal("Занятие удалено из расписания");
  } else {
    showInfoModal("Не удалось удалить заняите из расписания");
  }
}

async function deleteLesson(id) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    return true;
  }
  return false;
}

function showInfoModal(message) {
  $(".overlay, .info-popup").addClass("active");
  $(".popup.info-popup h2").text(message);
}

function showCreateEditModal() {
  const form = $("#edit-create-lesson-form");
  const id = $(this).data("id");

  form.find("h2").text(id ? "Редактировать занятие" : "Добавить занятие");

  $(".overlay, .edit-popup").addClass("active");
}

async function getAdditionalInfo(path) {
  // Для подтягивания вариантов ответа на форму
  const response = await fetch(`/api/${path}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (response.ok) {
    let result = await response.json();
    return result;
  }

  return [];
}

async function loadEducatorsOnEditCreateForm() {
  const educators = await getAdditionalInfo("educators");
  const dataset = $("#educators");

  for (let educator of educators) {
    const note = `${educator.middleName} ${educator.firstName} ${educator.lastName}`;
    const option = $("<option>").val(note);
    option.attr("data-first-name", educator.firstName);
    option.attr("data-middle-name", educator.middleName);
    option.attr("data-last-name", educator.lastName);
    option.attr("data-id", educator._id);
    dataset.append(option);
  }
}

async function loadBuildingsOnEditCreateForm() {
  const buildings = await getAdditionalInfo("buildings");

  const select = $("#buildings-select");
  for (let build of buildings) {
    const note = `${build.number} здание. ${build.address}`;
    const option = $("<option>").val(note);
    option.attr("data-id", build._id);
    option.attr("data-number", build.number);
    option.attr("data-address", build.address);
    select.append(option);
  }
}
