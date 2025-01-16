const validator = require("validator");
const { UserModel } = require("../models/user");
const bcrypt = require("bcrypt");

const validateSignup = (request) => {
  const signupData = request.body;
  if (signupData.firstName?.length < 4 || signupData.firstName?.length > 50) {
    throw new Error("First name is not valid.");
  }
  if (!validator.isEmail(signupData.email)) {
    throw new Error("Email is not valid.");
  }
  if (!validator.isStrongPassword(signupData.password)) {
    throw new Error("Please enter a strong password.");
  }
};

const validateLogin = async (request) => {
  const { email, password } = request.body;
  const userWithEmail = await UserModel.findOne({ email: email });

  if (!userWithEmail) {
    throw new Error("Invalid Credentials.");
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    userWithEmail.password
  );
  if (!isPasswordValid) {
    throw new Error("Invalid Credentials.");
  }
};

module.exports = { validateSignup, validateLogin };
