const express = require("express");
const { userAuth } = require("../middleware/auth");
const { connectionRequestModel } = require("../models/connectionRequest");
const { UserModel } = require("../models/user");
const userRouter = express.Router();

userRouter.get(
  "/user/request/received",
  userAuth,
  async (request, response) => {
    try {
      const loggedInUser = request.user;
      const receivedConnectionRequests = await connectionRequestModel
        .find({
          toUserId: loggedInUser._id,
          connectionRequestStatus: "interested",
        })
        .populate("fromUserId", [
          "firstName",
          "lastName",
          "age",
          "about",
          "skills",
          "photoUrl",
          "gender",
        ]);

      response.status(200).send(receivedConnectionRequests);
    } catch (error) {
      return response.status(400).send({ message: `${error.message}` });
    }
  }
);

userRouter.get("/user/connections", userAuth, async (request, response) => {
  try {
    const loggedInUser = request.user;
    const connections = await connectionRequestModel
      .find({
        $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
        $and: [{ connectionRequestStatus: "accepted" }],
      })
      .populate("fromUserId", [
        "firstName",
        "lastName",
        "age",
        "about",
        "skills",
        "photoUrl",
        "gender",
      ])
      .populate("toUserId", [
        "firstName",
        "lastName",
        "age",
        "about",
        "skills",
        "photoUrl",
        "gender",
      ]);

    /* 
      We can use .toString() method to compare the objects IDs
      console.log(connection.fromUserId._id.toString() === loggedInUser._id.toString());
    */
    const connectionData = connections.map((connection) => {
      if (connection.fromUserId._id.equals(loggedInUser._id)) {
        return connection.toUserId;
      } else {
        return connection.fromUserId;
      }
    });
    response.status(200).send(connectionData);
  } catch (error) {
    return response.status(400).send({ message: `${error.message}` });
  }
});

userRouter.get("/user/feed", userAuth, async (request, response) => {
  try {
    const loggedInUser = request.user;
    const pageNumber = parseInt(request.query.page) || 0;
    const limitUser = Math.min(parseInt(request.query.limit) || 10, 50);
    const skipUser = Math.max(0, pageNumber - 1) * limitUser;

    const receivedConnectionRequests = await connectionRequestModel
      .find({
        $or: [{ toUserId: loggedInUser._id }, { fromUserId: loggedInUser._id }],
      })
      .select(["fromUserId", "toUserId"]);

    const hiddenUsers = new Set();

    receivedConnectionRequests.forEach((connectionRequest) => {
      hiddenUsers.add(connectionRequest.fromUserId.toString());
      hiddenUsers.add(connectionRequest.toUserId.toString());
    });

    const usersForFeed = await UserModel.find({
      _id: { $nin: Array.from(hiddenUsers) },
    })
      .select([
        "firstName",
        "lastName",
        "age",
        "about",
        "skills",
        "photoUrl",
        "gender",
      ])
      .skip(skipUser)
      .limit(limitUser);

    response.status(200).send(usersForFeed);
  } catch (error) {
    return response.status(400).send({ message: `${error.message}` });
  }
});

module.exports = { userRouter };
