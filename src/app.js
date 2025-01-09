const express = require("express");
const { adminAuth, userAuth } = require("./middleware/auth");

const app = express();

app.use("/admin", adminAuth);

app.get("/admin", (req, res) => {
  res.status(200).send([
    {
      userName: "admin",
      role: "admin",
    },
  ]);
});

app.post("/admin", (req, res) => {
  res.status(201).send([
    {
      userName: "admin1",
      role: "admin",
    },
  ]);
});

app.get("/user", userAuth, (req, res) => {
  try {
    throw new Error("User not found");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.listen(8888, () => {
  console.log("DevTinder-Backend is running and listening on port 8888...");
});
