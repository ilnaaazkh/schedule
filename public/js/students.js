const baseUrl = "/api/lessons";
let lessons = [];
let groups = [];
$(document).ready(async function () {
  $("#find-by-group").on("submit", onSearchByGroupSubmitted);
  $("input[name='group_code']").on("input", function () {
    $(this).removeClass("red-border");
  });

  $(".group-select").select2({
    placeholder: "4317",
    ajax: {
      url: "/api/groups",
      dataType: "json",
      delay: 250,
      processResults: function (data) {
        return {
          results: data.map((group) => ({
            id: group.group_code,
            text: group.group_code,
          })),
        };
      },
      cache: true,
    },
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

  console.log(group_code);

  let result = await getLessonsByGroup(group_code, week_parity);

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
      .attr("id", lesson._id)
      .on("click", showDetails)
      .css("background-color", getRandomLessonCardColor());

    const lessonInfo = $(`
    <div class="lesson__type">${lesson.lesson_type}</div>
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
    }. ${lesson.educator.lastName[0]}.</div>
  </div>
    `);

    lessonCard.append(lessonInfo);

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

function showDetails() {
  const id = $(this).attr("id");
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
