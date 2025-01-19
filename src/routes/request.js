const express = require("express");
const { userAuth } = require("../middleware/auth");

const requestRouter = express.Router();

requestRouter.post(
  "/sendConnectionRequest",
  userAuth,
  async (request, response) => {
    try {
      const { email } = request.user;
      response.status(200).send(`${email} has sent connection request.`);
    } catch (error) {
      response.status(400).send(`${error}`);
    }
  }
);

module.exports = { requestRouter };
