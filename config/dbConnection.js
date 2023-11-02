const mongoose = require("mongoose");

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.CONNECTION_STRING, {});
    console.log("Connection established ");
  } catch (error) {
    console.log("error on connectDb", error);
  }
};

module.exports = connectDb;
