const express = require("express");
const bcrypt = require("bcrypt");
const { UserModel } = require("../models/user");
const {
  validateSignup,
  validateLogin,
} = require("../utils/userDataValidation");

const authRouter = express.Router();

authRouter.post("/signup", async (request, response) => {
  const userData = new UserModel(request.body);
  try {
    validateSignup(request);
    userData.password = await bcrypt.hash(userData.password, 10);
    await userData.save();
    response.status(201).send({ _id: userData._id });
  } catch (error) {
    response.status(400).send(`${error}`);
  }
});

authRouter.post("/login", async (request, response) => {
  try {
    const token = await validateLogin(request);
    response.cookie("token", token);
    response.status(200).send("Login successful.");
  } catch (error) {
    response.status(400).send(`${error}`);
  }
});

module.exports = { authRouter };
