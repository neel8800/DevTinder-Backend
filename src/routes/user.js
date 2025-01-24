const express = require("express");
const { userAuth } = require("../middleware/auth");
const { connectionRequestModel } = require("../models/connectionRequest");
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

module.exports = { userRouter };
