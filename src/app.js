const express = require("express");
const { connectDB } = require("./config/database");
const { UserModel } = require("./models/user");
const { allowedUpdateFields } = require("./constants/userSchemaConstants");
const bcrypt = require("bcrypt");
const { validateSignup, validateLogin } = require("./utils/userDataValidation");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middleware/auth");

const app = express();

/* Connecting to database cluster */
connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(8888, () => {
      console.log("DevTinder-Backend is running and listening on port 8888...");
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

/* Routers and handlers */

/* Setting up APIs to work with JSON data */
app.use(express.json());
app.use(cookieParser());

/* Users APIs */
app.post("/signup", async (request, response) => {
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

app.post("/login", async (request, response) => {
  try {
    const token = await validateLogin(request);
    response.cookie("token", token);
    response.status(200).send("Login successful.");
  } catch (error) {
    response.status(400).send(`${error}`);
  }
});

app.get("/profile", userAuth, async (request, response) => {
  try {
    const loggedInUser = request.user;
    response.status(200).send(loggedInUser);
  } catch (error) {
    response.status(400).send(`${error}`);
  }
});

app.post("/sendConnectionRequest", userAuth, async (request, response) => {
  try {
    const { email } = request.user;
    response.status(200).send(`${email} has sent connection request.`);
  } catch (error) {
    response.status(400).send(`${error}`);
  }
});

app.get("/users", async (request, response) => {
  const filterData = request.body;
  console.log(filterData);
  try {
    const usersData = await UserModel.find(filterData);
    response.status(200).send(usersData);
  } catch (error) {
    response.status(404).send(`${error}`);
  }
});

app.get("/users/:id", async (request, response) => {
  const userId = request.params?.id;
  try {
    const userData = await UserModel.findById(userId);
    response.status(200).send(userData);
  } catch (error) {
    response.status(404).send(`${error}`);
  }
});

/* We have kept this API commented for safety purpose */
/*
app.delete("/users", async (request, response) => {
  try {
    await UserModel.deleteMany({});
    response.send(204).send();
  } catch (error) {
    response.status(404).send("Something went wrong");
  }
});
*/

app.delete("/users/:id", async (request, response) => {
  const userId = request.params?.id;
  try {
    await UserModel.findByIdAndDelete(userId);
    response.status(204).send();
  } catch (error) {
    response.status(404).send("Something went wrong");
  }
});

app.patch("/users/:id", async (request, response) => {
  const userId = request.params?.id;
  const userData = request.body;
  try {
    const isUpdateAllowed = Object.keys(userData).every((key) =>
      allowedUpdateFields.includes(key)
    );

    if (!isUpdateAllowed) {
      throw new Error(
        `Update is allowed only on fields: ${allowedUpdateFields}.`
      );
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {
      returnDocument: "after",
      runValidators: true,
    });
    response.status(200).send(updatedUser);
  } catch (error) {
    response.status(404).send("Something went wrong: " + error);
  }
});
