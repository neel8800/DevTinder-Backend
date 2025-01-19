const express = require("express");
const { userAuth } = require("../middleware/auth");

const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (request, response) => {
  try {
    const loggedInUser = request.user;
    response.status(200).send(loggedInUser);
  } catch (error) {
    response.status(400).send(`${error}`);
  }
});

module.exports = { profileRouter };
