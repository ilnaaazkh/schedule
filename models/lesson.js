const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Educator = require("./educator");
const Building = require("./building");
const Discipline = require("./discipline");
const Group = require("./group");

const educatorScheme = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const buildingScheme = new Schema(
  {
    address: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      required: true,
    },
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const disciplineScheme = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    versionKey: false,
  }
);

const groupScheme = new Schema(
  {
    group_code: {
      type: String,
      required: false,
    },
    _id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { versionKey: false }
);

const lessonScheme = new Schema(
  {
    educator: {
      type: educatorScheme,
      required: true,
    },
    lesson_type: {
      type: String,
      required: true,
      enum: ["Лекция", "Практика", "Лаб.раб."],
    },
    lesson_number: {
      type: Number,
      required: true,
    },
    building: {
      type: buildingScheme,
      required: true,
    },
    parity: {
      type: String,
      required: true,
      enum: ["Чётная", "Нечётная", "Любая"],
    },
    room_number: {
      type: Number,
      required: true,
    },
    day_of_week: {
      type: Number,
      required: true,
    },
    discipline: {
      type: disciplineScheme,
      required: true,
    },
    groups: [
      {
        type: groupScheme,
        required: true,
      },
    ],
  },
  {
    versionKey: false,
  }
);

lessonScheme.pre("save", async function (next) {
  try {
    const educatorExists = await Educator.exists({ _id: this.educator._id });
    const buildingExists = await Building.exists({ _id: this.building._id });
    const disciplineExists = await Discipline.exists({
      _id: this.discipline._id,
    });
    const groupsExist = await Promise.all(
      this.groups.map((group) => Group.exists({ _id: group._id }))
    );

    if (!educatorExists) {
      throw new Error("Educator does not exist");
    }

    if (!buildingExists) {
      throw new Error("Building does not exist");
    }

    if (!disciplineExists) {
      throw new Error("Discipline does not exist");
    }

    if (groupsExist.includes(false)) {
      throw new Error("One or more groups do not exist");
    }

    next();
  } catch (error) {
    next(error);
  }
});

const Lesson = mongoose.model("Lesson", lessonScheme);

module.exports = Lesson;
