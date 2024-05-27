const baseUrl = "/api/lessons";
let lessons = [];

$(document).ready(async function () {
  $(".closePopup").on("click", closeModal);
  $("#find-by-group").on("submit", onSearchByGroupSubmitted);
  $("#delete-form").on("submit", onDeleteSubmited);
  $("edit-create-lesson-from").on("submit", onEditCreateSubmited);

  $(".group-select").select2({
    placeholder: "4317",
    ajax: {
      url: "/api/groups",
      dataType: "json",
      delay: 250,
      processResults: mapGroupsToOptions,
    },
    cache: true,
  });

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
  const group_code = $(".group-select").val();
  const week_parity = form.find("input[name='week_parity']").is(":checked")
    ? "Нечётная"
    : "Чётная";

  result = await getLessonsByGroup(group_code, week_parity);

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
      .attr("data-day", lesson.day_of_week)
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
  const day = $(this).parent().data("day");

  form.find("h2").text(id ? "Редактировать занятие" : "Добавить занятие");
  form.find("input[name='id']").val(id ?? 0);
  form
    .find("input[name='week_parity']")
    .val($("#week").is(":checked") ? "Нечётная" : "Чётная");
  form.find("input[name='day_of_week']").val(day);

  renderDisciplinesSelect();

  $(".overlay, .edit-popup").addClass("active");
}

function onEditCreateSubmited(e) {
  e.preventDefault();
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

function mapGroupsToOptions(data, params) {
  if (!params.term) {
    return {
      results: data.map((group) => ({
        id: group.group_code,
        text: group.group_code,
      })),
    };
  }

  const filteredData = data.filter((group) => {
    const searchTerm = params.term.toLowerCase();
    return group.group_code.toLowerCase().indexOf(searchTerm) !== -1;
  });

  return {
    results: filteredData.map((group) => ({
      id: group.group_code,
      text: group.group_code,
    })),
  };
}

function renderDisciplinesSelect() {
  $(".discipline-select").select2({
    placeholder: "Выберите дисциплину",
    ajax: {
      url: "/api/disciplines",
      dataType: "json",
      delay: 250,
      processResults: mapDisciplinesToOption,
      cache: true,
    },
  });
}

function mapDisciplinesToOption(data, params) {
  if (!params.term) {
    return {
      results: data.map((discipline) => ({
        id: discipline.title,
        text: discipline.title,
        data: {
          id: discipline._id,
        },
      })),
    };
  }

  const filteredData = data.filter((discipline) => {
    const searchTerm = params.term.toLowerCase();
    return discipline.title.toLowerCase().indexOf(searchTerm) !== -1;
  });

  return {
    results: filteredData.map((discipline) => ({
      id: discipline.title,
      text: discipline.title,
      data: {
        id: discipline._id,
      },
    })),
  };
}
