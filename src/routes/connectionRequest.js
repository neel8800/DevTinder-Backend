const express = require("express");
const { userAuth } = require("../middleware/auth");
const { UserModel } = require("../models/user");
const { connectionRequestModel } = require("../models/connectionRequest");
const { default: mongoose } = require("mongoose");
const {
  validSendRequestStatuses,
  validReviewRequestStatuses,
} = require("../constants/connectionRequestSchemaConstants");

const connectionRequestRouter = express.Router();

connectionRequestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (request, response) => {
    try {
      /* Initializing required variables */
      const fromUserId = request.user._id;
      const toUserId = request.params.toUserId;
      const connectionRequestStatus = request.params.status;

      /* Throw an error if API request triggered with status except "interested" and "ignored" */
      if (!validSendRequestStatuses.includes(connectionRequestStatus)) {
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

connectionRequestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (request, response) => {
    try {
      const loggedInUser = request.user;
      const reviewRequestStatus = request.params.status;
      const reviewRequestId = request.params.requestId;

      /* Validate the status from API params */
      if (!validReviewRequestStatuses.includes(reviewRequestStatus)) {
        throw new Error("Invalid review request status.");
      }

      /* Check for requestId in database with:
        - requestId should be valid
        - toUser == loggedInUser
        - connectionRequestStatus == interested
      */
      const connectionRequest = await connectionRequestModel.findOne({
        _id: reviewRequestId,
        toUserId: loggedInUser._id,
        connectionRequestStatus: "interested",
      });

      if (!connectionRequest) {
        return response
          .status(404)
          .send({ message: "Connection request not found." });
      }

      /* If it is valid request then update the status of connection request */
      connectionRequest.connectionRequestStatus = reviewRequestStatus;
      const connectionRequestData = await connectionRequest.save();
      return response.status(200).send(connectionRequestData);
    } catch (error) {
      return response.status(400).send({ message: `${error.message}` });
    }
  }
);

module.exports = { connectionRequestRouter };
