const express = require("express");
const cookieParser = require("cookie-parser");

const { connectDB } = require("./config/database");

const { authenticationRouter } = require("./routes/authentication");
const { userProfileRouter } = require("./routes/userProfile");
const { connectionRequestRouter } = require("./routes/connectionRequest");

/* Initializing application */
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

/* Setting up APIs to work with JSON data */
app.use(express.json());
app.use(cookieParser());

/* Routers that handles the user requests */
app.use("/", authenticationRouter);
app.use("/", userProfileRouter);
app.use("/", connectionRequestRouter);
