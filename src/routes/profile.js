const express = require("express");
const { userAuth } = require("../middleware/auth");
const { validateUpdateUserData } = require("../utils/userDataValidation");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (request, response) => {
  try {
    const loggedInUser = request.user;
    response.status(200).send(loggedInUser);
  } catch (error) {
    response.status(400).send(`${error}`);
  }
});

profileRouter.patch("/profile/edit", userAuth, async (request, response) => {
  try {
    if (!(await validateUpdateUserData(request))) {
      throw new Error("Invalid update request.");
    }
    const loggedInUser = request.user;
    Object.keys(request.body).forEach((field) => {
      loggedInUser[field] = request.body[field];
    });
    await loggedInUser.save();
    response.status(200).send(loggedInUser);
  } catch (error) {
    response.status(400).send(`${error}`);
  }
});

module.exports = { profileRouter };
