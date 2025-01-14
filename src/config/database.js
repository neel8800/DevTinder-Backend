const mongoose = require("mongoose");

/* Creating connection to database */
const connectDB = async () => {
  console.log("Connecting to database....");
  await mongoose.connect(
    "mongodb+srv://pneel8800:Neel7613@namastenodejs.bmo0i.mongodb.net/DevTinder"
  );
};

module.exports = { connectDB };
