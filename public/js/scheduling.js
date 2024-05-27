const baseUrl = "/api/lessons";
let lessons = [];

$(document).ready(async function () {
  $(".closePopup").on("click", closeModal);
  $("#find-by-group").on("submit", onSearchByGroupSubmitted);
  $("#delete-form").on("submit", onDeleteSubmited);
  $("#edit-create-lesson-form").on("submit", onEditCreateSubmited);

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
  renderEducatorSelect();
  renderTimeSelect();
  renderBuildingSelect();
  renderGroupsSelect();

  $(".overlay, .edit-popup").addClass("active");
}

async function createLesson(lesson) {
  const response = await fetch(baseUrl, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lesson),
  });

  if (response.ok) {
    const result = await response.json();
    lessons.push(result);
    return true;
  }
  return false;
}

async function updateLesson(id, lesson) {
  const response = await fetch(`${baseUrl}/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(lesson),
  });

  if (response.ok) {
    const result = await response.json();
    let index = lessons.findIndex((l) => l._id == result._id);
    if (index > -1) {
      lessons[index] = result;
    }
    return true;
  }
  return false;
}

async function onEditCreateSubmited(e) {
  e.preventDefault();
  const form = $("#edit-create-lesson-form");

  const id = form.find("input[name='id']").val();

  const lesson = getLessonFromForm();

  closeModal();

  let resultStr = "";
  let result;

  if (id == 0) {
    result = await createLesson(lesson);
    resultStr = result
      ? "Новое занятие успешно добавлено"
      : "Не удалось добавить занятие";
  } else {
    result = await updateLesson(id, lesson);
    resultStr = result
      ? "Занятие успешно обновлено"
      : "Не удалось обновить занятие";
  }

  if (result) {
    renderContent();
  }

  showInfoModal(resultStr);
}

function renderDisciplinesSelect() {
  $(".discipline-select").select2({
    placeholder: "Выберите дисциплину",
    width: "100%",
    ajax: {
      url: "/api/disciplines",
      dataType: "json",
      delay: 250,
      processResults: mapDisciplinesToOption,
      cache: true,
    },
  });
}

function renderEducatorSelect() {
  $(".educator-select").select2({
    placeholder: "Иванов И.И.",
    width: "100%",
    ajax: {
      url: "/api/educators",
      dataType: "json",
      delay: 250,
      processResults: mapTeachersToOptions,
      cache: true,
    },
  });
}

function renderTimeSelect() {
  const select = $("#time").empty();

  for (let i = 0; i < lessonDurations.length; i++) {
    const option = $("<option>")
      .val(i + 1)
      .text(lessonDurations[i]);
    select.append(option);
  }
}

function renderBuildingSelect() {
  $(".building-select").select2({
    placeholder: "Учебное здание",
    width: "100%",
    ajax: {
      url: "/api/buildings",
      dataType: "json",
      delay: 250,
      processResults: mapBuildingsToOptions,
      cache: true,
    },
  });
}

function renderGroupsSelect() {
  $(".groups-select").select2({
    placeholder: "4317",
    multiple: true,
    width: "100%",
    ajax: {
      url: "/api/groups",
      dataType: "json",
      delay: 250,
      processResults: mapGroupsToOptions,
    },
    cache: true,
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

function mapTeachersToOptions(data, params) {
  if (!params.term) {
    return {
      results: data.map((educator) => ({
        id: educator._id,
        text: `${educator.middleName} ${educator.firstName} ${educator.lastName}`,
        data: {
          id: educator._id,
          firstName: educator.firstName,
          lastName: educator.lastName,
          middleName: educator.middleName,
        },
      })),
    };
  }

  const filteredData = data.filter((educator) => {
    const fullName =
      `${educator.middleName} ${educator.firstName} ${educator.lastName}`.toLowerCase();
    const searchTerm = params.term.toLowerCase();
    return fullName.includes(searchTerm);
  });

  return {
    results: filteredData.map((educator) => ({
      id: educator._id,
      text: `${educator.middleName} ${educator.firstName} ${educator.lastName}`,
      data: {
        id: educator._id,
        firstName: educator.firstName,
        lastName: educator.lastName,
        middleName: educator.middleName,
      },
    })),
  };
}

function mapBuildingsToOptions(data, params) {
  if (!params.term) {
    return {
      results: data.map((building) => ({
        id: building._id,
        text: `${building.number} здание. ${building.address}`,
        data: {
          id: building._id,
          number: building.number,
          address: building.address,
        },
      })),
    };
  }

  const filteredData = data.filter((building) => {
    const text = `${building.number} ${building.address}`.toLowerCase();
    const searchTerm = params.term.toLowerCase();
    return text.includes(searchTerm);
  });

  return {
    results: filteredData.map((building) => ({
      id: building._id,
      text: `${building.number} здание. ${building.address}`,
      data: {
        id: building._id,
        number: building.number,
        address: building.address,
      },
    })),
  };
}

function mapGroupsToOptions(data, params) {
  if (!params.term) {
    return {
      results: data.map((group) => ({
        id: group.group_code,
        text: group.group_code,
        data: {
          id: group._id,
          group_code: group.group_code,
        },
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
      data: {
        id: group._id,
        group_code: group.code,
      },
    })),
  };
}

function getDisciplineFromForm() {
  let selectedData = $(".discipline-select").select2("data")[0];
  let discipline = {
    _id: selectedData.data.id,
    title: selectedData.text,
  };
  return discipline;
}

function getEducatorFromForm() {
  let selectedData = $(".educator-select").select2("data")[0];
  let discipline = {
    _id: selectedData.data.id,
    firstName: selectedData.data.firstName,
    middleName: selectedData.data.middleName,
    lastName: selectedData.data.lastName,
  };
  return discipline;
}

function getBuildingFromForm() {
  let selectedData = $(".building-select").select2("data")[0];
  let building = {
    _id: selectedData.data.id,
    number: selectedData.data.number,
    address: selectedData.data.address,
  };
  return building;
}

function getGroupsFromForm() {
  let selectedData = $(".groups-select").select2("data");
  let groups = [];

  for (item of selectedData) {
    group = {
      _id: item.data.id,
      group_code: item.data.group_code,
    };
    groups.push(group);
  }

  return groups;
}

function getLessonFromForm() {
  const form = $("#edit-create-lesson-form");
  const parity = form.find("input[name='week_parity']").val();
  const day_of_week = form.find("input[name='day_of_week']").val();

  const discipline = getDisciplineFromForm();
  const educator = getEducatorFromForm();
  const lesson_number = $("#time").val();
  const lesson_type = $("#lesson-type").val();
  const building = getBuildingFromForm();
  const room_number = $("#room-number").val();
  const groups = getGroupsFromForm();

  lesson = {
    educator: educator,
    lesson_type: lesson_type,
    lesson_number: lesson_number,
    building: building,
    parity: parity,
    room_number: room_number,
    day_of_week: day_of_week,
    discipline: discipline,
    groups: groups,
  };

  return lesson;
}

function closeModal() {
  $(".overlay").removeClass("active");
  $(".overlay").children().removeClass("active");
  $(".control>input").val("");
}
