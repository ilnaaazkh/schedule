var educators = [
  {
    id: 0,
    firstName: "Сотников",
    middleName: "Сергей",
    lastName: "Викторович",
    department: "ПМИ",
    academicDegree: "к.т.н",
  },
  {
    id: 1,
    firstName: "Тутубалин",
    middleName: "Павел",
    lastName: "Иннокентьевич",
    department: "ПМИ",
    academicDegree: "к.т.н",
  },
  {
    id: 2,
    firstName: "Иванов",
    middleName: "Иван",
    lastName: "Иванович",
    department: "ИТ",
    academicDegree: "д.т.н",
  },
  {
    id: 3,
    firstName: "Петров",
    middleName: "Петр",
    lastName: "Петрович",
    department: "Биология",
    academicDegree: "д.б.н",
  },
  {
    id: 4,
    firstName: "Сидоров",
    middleName: "Алексей",
    lastName: "Александрович",
    department: "История",
    academicDegree: "к.ф.н",
  },
  {
    id: 5,
    firstName: "Кузнецова",
    middleName: "Екатерина",
    lastName: "Ивановна",
    department: "Литература",
    academicDegree: "к.ф.н",
  },
];

const getEducators = (_, res) => {
  res.status(200).send(educators);
};

module.exports = {
  getEducators,
};
