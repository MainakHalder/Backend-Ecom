const mongoose = require("mongoose");
require("dotenv").config();

// const mongoUri = process.env.MONGODB;

// const initializeDatabase = async () => {
//   await mongoose
//     .connect(mongoUri, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//       serverSelectionTimeoutMS: 30000,
//     })
//     .then(() => console.log("Connected to database"))
//     .catch((error) => console.log("Error connecting the database ", error));
// };

const initializeDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB, {
      serverSelectionTimeoutMS: 30000,
    });
    if (connection) {
      console.log("DB connection successfully");
    } else {
      console.log("DB Connection failed");
    }
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = { initializeDatabase };
