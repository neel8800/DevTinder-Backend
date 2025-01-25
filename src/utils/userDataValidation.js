const validator = require("validator");
const { UserModel } = require("../models/user");
const { allowedUpdateFields } = require("../constants/userSchemaConstants");

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
  if (!email || !password) {
    throw new Error("Email and password required.");
  }

  const userWithEmail = await UserModel.findOne({ email: email });
  const isValidPassword = await userWithEmail.validatePassword(password);
  if (!userWithEmail || !isValidPassword) {
    throw new Error("Invalid Credentials.");
  }

  return await userWithEmail.getJWT();
};

const validateUpdateUserData = async (request) => {
  const userData = request.body;
  const isUpdateAllowed = Object.keys(userData).every((field) =>
    allowedUpdateFields.includes(field)
  );

  return isUpdateAllowed;
};

module.exports = { validateSignup, validateLogin, validateUpdateUserData };
