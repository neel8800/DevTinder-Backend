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
  if (!userWithEmail) {
    throw new Error("Invalid Credentials.");
  }

  const isValidPassword = await userWithEmail.validatePassword(password);
  if (!isValidPassword) {
    throw new Error("Invalid Credentials.");
  }

  try {
    return await userWithEmail.getJWT();
  } catch (error) {
    throw new Error(`${error}`);
  }
};

const validateUpdateUserData = async (request) => {
  const userData = request.body;
  const isUpdateAllowed = Object.keys(userData).every((field) =>
    allowedUpdateFields.includes(field)
  );
  console.log(`isUpdateAllowed: ${isUpdateAllowed}`);

  return isUpdateAllowed;
};

module.exports = { validateSignup, validateLogin, validateUpdateUserData };
