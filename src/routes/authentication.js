const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user");
const {
  validateSignup,
  validateLogin,
} = require("../utils/userDataValidation");

const authenticationRouter = express.Router();

authenticationRouter.post("/signup", async (request, response) => {
  const userData = new UserModel(request.body);
  try {
    validateSignup(request);
    userData.password = await bcrypt.hash(userData.password, 10);
    await userData.save();
    response.status(201).send({
      message: "Signup successful.",
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
    });
  } catch (error) {
    response.status(400).json({ message: `${error.message}` });
  }
});

authenticationRouter.post("/login", async (request, response) => {
  try {
    const token = await validateLogin(request);
    response.cookie("token", token);
    response
      .status(200)
      .send({ message: `${request.body.email} is logged in successfully.` });
  } catch (error) {
    response.status(400).json({ message: `${error.message}` });
  }
});

authenticationRouter.post("/logout", async (request, response) => {
  try {
    response.cookie("token", null, { expires: new Date(Date.now()) });
    response.status(200).send({ message: "Logged out successfully." });
  } catch (error) {
    response.status(400).json({ message: `${error.message}` });
  }
});

module.exports = { authenticationRouter };
