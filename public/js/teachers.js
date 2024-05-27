const baseUrl = "/api/lessons";
let lessons = [];

$(document).ready(async function () {
  $("#find-by-educator").on("submit", onSearchByEducatorSubmited);
  $("input[name='educator_name']").on("input", function () {
    $(this).removeClass("red-border");
  });

  $(".teacher-select").select2({
    placeholder: "Иванов И.И.",
    ajax: {
      url: "/api/educators",
      dataType: "json",
      delay: 250,
      processResults: mapTeachersToOptions,
      cache: true,
    },
  });
});

async function getLessonsByTeacher(educatorId, week_parity) {
  const params = `?educatorId=${educatorId}&week_parity=${week_parity}`;
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

async function onSearchByEducatorSubmited(e) {
  e.preventDefault();

  form = $("#find-by-educator");
  let week_parity = form.find("input[name='week_parity']").is(":checked")
    ? "Нечётная"
    : "Чётная";

  const teacher = $(".teacher-select").val();

  let result = await getLessonsByTeacher(teacher, week_parity);

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
      <div class="lesson__lecturer">Группы: ${lesson.groups
        .map((g) => g.group_code)
        .join(", ")}</div>
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

function showDetails() {
  const id = $(this).attr("id");
  const lesson = lessons.find((lesson) => lesson._id == id);

  const content = $(`
    <h2>Подробности</h2>
    <a href="#" class="closePopup" onclick='closeModal()'>X</a>
    <div><b>Дисциплина</b>: ${lesson.discipline.title} (${
    lesson.lesson_type
  })</div>
    <div><b>Преподаватель</b>: ${lesson.educator.middleName} ${
    lesson.educator.firstName
  } ${lesson.educator.lastName}</div>
    <div><b>Группы: </b> ${lesson.groups
      .map((g) => g.group_code)
      .join(", ")}</div>
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

function mapTeachersToOptions(data, params) {
  if (!params.term) {
    return {
      results: data.map((educator) => ({
        id: educator._id,
        text: `${educator.middleName} ${educator.firstName} ${educator.lastName}`,
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
    })),
  };
}
