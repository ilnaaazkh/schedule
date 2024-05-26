const days_of_weeks = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
lessonDurations = [
  "0",
  "8:00 - 9:30",
  "9:40 - 11:10",
  "11:20 - 12:50",
  "13:30 - 15:00",
  "15:10 - 16:40",
  "16:50 - 18:20",
];

const lessonCardColors = ["#F9B189", "#9BF3A4", "#EEAAEB", "#8AB6F9"];

$(document).ready(function () {
  if (getDateWeek(new Date()) % 2 == 1) {
    $("#week").prop("checked", true);
    $(".week > #weekLabel").text("Нечётная");
  } else {
    $(".week > #weekLabel").text("Чётная");
  }

  $("#week").change(function () {
    $(".week > #weekLabel").text(this.checked ? "Нечётная" : "Чётная");
  });
});

function getDateWeek(date) {
  const currentDate = typeof date === "object" ? date : new Date();
  const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
  const daysToNextMonday =
    januaryFirst.getDay() === 1 ? 0 : (7 - januaryFirst.getDay()) % 7;
  const nextMonday = new Date(
    currentDate.getFullYear(),
    0,
    januaryFirst.getDate() + daysToNextMonday
  );

  return currentDate < nextMonday
    ? 52
    : currentDate > nextMonday
    ? Math.ceil((currentDate - nextMonday) / (24 * 3600 * 1000) / 7)
    : 1;
}

function initSchedule() {
  const $schedule = $(".schedule");
  $schedule.empty();

  for (let i = 0; i < days_of_weeks.length; i++) {
    const day = $("<div>")
      .addClass("day")
      .attr("data-day", i + 1);
    day.append($("<div>").text(days_of_weeks[i]));
    $schedule.append(day);
  }
}

function getRandomLessonCardColor() {
  const randomIndex = Math.floor(Math.random() * lessonCardColors.length);
  return lessonCardColors[randomIndex];
}

function closeModal() {
  $(".overlay").removeClass("active");
  $(".overlay").children().removeClass("active");
}
