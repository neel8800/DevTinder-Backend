const express = require("express");
const { userAuth } = require("../middleware/auth");
const { UserModel } = require("../models/user");
const { connectionRequestModel } = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (request, response) => {
    try {
      /* Initializing required variables */
      const fromUserId = request.user._id;
      const toUserId = request.params.toUserId;
      const connectionRequestStatus = request.params.status;

      /* Throw an error if API request triggered with status except "interested" and "ignored" */
      const allowedStatus = ["interested", "ignored"];
      if (!allowedStatus.includes(connectionRequestStatus)) {
        throw new Error("Invalid connection request status.");
      }

      /* Throw an error if user tries to send connection request to self */
      if (fromUserId.equals(new mongoose.Types.ObjectId(toUserId))) {
        throw new Error("Can not send connection request to self.");
      }

      /* Throw an error if toUser does not exist */
      const toUser = await UserModel.findById(toUserId);
      if (!toUser) {
        throw new Error("User not found to send connection request.");
      }

      /* Throw an error if connection request with given to and from userId already exist */
      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId: fromUserId, toUserId: toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      console.log(existingConnectionRequest);
      if (existingConnectionRequest) {
        throw new Error("Connection request already exist.");
      }

      /* Creating and saving connection request */
      const newConnectionRequest = new connectionRequestModel({
        fromUserId: fromUserId,
        toUserId: toUserId,
        connectionRequestStatus: connectionRequestStatus,
      });
      await newConnectionRequest.save();
      response.status(200).send(newConnectionRequest);
    } catch (error) {
      response.status(400).json({ message: `${error.message}` });
    }
  }
);

module.exports = { requestRouter };
