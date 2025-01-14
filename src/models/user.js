const { Schema, model } = require("mongoose");

/* User schema definition */
const userSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  {
    collection: "users",
  }
);

/* User model creation */
const UserModel = model("UserModel", userSchema);

module.exports = { UserModel };
