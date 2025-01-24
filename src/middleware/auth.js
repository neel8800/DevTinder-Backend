const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");

/* Middleware for admin user */
const adminAuth = (req, res, next) => {
  const adminToken = "neel";
  if (adminToken === "neel") {
    next();
  } else {
    res.status(401).send("Unauthorized Admin");
  }
};

/* Middleware for user authentication */
const userAuth = async (request, response, next) => {
  try {
    const { token } = request.cookies;
    if (!token) {
      throw new Error("Invalid token.");
    }
    const { _id } = await jwt.verify(token, "$Neel@8800");
    const loggedInUser = await UserModel.findById(_id);
    if (!loggedInUser) {
      throw new Error("User does not exist.");
    }
    request.user = loggedInUser;
    next();
  } catch (error) {
    response.status(400).send({ message: `${error.message}` });
  }
};

module.exports = { adminAuth, userAuth };
