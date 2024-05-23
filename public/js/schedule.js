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
