const express = require("express");
const { connectDB } = require("./config/database");
const { UserModel } = require("./models/user");

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

/* Users APIs */
app.post("/signup", async (request, response) => {
  const userData = new UserModel(request.body);
  try {
    await userData.save();
    response.status(201).send({ _id: userData._id });
  } catch (error) {
    response.status(400).send("Error while signing up user");
  }
});

app.get("/users", async (request, response) => {
  const filterData = request.body;
  console.log(filterData);
  try {
    const usersData = await UserModel.find(filterData);
    response.status(200).send(usersData);
  } catch (error) {
    response.status(404).send("Something went wrong");
  }
});

app.get("/users/:id", async (request, response) => {
  const userId = request.params?.id;
  try {
    const userData = await UserModel.findById(userId);
    response.status(200).send(userData);
  } catch (error) {
    response.status(404).send("Something went wrong");
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
  // const userData = new UserModel(request.body);
  const userData = request.body;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {
      returnDocument: "after",
    });
    response.status(200).send(updatedUser);
  } catch (error) {
    console.log(error);
    response.status(404).send("Something went wrong");
  }
});
