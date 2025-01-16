const { Schema, model } = require("mongoose");
const schemaValidator = require("validator");
const { genderEnum } = require("../constants/userSchemaConstants");

/* User schema definition */
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: [true, "Email address is required."],
      unique: true,
      validate: {
        validator: (value) => schemaValidator.isEmail(value),
        message: (props) => `${props.value} is not a valid email.`,
      },
    },
    age: {
      type: Number,
      required: true,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      enum: {
        values: genderEnum,
        message: (props) =>
          `"${props.value}" is not a valid gender value. Allowed gender values are ${genderEnum}`,
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) =>
          schemaValidator.isStrongPassword(value, {
            minLength: 8,
            minLowercase: 2,
            minUppercase: 2,
            minNumbers: 1,
            minSymbols: 2,
          }),
        message: (props) => `${props.value} is not a strong password.`,
      },
    },
    skills: {
      type: [String],
      default: [],
      validate(value) {
        if (value.length > 10) {
          throw new Error("You can add maximum 10 skills.");
        }
      },
    },
    about: {
      type: String,
      default: "",
    },
    photoUrl: {
      type: String,
      validate: {
        validator: (value) => schemaValidator.isURL(value),
        message: (props) => `${props.value} is not a valid photo URL.`,
      },
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fcommons.wikimedia.org%2Fwiki%2FFile%3ASample_User_Icon.png&psig=AOvVaw2yjmfBhp-5SGcDqbugBQFk&ust=1737044417490000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCMCurO6Q-IoDFQAAAAAdAAAAABAE",
    },
  },
  {
    timestamps: true,
    collection: "users",
  }
);

/* User model creation */
const UserModel = model("UserModel", userSchema);

module.exports = { UserModel };
